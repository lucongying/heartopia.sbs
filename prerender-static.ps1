# ============================================================
# Heartopia Guide - Static content prerender (AdSense crawlability)
#
# Bakes server-rendered fallback content into the static HTML so
# crawlers see full page content and site navigation without
# executing JavaScript:
#   * static nav + footer links (About / Contact / Privacy / Terms)
#   * static data tables on the 8 database-*.html pages
#   * static marker directory on map.html
# The interactive JS still enhances the page for real users; the
# static fallback is hidden via CSS once JS is active (html.js).
#
# Idempotent - safe to run repeatedly.
# Usage:  powershell -ExecutionPolicy Bypass -File prerender-static.ps1
# ============================================================

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$tplDir = Join-Path $root '_templates'
$cssPath = Join-Path $root 'css\style.css'

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

# ---------- IO helpers ----------
function Read-Utf8([string]$Path) {
  return [System.IO.File]::ReadAllText($Path)
}
function Write-Utf8([string]$Path, [string]$Content) {
  [System.IO.File]::WriteAllText($Path, $Content, $Utf8NoBom)
}

# ---------- rendering helpers ----------
function Enc([string]$Value) {
  return [System.Net.WebUtility]::HtmlEncode($Value)
}

function ConvertTo-TitleCase([string]$Value) {
  # Mirrors js/i18n.js displayNameEn(): case-sensitive camelCase split,
  # then uppercase the first letter of each word (does NOT lowercase the rest).
  if ([string]::IsNullOrWhiteSpace($Value)) { return $Value }
  $s = $Value.Trim()
  if (-not $s) { return $s }
  $s = $s -creplace '-', ' '
  $s = $s -creplace '([a-z0-9])([A-Z])', '$1 $2'
  $words = $s -split ' '
  $parts = foreach ($w in $words) {
    if ([string]::IsNullOrEmpty($w)) { $w }
    elseif ($w -cmatch '^[a-z]') { $w.Substring(0,1).ToUpperInvariant() + $w.Substring(1) }
    else { $w }
  }
  return ($parts -join ' ')
}

function Display-Name($Item) {
  $en = ConvertTo-TitleCase ([string]$Item.enName)
  $cn = [string]$Item.name
  if ($en -and $cn -and ($en -ne $cn)) { return "$en ($cn)" }
  if ($en) { return $en }
  if ($cn) { return $cn }
  return ''
}

function Stars($N) {
  $r = 1
  try { if ($null -ne $N) { $r = [int]$N } } catch { $r = 1 }
  if ($r -lt 1) { $r = 1 }
  elseif ($r -gt 5) { $r = 5 }
  return ('&#9733;' * $r) + ('&#9734;' * (5 - $r))
}

function Render-Cell($Item, $Spec) {
  switch ($Spec.F) {
    'Name'       { return Enc (Display-Name $Item) }
    'Rarity'     { return Stars $Item.rarity }
    'Difficulty' { return Stars $Item.difficulty }
    'Price' {
      if ($null -ne $Item.sellPrice) {
        $p = 0.0
        if ([double]::TryParse([string]$Item.sellPrice, [ref]$p)) {
          if ($p -gt 0) { return (Enc ([string]$Item.sellPrice)) + ' G' }
        }
      }
      return '&mdash;'
    }
    'Notes' {
      if ($Item.cookAdvice) { return Enc ([string]$Item.cookAdvice) }
      elseif ($Item.note) { return Enc ([string]$Item.note) }
      else { return '&mdash;' }
    }
    'BirdLv' {
      if ($Item.birdLv) { return 'Lv.' + (Enc ([string]$Item.birdLv)) }
      else { return '&mdash;' }
    }
    default { return Enc ([string]($Item.($Spec.F))) }
  }
}

function Build-Table($Items, $Cols) {
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.Append('<table class="static-table"><thead><tr>')
  foreach ($c in $Cols) { [void]$sb.Append('<th>' + $c.H + '</th>') }
  [void]$sb.Append('</tr></thead><tbody>')
  foreach ($it in $Items) {
    [void]$sb.Append('<tr>')
    foreach ($c in $Cols) {
      $v = [string](Render-Cell $it $c)
      if ([string]::IsNullOrWhiteSpace($v)) { $v = '&mdash;' }
      [void]$sb.Append('<td>' + $v + '</td>')
    }
    [void]$sb.Append('</tr>')
  }
  [void]$sb.Append('</tbody></table>')
  return $sb.ToString()
}

function Build-DbSection($Cat, $Count, $TableHtml) {
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.AppendLine('<section id="db-static" class="db-static">')
  [void]$sb.AppendLine('  <h2>' + $Cat.title + ' Database</h2>')
  [void]$sb.AppendLine('  <p>' + $Count + ' entries listed below. Server-rendered so search engines can read the full reference without JavaScript.</p>')
  [void]$sb.Append($TableHtml)
  [void]$sb.AppendLine('</section>')
  return $sb.ToString()
}

function Build-MapSection($Markers) {
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.AppendLine('<section id="map-static" class="db-static">')
  [void]$sb.AppendLine('  <h2>Map Marker Directory</h2>')
  [void]$sb.AppendLine('  <p>' + (@($Markers).Count) + ' locations, NPCs, fishing spots, shops, wildlife and landmarks across the island.</p>')
  [void]$sb.AppendLine('  <ul class="static-list">')
  foreach ($m in $Markers) {
    $emoji = [string]$m.emoji
    $name = Enc ([string]$m.name)
    $catKey = [string]$m.category
    $catLabel = $MapCatLabels[$catKey]
    if (-not $catLabel) { $catLabel = $catKey }
    $desc = Enc ([string]$m.desc)
    $li = '<li>'
    if ($emoji) { $li += '<strong>' + $emoji + ' ' + $name + '</strong>' } else { $li += '<strong>' + $name + '</strong>' }
    $li += ' <span>(' + $catLabel + ')</span>'
    if ($desc) { $li += ' &mdash; ' + $desc }
    $li += '</li>'
    [void]$sb.AppendLine('    ' + $li)
  }
  [void]$sb.AppendLine('  </ul>')
  [void]$sb.AppendLine('</section>')
  return $sb.ToString()
}

# ---------- section removal (makes re-injection idempotent + self-healing) ----------
function Remove-Section([string]$Content, [string]$Id) {
  $pattern = '(?s)<section id="' + $Id + '" class="db-static">.*?</section>\s*'
  return [regex]::Replace($Content, $pattern, '')
}

# ---------- data loader (reads the inline data/*.js files) ----------
function Load-DataJs([string]$Path) {
  $txt = Read-Utf8 $Path
  $txt = $txt -replace '^\s*var\s+\w+\s*=\s*', ''
  $txt = $txt -replace '(?m)^\s*//[^\r\n]*', ''
  $txt = $txt.Trim()
  $txt = $txt -replace ';+$', ''
  return ($txt | ConvertFrom-Json)
}

# ---------- category config ----------
$Cats = @(
  @{ key='fish'; page='database-fish.html'; src='data/fish.js'; title='Fish'; cols=@(
    @{H='Name';F='Name'}, @{H='Location';F='location'}, @{H='Season';F='season'}, @{H='Weather';F='weather'}, @{H='Time';F='time'}, @{H='Rarity';F='Rarity'}, @{H='Price';F='Price'}, @{H='Notes';F='Notes'}
  )},
  @{ key='insects'; page='database-insects.html'; src='data/insects.js'; title='Insects'; cols=@(
    @{H='Name';F='Name'}, @{H='Location';F='location'}, @{H='Season';F='season'}, @{H='Weather';F='weather'}, @{H='Time';F='time'}, @{H='Rarity';F='Rarity'}, @{H='Price';F='Price'}, @{H='Notes';F='Notes'}
  )},
  @{ key='birds'; page='database-birds.html'; src='data/birds.js'; title='Birds'; cols=@(
    @{H='Name';F='Name'}, @{H='Location';F='location'}, @{H='Season';F='season'}, @{H='Weather';F='weather'}, @{H='Time';F='time'}, @{H='Rarity';F='Rarity'}, @{H='Birdwatch Lv';F='BirdLv'}
  )},
  @{ key='recipes'; page='database-recipes.html'; src='data/recipes.js'; title='Recipes'; cols=@(
    @{H='Name';F='Name'}, @{H='Ingredients';F='ingredients'}, @{H='Energy';F='energy'}, @{H='Price';F='Price'}, @{H='Star 2';F='star2Price'}, @{H='Profit';F='profit'}, @{H='Unlock';F='unlock'}
  )},
  @{ key='crops'; page='database-crops.html'; src='data/crops.js'; title='Crops'; cols=@(
    @{H='Name';F='Name'}, @{H='Category';F='category'}, @{H='Growth';F='growthTime'}, @{H='Season';F='season'}, @{H='Harvest';F='harvestType'}, @{H='Price';F='Price'}, @{H='Seed';F='seedPrice'}, @{H='Profit/h';F='profitPerHour'}, @{H='Priority';F='priority'}, @{H='Unlock';F='unlock'}
  )},
  @{ key='npcs'; page='database-npcs.html'; src='data/npcs.js'; title='NPCs'; cols=@(
    @{H='Name';F='Name'}, @{H='Role';F='role'}, @{H='Location';F='location'}, @{H='Schedule';F='schedule'}, @{H='Unlock';F='unlock'}, @{H='Favorite Gifts';F='favoriteGifts'}, @{H='Description';F='description'}
  )},
  @{ key='achievements'; page='database-achievements.html'; src='data/achievements.js'; title='Achievements'; cols=@(
    @{H='Name';F='Name'}, @{H='Category';F='category'}, @{H='Description';F='description'}, @{H='Unlock';F='unlock'}, @{H='Reward';F='reward'}, @{H='Difficulty';F='Difficulty'}
  )},
  @{ key='scores'; page='database-scores.html'; src='data/scores.js'; title='Sheet Music'; cols=@(
    @{H='Name';F='Name'}, @{H='Source';F='source'}, @{H='Instrument';F='instrument'}, @{H='Difficulty';F='Difficulty'}, @{H='Unlock';F='unlock'}
  )}
)

$MapCatLabels = @{
  'npc'='NPC'; 'resource'='Resource'; 'fishing'='Fishing Spot'; 'shop'='Shop';
  'location'='Location'; 'bus'='Bus Stop'; 'animal'='Animal'; 'bird'='Bird Watching'; 'insect'='Insect Spot'
}

# ---------- run ----------
$navHtml = (Read-Utf8 (Join-Path $tplDir 'site-nav.html')).Trim()
$footerHtml = (Read-Utf8 (Join-Path $tplDir 'site-footer.html')).Trim()

$navPlaceholder = '<nav id="site-nav" class="site-nav"></nav>'
$footerPlaceholder = '<footer id="site-footer" class="site-footer"></footer>'
$gridAnchor = '<div class="db-card-grid" id="data-grid"></div>'

$catByPage = @{}
foreach ($c in $Cats) { $catByPage[$c.page] = $c }

$htmlFiles = Get-ChildItem -Path $root -Filter '*.html'
$changedFiles = 0

foreach ($f in $htmlFiles) {
  $name = $f.Name
  $content = Read-Utf8 $f.FullName
  $changed = $false

  # 1. static nav
  if ($content.Contains($navPlaceholder)) {
    $content = $content.Replace($navPlaceholder, $navHtml)
    $changed = $true
  }

  # 2. static database table + result count
  $cat = $catByPage[$name]
  if ($cat) {
    $content = Remove-Section $content 'db-static'
    $data = Load-DataJs (Join-Path $root $cat.src)
    $count = @($data).Count
    $table = Build-Table $data $cat.cols
    $section = Build-DbSection $cat $count $table
    $content = $content.Replace($gridAnchor, $gridAnchor + "`r`n" + $section)
    $content = [regex]::Replace($content, '(<div id="result-count"[^>]*>)[^<]*(</div>)', ('${1}' + $count + ' items${2}'))
    $changed = $true
  }

  # 3. static map directory (insert before footer placeholder)
  if ($name -eq 'map.html' -and -not $content.Contains('id="map-static"')) {
    $markers = Load-DataJs (Join-Path $root 'data/map-markers.json')
    $section = Build-MapSection $markers
    if ($content.Contains($footerPlaceholder)) {
      $content = $content.Replace($footerPlaceholder, $section + "`r`n" + $footerPlaceholder)
      $changed = $true
    }
  }

  # 4. static footer
  if ($content.Contains($footerPlaceholder)) {
    $content = $content.Replace($footerPlaceholder, $footerHtml)
    $changed = $true
  }

  if ($changed) {
    Write-Utf8 $f.FullName $content
    $changedFiles++
    Write-Host ("[injected] " + $name)
  }
}

# ---------- CSS (idempotent) ----------
$css = Read-Utf8 $cssPath
if (-not $css.Contains('#db-static')) {
  $cssRule = @'
/* Static (no-JS) fallback content for crawlers and search engines */
#db-static, #map-static { margin-top: 20px; }
html.js #db-static, html.js #map-static { display: none; }
#db-static .static-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
#db-static .static-table th, #db-static .static-table td { border: 1px solid var(--border); padding: 6px 8px; text-align: left; }
#db-static .static-table th { background: var(--surface); }
#db-static h2, #map-static h2 { margin: 0 0 8px; }
#map-static .static-list { list-style: none; padding: 0; }
#map-static .static-list li { padding: 6px 0; border-bottom: 1px solid var(--border); font-size: 0.85rem; }
'@
  Write-Utf8 $cssPath ($css.TrimEnd() + "`r`n`r`n" + $cssRule + "`r`n")
  Write-Host '[injected] css/style.css'
} else {
  Write-Host '[skip] css/style.css (already present)'
}

Write-Host ("Done. " + $changedFiles + " HTML file(s) updated.")
