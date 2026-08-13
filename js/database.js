/* ============================================================
   Heartopia Guide · Database Engine
   Search, filter, tab switching for the database page
   Supports: fish, insects, birds, recipes, crops, npcs
   ============================================================ */

let allData = { fish: [], insects: [], birds: [], recipes: [], crops: [], npcs: [], achievements: [], scores: [] };
let currentTab = 'fish';
let dataLoaded = false;

// ---- i18n shortcuts (window.I18N from js/i18n.js) ----
function _name(item) { return window.I18N ? window.I18N.nameFor(item) : (item && item.name); }
function _L(v) { return window.I18N ? window.I18N.L(v) : v; }
function _t(key, params) { return window.I18N ? window.I18N.t(key, params) : key; }
function _sub(item) {
  if (!item || !item.nameEn) return '';
  if (window.I18N && window.I18N.getLang() === 'en') return '';
  var en = window.I18N ? window.I18N.displayNameEn(item.nameEn) : item.nameEn;
  return en ? '<span class="fish-card-subtitle">' + en + '</span>' : '';
}

// ---- Load JSON data ----
// 优先使用内联 JS 数据（支持 file:// 协议），fallback 到 fetch（HTTP 服务器）
async function loadData(keys) {
  if (dataLoaded) return;

  // 统一数据源清单：JS 内联变量名 + fetch fallback 路径
  var DATA_SOURCES = [
    { key: 'fish', varName: 'FISH_DATA', url: 'data/fish.json' },
    { key: 'insects', varName: 'INSECTS_DATA', url: 'data/insects.json' },
    { key: 'birds', varName: 'BIRDS_DATA', url: 'data/birds.json' },
    { key: 'recipes', varName: 'RECIPES_DATA', url: 'data/recipes.json' },
    { key: 'crops', varName: 'CROPS_DATA', url: 'data/crops.json' },
    { key: 'npcs', varName: 'NPCS_DATA', url: 'data/npcs.json' },
    { key: 'achievements', varName: 'ACHIEVEMENTS_DATA', url: 'data/achievements.json' },
    { key: 'scores', varName: 'SCORES_DATA', url: 'data/scores.json' }
  ];

  // 按需加载：keys 缺省时加载全部（用于站点搜索），否则只加载指定类目
  var wanted = keys && keys.length ? keys : DATA_SOURCES.map(function(s) { return s.key; });
  var sources = DATA_SOURCES.filter(function(s) { return wanted.indexOf(s.key) !== -1; });

  // 内联 JS 数据可用则直接用（支持 file:// 本地打开），否则 fetch JSON
  var toFetch = sources.filter(function(s) { return typeof window[s.varName] === 'undefined'; });

  sources.forEach(function(s) {
    if (typeof window[s.varName] !== 'undefined') {
      allData[s.key] = window[s.varName];
      console.log('[数据库] ✅ ' + s.key + ': ' + allData[s.key].length + ' 条');
    }
  });

  if (toFetch.length) {
    console.log('[数据库] JS 数据未找到，尝试 fetch 加载…');
    var results = await Promise.allSettled(
      toFetch.map(function(s) {
        return fetch(s.url).then(function(r) {
          if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + s.url);
          return r.json();
        }).then(function(d) { return { key: s.key, data: d }; });
      })
    );
    results.forEach(function(r) {
      if (r.status === 'fulfilled') {
        console.log('[数据库] ✅ ' + r.value.key + ': ' + r.value.data.length + ' 条');
        allData[r.value.key] = r.value.data;
      } else {
        console.warn('[数据库] ❌ 加载失败: ' + r.reason);
      }
    });
  }

  dataLoaded = true;
}

// ---- Switch tabs ----
function switchTab(tabId) {
  console.log('[数据库] 切换标签:', tabId);
  currentTab = tabId;
  applyFilters();
}

// ---- Apply search + filters ----
function applyFilters() {
  const searchTerm = (document.getElementById('global-search')?.value || '').toLowerCase().trim();
  const data = allData[currentTab] || [];
  const grid = document.getElementById('data-grid');
  const tbody = document.getElementById('data-tbody');
  const countEl = document.getElementById('result-count');
  const emptyEl = document.getElementById('empty-state');
  const tableEl = document.getElementById('data-table');

  // Detect render mode: card grid (new) vs table (legacy)
  const isCardMode = !!grid;
  const container = grid || tbody;

  if (!container) {
    console.warn('[数据库] 容器元素未找到');
    return;
  }

  let filtered = [...data];

  // Search
  if (searchTerm) {
    filtered = filtered.filter(item => {
      return Object.values(item).some(v =>
        String(v).toLowerCase().includes(searchTerm)
      );
    });
  }

  console.log(`[数据库] 当前标签=${currentTab}, 总数=${data.length}, 过滤后=${filtered.length}, 模式=${isCardMode ? '卡片' : '表格'}`);

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (countEl) countEl.textContent = data.length === 0 ? _t('db.loading') : _t('db.noResults');
    if (emptyEl) emptyEl.style.display = 'block';
    if (tableEl) tableEl.style.display = 'none';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (tableEl) tableEl.style.display = isCardMode ? 'none' : '';

  if (countEl) countEl.textContent = _t('db.found', { n: filtered.length });

  // Render: card grid or table rows
  if (isCardMode) {
    container.innerHTML = filtered.map(function(item) { return renderCard(currentTab, item); }).join('');
  } else {
    container.innerHTML = filtered.map(function(item) { return renderRow(currentTab, item); }).join('');
  }
}

// ---- Render a table row ----
function renderRow(tab, item) {
  switch (tab) {
    case 'fish':
      return `<tr>
        <td><strong>${item.name}</strong></td>
        <td><span class="badge badge-teal">${item.location}</span></td>
        <td>${item.season}</td>
        <td>${item.weather}</td>
        <td>${item.time}</td>
        <td><span class="stars">${'★'.repeat(item.rarity || 1)}<span>${'☆'.repeat(5-(item.rarity || 1))}</span></span></td>
        <td class="num">${item.sellPrice}</td>
        <td>${item.cookAdvice || item.note || '—'}</td>
      </tr>`;
    case 'insects':
      return `<tr>
        <td><strong>${item.name}</strong></td>
        <td><span class="badge badge-teal">${item.location}</span></td>
        <td>${item.season || '未知'}</td>
        <td>${item.weather}</td>
        <td>${item.time}</td>
        <td><span class="stars">${'★'.repeat(item.rarity || 1)}<span>${'☆'.repeat(5-(item.rarity || 1))}</span></span></td>
        <td class="num">${item.sellPrice > 0 ? item.sellPrice : '—'}</td>
        <td>${item.note || '—'}</td>
      </tr>`;
    case 'birds':
      var bRowRarity = item.rarity || 1;
      return `<tr>
        <td><strong>${item.name}</strong></td>
        <td><span class="badge badge-teal">${item.location}</span></td>
        <td>${item.season || '全年'}</td>
        <td>${item.weather}</td>
        <td>${item.time}</td>
        <td><span class="stars">${'★'.repeat(bRowRarity)}<span>${'☆'.repeat(5 - bRowRarity)}</span></span></td>
        <td><span class="badge badge-lavender">Lv.${item.birdwatchLevel}</span></td>
      </tr>`;
    case 'recipes':
      return `<tr>
        <td><strong>${item.name}</strong></td>
        <td style="font-size:0.82rem">${item.ingredients}</td>
        <td class="num">${item.energy}</td>
        <td class="num">${item.sellPrice}</td>
        <td class="num">${item.star2Price}</td>
        <td class="num" style="color:var(--coral);">${item.profit}</td>
        <td>${item.unlock}</td>
      </tr>`;
    case 'crops':
      return `<tr>
        <td><strong>${item.name}</strong></td>
        <td><span class="badge" style="font-size:0.7rem;padding:1px 7px;background:var(--surface);color:var(--text-dim);border:1px solid var(--border)">${getCropEmoji(item.nameEn, item.name, item.category).emoji} ${item.category || '作物'}</span></td>
        <td>${item.growthTime}</td>
        <td>${item.season}</td>
        <td>${item.harvestType || '单次收获'}</td>
        <td class="num">${item.sellPrice}</td>
        <td class="num">${item.seedPrice > 0 ? item.seedPrice : '免费'}</td>
        <td class="num">${typeof item.profitPerHour === 'number' ? item.profitPerHour.toFixed(1) : item.profitPerHour}</td>
        <td><span class="badge ${cropPriorityBadgeClass(item.priority)}">${item.priority}</span></td>
        <td style="font-size:0.78rem">${item.unlock || '—'}</td>
      </tr>`;
    case 'npcs':
      return `<tr>
        <td><strong>${item.name}</strong></td>
        <td><span class="badge badge-coral">${item.role}</span></td>
        <td>${item.location}</td>
        <td>${item.schedule}</td>
        <td>${item.unlock}</td>
        <td style="font-size:0.82rem">${item.favoriteGifts}</td>
        <td style="font-size:0.82rem;max-width:200px">${item.description || '—'}</td>
      </tr>`;
    case 'achievements':
      var aDiff = item.difficulty || 1;
      return `<tr>
        <td><strong>${item.name}</strong></td>
        <td><span class="badge badge-teal">${item.category}</span></td>
        <td style="font-size:0.85rem">${item.description}</td>
        <td>${item.unlock}</td>
        <td><span class="badge badge-gold">${item.reward}</span></td>
        <td><span class="stars">${'★'.repeat(aDiff)}<span>${'☆'.repeat(5 - aDiff)}</span></span></td>
      </tr>`;
    case 'scores':
      return `<tr>
        <td><strong>${item.name}</strong></td>
        <td><span class="badge badge-lavender">${item.source}</span></td>
        <td>${item.instrument}</td>
        <td><span class="stars">${item.difficulty}</span></td>
        <td>${item.unlock}</td>
      </tr>`;
    default:
      return '';
  }
}

// ---- Fish emoji mapping ----
function getFishEmoji(nameEn, name) {
  var en = (nameEn || '').toLowerCase();
  var cn = name || '';

  // Sharks
  if (/shark|nursehound/.test(en) || /鲨/.test(cn)) return { emoji: '🦈', label: '鲨鱼' };
  // Crabs
  if (/crab/.test(en) || /蟹/.test(cn)) return { emoji: '🦀', label: '蟹类' };
  // Lobster
  if (/lobster/.test(en)) return { emoji: '🦞', label: '龙虾' };
  // Shrimp / Prawn / Crayfish
  if (/shrimp|prawn|crayfish/.test(en) || /虾/.test(cn)) return { emoji: '🦐', label: '虾类' };
  // Octopus
  if (/octopus/.test(en) || /章鱼/.test(cn)) return { emoji: '🐙', label: '章鱼' };
  // Squid
  if (/squid/.test(en) || /鱿/.test(cn)) return { emoji: '🦑', label: '鱿鱼' };
  // Pufferfish
  if (/puffer/.test(en) || /河豚/.test(cn)) return { emoji: '🐡', label: '河豚' };
  // Frog
  if (/frog/.test(en) || /蛙/.test(cn)) return { emoji: '🐸', label: '蛙类' };
  // Mussel / Oyster / Clam
  if (/mussel|oyster|clam/.test(en) || /贝|蚌/.test(cn)) return { emoji: '🦪', label: '贝类' };
  // Eel
  if (/eel/.test(en) || /鳗|鳝/.test(cn)) return { emoji: '🐍', label: '鳗鱼' };
  // Seahorse
  if (/seahorse/.test(en) || /海马/.test(cn)) return { emoji: '🐠', label: '海马' };
  // Koi / Carp / Goldfish
  if (/koi|carp|goldfish|barbel|chub|rudd|tench|minnow|bleak|roach|dace|ide|orfe/.test(en) || /鲤|鲫|金鱼|锦鲤|鲃|红眼|丁鱥|雅罗|欧鲌|鳉/.test(cn)) return { emoji: '🎏', label: '鲤科' };
  // Salmon / Trout / Char
  if (/salmon|trout|char|grayling|huchen|whitefish/.test(en) || /鲑|鳟|茴|哲罗/.test(cn)) return { emoji: '🐟', label: '鲑科' };
  // Tuna
  if (/tuna|mackerel|scad|skipjack/.test(en) || /金枪鱼|鲭|竹荚|鲣/.test(cn)) return { emoji: '🐟', label: '远洋鱼' };
  // Bass / Perch / Zander
  if (/bass|perch|zander|ruffe|goby/.test(en) || /鲈|梭鲈|梅花鲈|虾虎/.test(cn)) return { emoji: '🐟', label: '鲈形目' };
  // Flatfish
  if (/plaice|turbot|halibut|sole|flounder|bream|mullet|gurnard/.test(en) || /鲽|鲆|菱鲆|鲷|绯鲤|鲂/.test(cn)) return { emoji: '🐟', label: '海鱼' };
  // Catfish
  if (/catfish|wels|burbot/.test(en) || /鲶|鮰|江鱈/.test(cn)) return { emoji: '🐟', label: '鲶形目' };
  // Sunfish / Bluegill / Pumpkinseed
  if (/sunfish|bluegill|pumpkinseed/.test(en) || /太阳鱼|蓝鳃/.test(cn)) return { emoji: '🐠', label: '太阳鱼' };
  // Pike
  if (/pike/.test(en) || /狗鱼/.test(cn)) return { emoji: '🐟', label: '狗鱼科' };
  // Clownfish / Tropical
  if (/clownfish|rabbitfish/.test(en) || /小丑|兔子/.test(cn)) return { emoji: '🐠', label: '珊瑚鱼' };
  // Loach
  if (/loach/.test(en) || /鳅/.test(cn)) return { emoji: '🐟', label: '鳅科' };
  // Stickleback
  if (/stickleback/.test(en) || /刺鱼/.test(cn)) return { emoji: '🐟', label: '刺鱼科' };
  // Smelt
  if (/smelt/.test(en) || /胡瓜/.test(cn)) return { emoji: '🐟', label: '胡瓜鱼' };
  // Oarfish
  if (/oarfish/.test(en) || /皇带鱼/.test(cn)) return { emoji: '🐟', label: '深海鱼' };
  // Moonfish / Sunfish (ocean)
  if (/moonfish|oceanSunfish/.test(en) || /翻车|月鱼/.test(cn)) return { emoji: '🌊', label: '大型鱼' };
  // Tadpole
  if (/tadpole/.test(en) || /蝌蚪/.test(cn)) return { emoji: '🐟', label: '幼体' };
  // Special / Legendary
  if (/king|legendary|golden/i.test(en) || /王|传奇|黄金|皇/.test(cn)) return { emoji: '👑', label: '传说' };
  // Rainbow
  if (/rainbow/i.test(en) || /彩虹/.test(cn)) return { emoji: '🌈', label: '稀有' };
  // Anglerfish
  if (/angler/.test(en) || /鮟鱇/.test(cn)) return { emoji: '🐟', label: '深海鱼' };
  // Hermit crab
  if (/hermit/.test(en) || /寄居/.test(cn)) return { emoji: '🦀', label: '寄居蟹' };

  // Default
  return { emoji: '🐟', label: '鱼类' };
}

// ---- Insect emoji mapping ----
function getInsectEmoji(nameEn, name) {
  var en = (nameEn || '').toLowerCase();
  var cn = name || '';

  // Butterfly
  if (/butterfly|swallowtail|morpho|birdwing|brimstone|emperor|mourning|peacock|chestnut|tiger|orangeTip|postman|motherOfPearl/i.test(en) || /蝶/.test(cn)) return { emoji: '🦋', label: '蝶类' };
  // Moth
  if (/moth|hawkmoth/i.test(en) || /蛾/.test(cn)) return { emoji: '🌙', label: '蛾类' };
  // Beetle (includes stag, scarab, longhorn, etc.)
  if (/beetle|stag|scarab|longhorn/i.test(en) || /甲|锹|金龟|天牛/.test(cn)) return { emoji: '🪲', label: '甲虫' };
  // Dragonfly / Damselfly
  if (/dragonfly|damselfly|skimmer|glider|demoiselle|whitetail/i.test(en) || /蜻|蜓|蟌/.test(cn)) return { emoji: '🏞', label: '蜻蜓' };
  // Bee
  if (/bee|bumblebee|carpenter|cuckoo/i.test(en) || /蜂/.test(cn)) return { emoji: '🐝', label: '蜂类' };
  // Grasshopper / Cricket / Katydid / Locust
  if (/grasshopper|katydid|cricket|locust/i.test(en) || /蝗|螽|蟋/.test(cn)) return { emoji: '🦗', label: '蝗虫' };
  // Mantis
  if (/mantis/i.test(en) || /螳/.test(cn)) return { emoji: '🥷', label: '螳螂' };
  // Ladybug / Ladybird
  if (/ladybug|ladybird|ladyBeetle/i.test(en) || /瓢虫/.test(cn)) return { emoji: '🐞', label: '瓢虫' };
  // Bug / Shieldbug / Firebug
  if (/bug|shieldbug|firebug/i.test(en) || /蝽/.test(cn)) return { emoji: '🔰', label: '蝽类' };
  // Cicada
  if (/cicada/i.test(en) || /蝉/.test(cn)) return { emoji: '🎵', label: '蝉类' };
  // Ant
  if (/ant/i.test(en) || /蚁/.test(cn)) return { emoji: '🐜', label: '蚁类' };
  // Firefly
  if (/firefly/i.test(en) || /萤/.test(cn)) return { emoji: '✨', label: '萤火虫' };

  // Default
  return { emoji: '🦋', label: '昆虫' };
}

// ---- Bird emoji mapping ----
function getBirdEmoji(nameEn, name) {
  var en = (nameEn || '').toLowerCase();
  var cn = name || '';

  // Owls
  if (/owl/.test(en) || /鸮/.test(cn)) return { emoji: '🦉', label: '猫头鹰' };
  // Ducks / Waterfowl
  if (/duck|mallard|eider|wigeon|shelduck|smew/.test(en) || /鸭/.test(cn)) return { emoji: '🦆', label: '水禽' };
  // Birds of prey — falcons, kestrels, hawks, eagles
  if (/falcon|kestrel|hawk|eagle/.test(en) || /隼|鹰|雕/.test(cn)) return { emoji: '🦅', label: '猛禽' };
  // Flamingos
  if (/flamingo/.test(en) || /鹳/.test(cn)) return { emoji: '🦩', label: '火烈鸟' };
  // Cormorants / Shags
  if (/cormorant|shag/.test(en) || /鸬鹚/.test(cn)) return { emoji: '🐦', label: '鸬鹚' };
  // Gulls / Terns / Noddys
  if (/gull|tern|noddy/.test(en) || /鸥|燕鸥/.test(cn)) return { emoji: '🐦', label: '海鸟' };
  // Pigeons / Doves
  if (/pigeon|dove/.test(en) || /鸽|鸠/.test(cn)) return { emoji: '🕊️', label: '鸠鸽' };
  // Woodpeckers
  if (/woodpecker/.test(en) || /啄木鸟/.test(cn)) return { emoji: '🐦', label: '啄木鸟' };
  // Flycatchers
  if (/flycatcher/.test(en) || /鹟/.test(cn)) return { emoji: '🐦', label: '鹟科' };
  // Shrikes
  if (/shrike/.test(en) || /伯劳/.test(cn)) return { emoji: '🐦', label: '伯劳' };
  // Tits / Chickadees
  if (/tit|chickadee/.test(en) || /山雀/.test(cn)) return { emoji: '🐦', label: '山雀' };
  // Finches / Sparrows / Grosbeaks
  if (/finch|sparrow|grosbeak|redpoll|twite|hawfinch|bullfinch/.test(en) || /雀/.test(cn)) return { emoji: '🐦', label: '雀科' };
  // Robins / Wrens / Warblers
  if (/robin|wren|warbler/.test(en) || /鸲|鹪|莺/.test(cn)) return { emoji: '🐦', label: '鸣禽' };
  // Orioles
  if (/oriole/.test(en) || /鹂/.test(cn)) return { emoji: '🐦', label: '黄鹂' };
  // Bee-eaters
  if (/beeEater/.test(en) || /蜂虎/.test(cn)) return { emoji: '🐦', label: '蜂虎' };
  // Nuthatch
  if (/nuthatch/.test(en) || /䴓/.test(cn)) return { emoji: '🐦', label: '䴓科' };
  // Tanagers
  if (/tanager/.test(en) || /唐纳/.test(cn)) return { emoji: '🐦', label: '唐纳雀' };
  // Bowerbirds
  if (/bowerbird/.test(en) || /园丁鸟/.test(cn)) return { emoji: '🐦', label: '园丁鸟' };
  // Reedling / Bearded Tit
  if (/reedling/.test(en) || /文须/.test(cn)) return { emoji: '🐦', label: '文须雀' };
  // Parrotbill
  if (/parrotbill/.test(en) || /鸦雀/.test(cn)) return { emoji: '🐦', label: '鸦雀' };
  // Cardinals
  if (/cardinal/.test(en) || /红雀/.test(cn)) return { emoji: '🐦', label: '红雀' };
  // Bluebirds
  if (/bluebird/.test(en) || /蓝鸲/.test(cn)) return { emoji: '🐦', label: '蓝鸲' };

  // Special / Rare / Legendary
  if (/paradise|golden|imperial|king/.test(en) || /天堂|金色|帝|王/.test(cn)) return { emoji: '✨', label: '稀有' };

  // Default
  return { emoji: '🐦', label: '鸟类' };
}

// ---- Crop emoji mapping ----
function getCropEmoji(nameEn, name, category) {
  var en = (nameEn || '').toLowerCase();
  var cn = name || '';
  var cat = category || '';

  // 谷物类
  if (/wheat/i.test(en) || /麦/.test(cn)) return { emoji: '🌾', label: '谷物' };
  if (/rice/i.test(en) || /稻|米/.test(cn)) return { emoji: '🍚', label: '谷物' };
  if (/corn/i.test(en) || /玉米/.test(cn)) return { emoji: '🌽', label: '谷物' };
  if (/soybean|soy/i.test(en) || /大豆|黄豆/.test(cn)) return { emoji: '🫘', label: '豆类' };
  if (/sugarcane|sugar/i.test(en) || /甘蔗/.test(cn)) return { emoji: '🎋', label: '糖料' };

  // 蔬菜类
  if (/potato/i.test(en) || /土豆|马铃薯/.test(cn)) return { emoji: '🥔', label: '蔬菜' };
  if (/tomato/i.test(en) || /番茄|西红柿/.test(cn)) return { emoji: '🍅', label: '蔬菜' };
  if (/carrot/i.test(en) || /胡萝卜/.test(cn)) return { emoji: '🥕', label: '蔬菜' };
  if (/chili|pepper.*hot|hot.*pepper/i.test(en) || /辣椒/.test(cn)) return { emoji: '🌶️', label: '蔬菜' };
  if (/cucumber/i.test(en) || /黄瓜/.test(cn)) return { emoji: '🥒', label: '蔬菜' };
  if (/onion/i.test(en) || /洋葱/.test(cn)) return { emoji: '🧅', label: '蔬菜' };
  if (/eggplant/i.test(en) || /茄子/.test(cn)) return { emoji: '🍆', label: '蔬菜' };
  if (/cabbage|lettuce/i.test(en) || /白菜|卷心菜|生菜|莴苣/.test(cn)) return { emoji: '🥬', label: '蔬菜' };
  if (/pumpkin/i.test(en) || /南瓜/.test(cn)) return { emoji: '🎃', label: '蔬菜' };
  if (/green.*pepper|bell.*pepper/i.test(en) || /青椒|甜椒/.test(cn)) return { emoji: '🫑', label: '蔬菜' };
  if (/beet/i.test(en) || /甜菜/.test(cn)) return { emoji: '🫒', label: '蔬菜' };

  // 水果类
  if (/blueberry/i.test(en) || /蓝莓/.test(cn)) return { emoji: '🫐', label: '水果' };
  if (/strawberry/i.test(en) || /草莓/.test(cn)) return { emoji: '🍓', label: '水果' };
  if (/grape/i.test(en) || /葡萄/.test(cn)) return { emoji: '🍇', label: '水果' };
  if (/lemon/i.test(en) || /柠檬/.test(cn)) return { emoji: '🍋', label: '水果' };
  if (/watermelon/i.test(en) || /西瓜/.test(cn)) return { emoji: '🍉', label: '水果' };
  if (/pineapple/i.test(en) || /菠萝|凤梨/.test(cn)) return { emoji: '🍍', label: '水果' };
  if (/cocoa/i.test(en) || /可可/.test(cn)) return { emoji: '🍫', label: '水果' };

  // 花卉类
  if (/sunflower/i.test(en) || /向日葵/.test(cn)) return { emoji: '🌻', label: '花卉' };
  if (/cotton/i.test(en) || /棉花/.test(cn)) return { emoji: '☁️', label: '经济作物' };

  // 菌类/采集品
  if (/mushroom|fungi/i.test(en) || /蘑菇/.test(cn)) return { emoji: '🍄', label: '菌类' };
  if (/truffle/i.test(en) || /松露/.test(cn)) return { emoji: '💎', label: '稀有采集' };

  // 按分类兜底
  if (cat === '谷物') return { emoji: '🌾', label: '谷物' };
  if (cat === '蔬菜') return { emoji: '🥬', label: '蔬菜' };
  if (cat === '水果') return { emoji: '🍎', label: '水果' };
  if (cat === '花卉') return { emoji: '🌸', label: '花卉' };
  if (cat === '菌类') return { emoji: '🍄', label: '菌类' };
  if (cat === '采集品') return { emoji: '🧺', label: '采集品' };

  // 默认
  return { emoji: '🌱', label: '作物' };
}

// ---- Crop priority → accent class + badge class ----
function cropPriorityClass(priority) {
  if (priority === '最高') return 'crop-priority-master';
  if (priority === '高') return 'crop-priority-high';
  if (priority === '中') return 'crop-priority-mid';
  return 'crop-priority-low';
}

function cropPriorityBadgeClass(priority) {
  if (priority === '最高') return 'badge-coral';
  if (priority === '高') return 'badge-gold';
  if (priority === '低') return 'badge-green';
  return 'badge-teal'; // '中' or fallback
}

// ---- Rarity accent class ----
function rarityClass(rarity) {
  return 'fish-rarity-' + (rarity || 1);
}

// ---- Recipe emoji mapping ----
function getRecipeEmoji(nameEn, name, category) {
  var en = (nameEn || '').toLowerCase();
  var cn = name || '';
  var cat = category || '';

  // 甜点类
  if (/cake|cheesecake|pie|dessert|sweet/i.test(en) || /蛋糕|派|甜点|芝士/.test(cn) || cat === '甜点') return { emoji: '🍰', label: '甜点' };
  // 果酱类
  if (/jam|marmalade|preserve/i.test(en) || /酱/.test(cn)) return { emoji: '🫙', label: '果酱' };
  // 汤类
  if (/soup|chowder|broth/i.test(en) || /汤|浓汤/.test(cn)) return { emoji: '🍲', label: '汤品' };
  // 披萨
  if (/pizza/i.test(en) || /披萨/.test(cn)) return { emoji: '🍕', label: '披萨' };
  // 刺身
  if (/sashimi/i.test(en) || /刺身/.test(cn)) return { emoji: '🍣', label: '刺身' };
  // 意面
  if (/pasta|spaghetti|noodle/i.test(en) || /意面|面/.test(cn)) return { emoji: '🍝', label: '意面' };
  // 沙拉
  if (/salad/i.test(en) || /沙拉/.test(cn)) return { emoji: '🥗', label: '沙拉' };
  // 咖喱
  if (/curry/i.test(en) || /咖喱/.test(cn)) return { emoji: '🍛', label: '咖喱' };
  // 天妇罗 / 炸虾
  if (/tempura/i.test(en) || /天妇罗/.test(cn)) return { emoji: '🍤', label: '天妇罗' };
  // 烩饭
  if (/risotto|risotto/i.test(en) || /烩饭|炖饭/.test(cn)) return { emoji: '🍚', label: '烩饭' };
  // 炸鱼薯条 / 炸鲫鱼 / 烤鱼串 / 熏鱼
  if (/fish & chips|fried.*fish|grilled.*fish|smoked.*fish|fish.*skewer/i.test(en) || /炸鱼|烤鱼|熏鱼|鱼薯|鱼串/.test(cn)) return { emoji: '🐟', label: '鱼类料理' };
  // 海鲜类
  if (/seafood|crab|lobster|shrimp|shellfish/i.test(en) || /海鲜|蟹|龙虾|虾/.test(cn)) return { emoji: '🦞', label: '海鲜' };
  // 烤肉/火腿
  if (/ham|grilled.*meat|roast|steak/i.test(en) || /火腿|烤肉|蜜汁/.test(cn)) return { emoji: '🥩', label: '肉料理' };
  // 煎蛋卷
  if (/omelette|egg/i.test(en) || /煎蛋|蛋卷/.test(cn)) return { emoji: '🍳', label: '蛋料理' };
  // 土豆泥
  if (/mashed.*potato/i.test(en) || /土豆泥/.test(cn)) return { emoji: '🥔', label: '土豆料理' };
  // 焗烤
  if (/gratin|bake|roast/i.test(en) || /焗烤|焗/.test(cn)) return { emoji: '🧀', label: '焗烤' };
  // 烤蘑菇
  if (/mushroom|fungi/i.test(en) || /蘑菇/.test(cn)) return { emoji: '🍄', label: '蘑菇料理' };
  // 水果拼盘
  if (/fruit.*platter|fruit/i.test(en) || /水果|拼盘/.test(cn)) return { emoji: '🍉', label: '水果' };
  // 蔬菜
  if (/vegetable|garden|ratatouille|veggie/i.test(en) || /蔬菜|杂烩|田园/.test(cn)) return { emoji: '🥬', label: '蔬菜料理' };
  // 玉米
  if (/corn/i.test(en) || /玉米/.test(cn)) return { emoji: '🌽', label: '玉米料理' };

  // 按分类兜底
  if (cat === '加工') return { emoji: '🔪', label: '加工食品' };
  if (cat === '烹饪') return { emoji: '🍳', label: '烹饪料理' };

  // 默认
  return { emoji: '🍽️', label: '料理' };
}

// ---- NPC emoji mapping ----
function getNpcEmoji(nameEn, name, role) {
  var en = (nameEn || '').toLowerCase();
  var cn = name || '';
  var rl = role || '';

  // 导师类 (Mentors) — accent: teal
  if (/vanya/.test(en) || /钓鱼/.test(rl)) return { emoji: '👩', label: '导师', category: 'mentor' };
  if (/blanc/.test(en) || /园艺/.test(rl)) return { emoji: '👨‍🌾', label: '导师', category: 'mentor' };
  if (/massimo/.test(en) || /烹饪/.test(rl)) return { emoji: '👨‍🍳', label: '导师', category: 'mentor' };
  if (/naniwa/.test(en) || /捕虫/.test(rl)) return { emoji: '🧑', label: '导师', category: 'mentor' };
  if (/bailey/.test(en) || /观鸟/.test(rl)) return { emoji: '👨', label: '导师', category: 'mentor' };

  // 商人/店主类 (Merchants) — accent: gold
  if (/albert/.test(en) || /流浪商人/.test(rl)) return { emoji: '🤠', label: '商人', category: 'merchant' };
  if (/ka.ching/.test(en) || /背包/.test(rl)) return { emoji: '👷', label: '商人', category: 'merchant' };
  if (/dorothy|dorothee/.test(en) || /服装/.test(rl)) return { emoji: '👱‍♀️', label: '商人', category: 'merchant' };
  if (/bob/.test(en) || /杂货/.test(rl)) return { emoji: '👴', label: '商人', category: 'merchant' };

  // 服务功能类 (Service) — accent: coral
  if (/mrs.joan|琼夫人/.test(cn) || /宠物/.test(rl)) return { emoji: '👵', label: '服务', category: 'service' };
  if (/annie/.test(en) || /dream/i.test(rl)) return { emoji: '👩', label: '服务', category: 'service' };
  if (/collector|收藏家/.test(cn) || /收集品/.test(rl)) return { emoji: '🧓', label: '服务', category: 'service' };
  if (/andrew/.test(en) || /工具|修理/.test(rl)) return { emoji: '👨‍🔧', label: '服务', category: 'service' };

  // 任务类 (Quest) — accent: lavender
  if (/atara/.test(en) || /活动|周常/.test(rl)) return { emoji: '👩‍💼', label: '任务', category: 'quest' };

  // 地区居民 (Residents) — accent: green
  if (/eric/.test(en) || /温泉/.test(rl)) return { emoji: '🧔', label: '居民', category: 'resident' };
  if (/will/.test(en) || /花田/.test(rl)) return { emoji: '👨', label: '居民', category: 'resident' };
  if (/patti/.test(en) || /森林岛/.test(rl)) return { emoji: '👩‍🦱', label: '居民', category: 'resident' };
  if (/vernie/.test(en) || /海滩/.test(rl)) return { emoji: '👩', label: '居民', category: 'resident' };
  if (/bill/.test(en) || /渔村/.test(rl)) return { emoji: '👨', label: '居民', category: 'resident' };
  if (/doris/.test(en) || /艺术街/.test(rl)) return { emoji: '👩‍🎨', label: '居民', category: 'resident' };

  // 默认
  return { emoji: '🧑', label: 'NPC', category: 'default' };
}

// ---- NPC category → accent class ----
function npcCategoryClass(category) {
  if (category === 'mentor') return 'npc-cat-mentor';
  if (category === 'merchant') return 'npc-cat-merchant';
  if (category === 'service') return 'npc-cat-service';
  if (category === 'quest') return 'npc-cat-quest';
  if (category === 'resident') return 'npc-cat-resident';
  return 'npc-cat-default';
}

// ---- Recipe unlock level → accent class ----
function recipeLevelClass(unlockText) {
  var txt = unlockText || '';
  var match = txt.match(/烹饪等级(\d+)/);
  if (match) {
    var lv = parseInt(match[1], 10);
    if (lv <= 3) return 'recipe-level-basic';
    if (lv <= 6) return 'recipe-level-easy';
    if (lv <= 9) return 'recipe-level-mid';
    if (lv <= 12) return 'recipe-level-hard';
    return 'recipe-level-master';
  }
  // 自动获得 / 烹饪基础 → basic
  if (/自动|基础/.test(txt)) return 'recipe-level-basic';
  return 'recipe-level-basic';
}

// ---- Achievement emoji mapping ----
function getAchievementEmoji(category) {
  var map = {
    '冒险':   { emoji: '🗺️', label: '冒险', categoryKey: 'adventure' },
    '钓鱼':   { emoji: '🎣', label: '钓鱼', categoryKey: 'fishing' },
    '园艺':   { emoji: '🌱', label: '园艺', categoryKey: 'gardening' },
    '烹饪':   { emoji: '🍳', label: '烹饪', categoryKey: 'cooking' },
    '捕虫':   { emoji: '🦋', label: '捕虫', categoryKey: 'bugcatching' },
    '观鸟':   { emoji: '🐦', label: '观鸟', categoryKey: 'birdwatching' },
    '社交':   { emoji: '👥', label: '社交', categoryKey: 'social' },
    '财富':   { emoji: '💰', label: '财富', categoryKey: 'wealth' },
    '收集':   { emoji: '🏆', label: '收集', categoryKey: 'collection' },
    '建造':   { emoji: '🏠', label: '建造', categoryKey: 'building' },
    '宠物':   { emoji: '🐾', label: '宠物', categoryKey: 'pet' },
    '音乐':   { emoji: '🎵', label: '音乐', categoryKey: 'music' },
    '采集':   { emoji: '⛏️', label: '采集', categoryKey: 'foraging' },
    '活动':   { emoji: '🎪', label: '活动', categoryKey: 'event' }
  };
  return map[category] || { emoji: '🏆', label: '成就', categoryKey: 'default' };
}

// ---- Achievement category → accent class ----
function achievementCategoryClass(catKey) {
  var map = {
    'adventure':    'ach-cat-adventure',
    'fishing':      'ach-cat-fishing',
    'gardening':    'ach-cat-gardening',
    'cooking':      'ach-cat-cooking',
    'bugcatching':  'ach-cat-bugcatching',
    'birdwatching': 'ach-cat-birdwatching',
    'social':       'ach-cat-social',
    'wealth':       'ach-cat-wealth',
    'collection':   'ach-cat-collection',
    'building':     'ach-cat-building',
    'pet':          'ach-cat-pet',
    'music':        'ach-cat-music',
    'foraging':     'ach-cat-foraging',
    'event':        'ach-cat-event'
  };
  return map[catKey] || 'ach-cat-default';
}

// ---- Score emoji mapping ----
function getScoreEmoji(instrument) {
  var inst = (instrument || '').toLowerCase();
  if (/钢琴/.test(inst) || /piano/.test(inst)) return { emoji: '🎹', label: '钢琴' };
  if (/吉他/.test(inst) || /guitar/.test(inst)) return { emoji: '🎸', label: '吉他' };
  if (/长笛/.test(inst) || /flute/.test(inst)) return { emoji: '🪈', label: '长笛' };
  if (/小提琴/.test(inst) || /violin/.test(inst)) return { emoji: '🎻', label: '小提琴' };
  if (/竖琴/.test(inst) || /harp/.test(inst)) return { emoji: '🎼', label: '竖琴' };
  if (/小号/.test(inst) || /trumpet/.test(inst)) return { emoji: '🎺', label: '小号' };
  if (/合奏/.test(inst) || /ensemble/.test(inst)) return { emoji: '🎶', label: '合奏' };
  if (/打击乐/.test(inst) || /percussion/.test(inst)) return { emoji: '🥁', label: '打击乐' };
  if (/萨克斯/.test(inst) || /saxophone/.test(inst)) return { emoji: '🎷', label: '萨克斯' };
  if (/大提琴/.test(inst) || /cello/.test(inst)) return { emoji: '🪗', label: '大提琴' };
  return { emoji: '🎵', label: '乐器' };
}

// ---- Score mood → emoji ----
function getMoodEmoji(mood) {
  var m = mood || '';
  if (/欢快/.test(m)) return '😊';
  if (/宁静/.test(m)) return '🌙';
  if (/激昂/.test(m)) return '🔥';
  if (/忧伤/.test(m)) return '🍂';
  if (/温馨/.test(m)) return '💗';
  return '🎵';
}

// ---- Render a card ----
function renderCard(tab, item) {
  switch (tab) {
    case 'fish':
      var fe = getFishEmoji(item.nameEn, item.name);
      var rCls = rarityClass(item.rarity || 1);
      var noteText = item.note || '';
      var cookText = item.cookAdvice || '';
      var footerRight = cookText || noteText || '';

      // ---- Shadow size display ----
      var shadowMap = { 'Golden': '金色', 'L': '大型', 'M': '中型', 'S': '小型' };
      var shadowCN = shadowMap[item.shadowSize] || '';
      var shadowIcon = item.shadowSize === 'Golden' ? '🟡' : item.shadowSize === 'L' ? '🔵' : item.shadowSize === 'M' ? '🟢' : item.shadowSize === 'S' ? '⚪' : '';

      // ---- Fish type display ----
      var typeRaw = { 'Sea': '海洋', 'River': '河流', 'Lake': '湖泊' }[item.fishType] || '';
      var typeIcon = { 'Sea': '🌊', 'River': '🏞', 'Lake': '🏔' }[item.fishType] || '';
      var typeDisplay = typeRaw ? typeIcon + ' ' + _L(typeRaw) : '';

      // ---- Fishing level ----
      var levelDisplay = item.fishingLevel ? 'Lv.' + item.fishingLevel : '';

      return '<div class="db-item-card fish-card ' + rCls + '">' +
        // ── Header: thumbnail + name ──
        '<div class="fish-card-header">' +
          '<div class="fish-thumb">' +
            '<span class="fish-thumb-emoji">' + fe.emoji + '</span>' +
          '</div>' +
          '<div class="fish-card-titles">' +
            '<span class="card-name">' + _name(item) + '</span>' +
            _sub(item) +
            '<div class="fish-card-tags-row">' +
              '<span class="card-stars">' + '★'.repeat(item.rarity || 1) + '<span>' + '☆'.repeat(5 - (item.rarity || 1)) + '</span></span>' +
              '<span class="badge" style="font-size:0.66rem;padding:1px 7px;background:var(--surface);color:var(--text-dim);border:1px solid var(--border)">' + _L(fe.label) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        // ── Body: 3x2 detail grid ──
        '<div class="fish-card-body">' +
          '<div class="fish-detail-grid">' +
            // Row 1: Season / Weather
            '<div class="fish-detail-cell"><span class="fi-icon">📅</span><span class="fi-label">' + _t('db.label.season') + '</span><span class="fi-val">' + _L(item.season || '全年') + '</span></div>' +
            '<div class="fish-detail-cell"><span class="fi-icon">🌤</span><span class="fi-label">' + _t('db.label.weather') + '</span><span class="fi-val">' + _L(item.weather || '任意') + '</span></div>' +
            // Row 2: Time / Location
            '<div class="fish-detail-cell"><span class="fi-icon">🕐</span><span class="fi-label">' + _t('db.label.time') + '</span><span class="fi-val">' + _L(item.time || '全天') + '</span></div>' +
            '<div class="fish-detail-cell"><span class="fi-icon">📍</span><span class="fi-label">' + _t('db.label.location') + '</span><span class="fish-location-pill">' + _L(item.location || '未知') + '</span></div>' +
            // Row 3: Fish Type / Shadow Size
            (typeDisplay ? '<div class="fish-detail-cell"><span class="fi-icon">🏷</span><span class="fi-label">' + _t('db.label.water') + '</span><span class="fi-val">' + typeDisplay + '</span></div>' : '<div class="fish-detail-cell"></div>') +
            (shadowCN ? '<div class="fish-detail-cell"><span class="fi-icon">📏</span><span class="fi-label">' + _t('db.label.shadow') + '</span><span class="fi-val">' + shadowIcon + ' ' + _L(shadowCN) + '</span></div>' : '<div class="fish-detail-cell"></div>') +
            // Row 4: Fishing Level (if present)
            (levelDisplay ? '<div class="fish-detail-cell" style="grid-column:1/-1"><span class="fi-icon">🎣</span><span class="fi-label">' + _t('db.label.fishingLevel') + '</span><span class="fi-val">' + levelDisplay + '</span></div>' : '') +
          '</div>' +
        '</div>' +
        // ── Note (if present) ──
        (noteText ? '<div class="fish-note-strip">💡 ' + _L(noteText) + '</div>' : '') +
        // ── Footer: price + advice ──
        '<div class="card-footer">' +
          '<div class="fish-card-footer-left">' +
            '<span style="font-size:0.75rem;color:var(--text-dim)">💰</span>' +
            '<span class="card-price">' + (item.sellPrice > 0 ? item.sellPrice + ' G' : '? G') + '</span>' +
          '</div>' +
          (footerRight ? '<div class="fish-card-footer-right">' + _L(footerRight) + '</div>' : '') +
        '</div>' +
      '</div>';
    case 'insects':
      var ie = getInsectEmoji(item.nameEn, item.name);
      var irCls = rarityClass(item.rarity || 1);
      var inoteText = item.note || '';

      return '<div class="db-item-card fish-card ' + irCls + '">' +
        // ── Header: thumbnail + name ──
        '<div class="fish-card-header">' +
          '<div class="fish-thumb">' +
            '<span class="fish-thumb-emoji">' + ie.emoji + '</span>' +
          '</div>' +
          '<div class="fish-card-titles">' +
            '<span class="card-name">' + _name(item) + '</span>' +
            _sub(item) +
            '<div class="fish-card-tags-row">' +
              '<span class="card-stars">' + '★'.repeat(item.rarity || 1) + '<span>' + '☆'.repeat(5 - (item.rarity || 1)) + '</span></span>' +
              '<span class="badge" style="font-size:0.66rem;padding:1px 7px;background:var(--surface);color:var(--text-dim);border:1px solid var(--border)">' + _L(ie.label) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        // ── Body: 2x3 detail grid ──
        '<div class="fish-card-body">' +
          '<div class="fish-detail-grid">' +
            // Row 1: Season / Weather
            '<div class="fish-detail-cell"><span class="fi-icon">📅</span><span class="fi-label">' + _t('db.label.season') + '</span><span class="fi-val">' + _L(item.season || '未知') + '</span></div>' +
            '<div class="fish-detail-cell"><span class="fi-icon">🌤</span><span class="fi-label">' + _t('db.label.weather') + '</span><span class="fi-val">' + _L(item.weather || '任意') + '</span></div>' +
            // Row 2: Time / Location
            '<div class="fish-detail-cell"><span class="fi-icon">🕐</span><span class="fi-label">' + _t('db.label.time') + '</span><span class="fi-val">' + _L(item.time || '全天') + '</span></div>' +
            '<div class="fish-detail-cell"><span class="fi-icon">📍</span><span class="fi-label">' + _t('db.label.location') + '</span><span class="fish-location-pill">' + _L(item.location || '未知') + '</span></div>' +
          '</div>' +
        '</div>' +
        // ── Note (if present) ──
        (inoteText ? '<div class="fish-note-strip">💡 ' + _L(inoteText) + '</div>' : '') +
        // ── Footer: price (only show if known) ──
        (item.sellPrice > 0 ?
          '<div class="card-footer">' +
            '<div class="fish-card-footer-left">' +
              '<span style="font-size:0.75rem;color:var(--text-dim)">💰</span>' +
              '<span class="card-price">' + item.sellPrice + ' G</span>' +
            '</div>' +
          '</div>'
        : '') +
      '</div>';
    case 'birds':
      var be = getBirdEmoji(item.nameEn, item.name);
      var bRarity = item.rarity || 1;
      var rCls = rarityClass(bRarity);
      var bNoteText = item.note || '';

      return '<div class="db-item-card fish-card ' + rCls + '">' +
        // ── Header: thumbnail + name ──
        '<div class="fish-card-header">' +
          '<div class="fish-thumb">' +
            '<span class="fish-thumb-emoji">' + be.emoji + '</span>' +
          '</div>' +
          '<div class="fish-card-titles">' +
            '<span class="card-name">' + _name(item) + '</span>' +
            _sub(item) +
            '<div class="fish-card-tags-row">' +
              '<span class="card-stars">' + '★'.repeat(bRarity) + '<span>' + '☆'.repeat(5 - bRarity) + '</span></span>' +
              '<span class="badge" style="font-size:0.66rem;padding:1px 7px;background:var(--surface);color:var(--text-dim);border:1px solid var(--border)">' + _L(be.label) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        // ── Body: 2×3 detail grid ──
        '<div class="fish-card-body">' +
          '<div class="fish-detail-grid">' +
            // Row 1: Season / Weather
            '<div class="fish-detail-cell"><span class="fi-icon">📅</span><span class="fi-label">' + _t('db.label.season') + '</span><span class="fi-val">' + _L(item.season || '全年') + '</span></div>' +
            '<div class="fish-detail-cell"><span class="fi-icon">🌤</span><span class="fi-label">' + _t('db.label.weather') + '</span><span class="fi-val">' + _L(item.weather || '任意') + '</span></div>' +
            // Row 2: Time / Location
            '<div class="fish-detail-cell"><span class="fi-icon">🕐</span><span class="fi-label">' + _t('db.label.time') + '</span><span class="fi-val">' + _L(item.time || '全天') + '</span></div>' +
            '<div class="fish-detail-cell"><span class="fi-icon">📍</span><span class="fi-label">' + _t('db.label.location') + '</span><span class="fish-location-pill">' + _L(item.location || '未知') + '</span></div>' +
            // Row 3: Birdwatch Level (full width)
            '<div class="fish-detail-cell" style="grid-column:1/-1"><span class="fi-icon">🔭</span><span class="fi-label">' + _t('db.label.birdwatchLevel') + '</span><span class="fi-val">Lv.' + (item.birdwatchLevel || '?') + '</span></div>' +
          '</div>' +
        '</div>' +
        // ── Note (if present) ──
        (bNoteText ? '<div class="fish-note-strip">💡 ' + _L(bNoteText) + '</div>' : '') +
      '</div>';
    case 'recipes':
      var re = getRecipeEmoji(item.nameEn, item.name, item.category);
      var rCls = recipeLevelClass(item.unlock);
      // ★★ multiplier vs base: highlight profit ratio
      var profitRatio = item.star2Price && item.sellPrice ? (item.star2Price / item.sellPrice).toFixed(1) : '1.5';
      var hasStar3 = item.star3Price && item.star3Price > 0;

      return '<div class="db-item-card fish-card recipe-card ' + rCls + '">' +
        // ── Header: thumbnail + name ──
        '<div class="fish-card-header">' +
          '<div class="fish-thumb recipe-thumb">' +
            '<span class="fish-thumb-emoji">' + re.emoji + '</span>' +
          '</div>' +
          '<div class="fish-card-titles">' +
            '<span class="card-name">' + _name(item) + '</span>' +
            _sub(item) +
            '<div class="fish-card-tags-row">' +
              '<span class="badge" style="font-size:0.66rem;padding:1px 7px;background:var(--surface);color:var(--text-dim);border:1px solid var(--border)">' + _L(re.label) + '</span>' +
              '<span class="badge badge-gold" style="font-size:0.66rem;padding:1px 7px;">' + _L(item.category || '烹饪') + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        // ── Body: detail grid ──
        '<div class="fish-card-body">' +
          '<div class="fish-detail-grid recipe-detail-grid">' +
            // Row 1: Ingredients (full width)
            '<div class="fish-detail-cell" style="grid-column:1/-1"><span class="fi-icon">📋</span><span class="fi-label">' + _t('db.label.ingredients') + '</span><span class="fi-val recipe-ingredients-text">' + _L(item.ingredients) + '</span></div>' +
            // Row 2: Energy / Sell Price
            '<div class="fish-detail-cell"><span class="fi-icon">⚡</span><span class="fi-label">' + _t('db.label.energy') + '</span><span class="fi-val">+' + item.energy + '</span></div>' +
            '<div class="fish-detail-cell"><span class="fi-icon">💰</span><span class="fi-label">' + _t('db.label.basePrice') + '</span><span class="fi-val" style="color:var(--coral);font-weight:700">' + item.sellPrice + ' G</span></div>' +
            // Row 3: ★★ Price / ★★★ Price
            '<div class="fish-detail-cell"><span class="fi-icon">⭐</span><span class="fi-label">' + _t('db.label.star2Price') + '</span><span class="fi-val">' + item.star2Price + ' G</span></div>' +
            (hasStar3 ? '<div class="fish-detail-cell"><span class="fi-icon">🌟</span><span class="fi-label">' + _t('db.label.star3Price') + '</span><span class="fi-val" style="color:var(--gold)">' + item.star3Price + ' G</span></div>' : '<div class="fish-detail-cell"></div>') +
          '</div>' +
        '</div>' +
        // ── Profit highlight strip ──
        '<div class="fish-note-strip recipe-profit-strip">📈 ' + _t('db.profitAnalysis') + ': ' + _L(item.profit) + ' <span style="font-size:0.7rem;opacity:0.8">(★★' + _t('db.multiplier') + ' ×' + profitRatio + ')</span></div>' +
        // ── Footer: unlock ──
        '<div class="card-footer">' +
          '<div class="fish-card-footer-left">' +
            '<span style="font-size:0.75rem;color:var(--text-dim)">🔓</span>' +
            '<span style="font-size:0.78rem;color:var(--text-muted)">' + _L(item.unlock) + '</span>' +
          '</div>' +
          '<div class="fish-card-footer-right">' +
            '<span style="font-weight:700;color:var(--coral)">' + item.sellPrice + ' G</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    case 'crops':
      var ce = getCropEmoji(item.nameEn, item.name, item.category);
      var pCls = cropPriorityClass(item.priority);
      var cNoteText = item.note || '';
      var profitDisplay = typeof item.profitPerHour === 'number' ? item.profitPerHour.toFixed(1) + ' G/h' : _L(item.profitPerHour);
      var hasSeedPrice = item.seedPrice > 0;
      var isNumberProfit = typeof item.profitPerHour === 'number';
      // Calculate net profit (sell - seed) for non-foraged crops
      var netProfit = (hasSeedPrice && isNumberProfit)
        ? (item.sellPrice - item.seedPrice)
        : null;

      return '<div class="db-item-card fish-card crop-card ' + pCls + '">' +
        // ── Header: thumbnail + name ──
        '<div class="fish-card-header">' +
          '<div class="fish-thumb">' +
            '<span class="fish-thumb-emoji">' + ce.emoji + '</span>' +
          '</div>' +
          '<div class="fish-card-titles">' +
            '<span class="card-name">' + _name(item) + '</span>' +
            _sub(item) +
            '<div class="fish-card-tags-row">' +
              '<span class="badge" style="font-size:0.66rem;padding:1px 7px;background:var(--surface);color:var(--text-dim);border:1px solid var(--border)">' + _L(ce.label) + '</span>' +
              '<span class="badge ' + cropPriorityBadgeClass(item.priority) + '" style="font-size:0.66rem;padding:1px 7px;">⭐ ' + _L(item.priority) + _t('db.prioritySuffix') + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        // ── Body: 3x2 detail grid ──
        '<div class="fish-card-body">' +
          '<div class="fish-detail-grid">' +
            // Row 1: Growth Time / Season
            '<div class="fish-detail-cell"><span class="fi-icon">⏱️</span><span class="fi-label">' + _t('db.label.growth') + '</span><span class="fi-val">' + _L(item.growthTime) + '</span></div>' +
            '<div class="fish-detail-cell"><span class="fi-icon">📅</span><span class="fi-label">' + _t('db.label.season') + '</span><span class="fi-val">' + _L(item.season || '全年') + '</span></div>' +
            // Row 2: Harvest Type / Unlock
            '<div class="fish-detail-cell"><span class="fi-icon">🧺</span><span class="fi-label">' + _t('db.label.harvest') + '</span><span class="fi-val">' + _L(item.harvestType || '单次收获') + '</span></div>' +
            '<div class="fish-detail-cell"><span class="fi-icon">🔓</span><span class="fi-label">' + _t('db.label.unlock') + '</span><span class="fi-val">' + _L(item.unlock || '未知') + '</span></div>' +
            // Row 3: Seed Price (if applicable) / Category
            (hasSeedPrice ? '<div class="fish-detail-cell"><span class="fi-icon">🛒</span><span class="fi-label">' + _t('db.label.seed') + '</span><span class="fi-val">' + item.seedPrice + ' G</span></div>' : '<div class="fish-detail-cell"><span class="fi-icon">🆓</span><span class="fi-label">' + _t('db.label.seed') + '</span><span class="fi-val">' + _L('免费采集') + '</span></div>') +
            '<div class="fish-detail-cell"><span class="fi-icon">🏷️</span><span class="fi-label">' + _t('db.label.category') + '</span><span class="fi-val">' + _L(item.category || '作物') + '</span></div>' +
          '</div>' +
        '</div>' +
        // ── Note (if present) ──
        (cNoteText ? '<div class="fish-note-strip">💡 ' + _L(cNoteText) + '</div>' : '') +
        // ── Footer: price + profit ──
        '<div class="card-footer">' +
          '<div class="fish-card-footer-left">' +
            '<span style="font-size:0.75rem;color:var(--text-dim)">💰</span>' +
            '<span class="card-price">' + item.sellPrice + ' G</span>' +
            (netProfit !== null ? '<span style="font-size:0.72rem;color:var(--text-dim);margin-left:4px">' + _t('db.netProfit') + ' ' + netProfit + '</span>' : '') +
          '</div>' +
          '<div class="fish-card-footer-right">' +
            '<span style="font-size:0.78rem;color:var(--text-muted)">📊 ' + profitDisplay + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    case 'npcs':
      var ne = getNpcEmoji(item.nameEn, item.name, item.role);
      var nCatCls = npcCategoryClass(ne.category);
      var hasDesc = item.description && item.description.length > 0;

      return '<div class="db-item-card fish-card npc-card ' + nCatCls + '">' +
        // ── Header: thumbnail + name ──
        '<div class="fish-card-header">' +
          '<div class="fish-thumb npc-thumb">' +
            '<span class="fish-thumb-emoji">' + ne.emoji + '</span>' +
          '</div>' +
          '<div class="fish-card-titles">' +
            '<span class="card-name">' + _name(item) + '</span>' +
            _sub(item) +
            '<div class="fish-card-tags-row">' +
              '<span class="badge badge-coral" style="font-size:0.68rem;padding:2px 8px;">' + _L(item.role) + '</span>' +
              '<span class="badge" style="font-size:0.66rem;padding:1px 7px;background:var(--surface);color:var(--text-dim);border:1px solid var(--border)">' + _L(ne.label) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        // ── Body: 2x2 detail grid ──
        '<div class="fish-card-body">' +
          '<div class="fish-detail-grid npc-detail-grid">' +
            // Row 1: Location / Schedule
            '<div class="fish-detail-cell"><span class="fi-icon">📍</span><span class="fi-label">' + _t('db.label.location') + '</span><span class="fish-location-pill npc-location-pill">' + _L(item.location || '未知') + '</span></div>' +
            '<div class="fish-detail-cell"><span class="fi-icon">🕐</span><span class="fi-label">' + _t('db.label.schedule') + '</span><span class="fi-val">' + _L(item.schedule || '全天') + '</span></div>' +
            // Row 2: Unlock (full width)
            '<div class="fish-detail-cell" style="grid-column:1/-1"><span class="fi-icon">🔓</span><span class="fi-label">' + _t('db.label.unlock') + '</span><span class="fi-val">' + _L(item.unlock || '未知') + '</span></div>' +
          '</div>' +
        '</div>' +
        // ── Favorite gifts strip ──
        (item.favoriteGifts ? '<div class="fish-note-strip npc-gifts-strip">🎁 ' + _L(item.favoriteGifts) + '</div>' : '') +
        // ── Description strip ──
        (hasDesc ? '<div class="fish-note-strip npc-desc-strip">💡 ' + _L(item.description) + '</div>' : '') +
      '</div>';
    case 'achievements':
      var ae = getAchievementEmoji(item.category);
      var aRarity = item.difficulty || 1;
      var aCls = achievementCategoryClass(ae.categoryKey);
      var aTips = item.tips || '';
      var hasTitle = item.reward && item.reward.indexOf('称号') !== -1;

      return '<div class="db-item-card fish-card achievement-card ' + aCls + ' fish-rarity-' + aRarity + '">' +
        // ── Header: thumbnail + name ──
        '<div class="fish-card-header">' +
          '<div class="fish-thumb achievement-thumb">' +
            '<span class="fish-thumb-emoji">' + ae.emoji + '</span>' +
          '</div>' +
          '<div class="fish-card-titles">' +
            '<span class="card-name">' + _name(item) + '</span>' +
            _sub(item) +
            '<div class="fish-card-tags-row">' +
              '<span class="card-stars">' + '★'.repeat(aRarity) + '<span>' + '☆'.repeat(5 - aRarity) + '</span></span>' +
              '<span class="badge" style="font-size:0.66rem;padding:1px 7px;background:var(--surface);color:var(--text-dim);border:1px solid var(--border)">' + _L(ae.label) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        // ── Body: detail grid ──
        '<div class="fish-card-body">' +
          '<div class="fish-detail-grid achievement-detail-grid">' +
            // Row 1: Description (full width)
            '<div class="fish-detail-cell" style="grid-column:1/-1"><span class="fi-icon">📋</span><span class="fi-label">' + _t('db.label.description') + '</span><span class="fi-val">' + _L(item.description) + '</span></div>' +
            // Row 2: Unlock / Reward
            '<div class="fish-detail-cell"><span class="fi-icon">🔓</span><span class="fi-label">' + _t('db.label.unlock') + '</span><span class="fi-val">' + _L(item.unlock) + '</span></div>' +
            '<div class="fish-detail-cell"><span class="fi-icon">🎁</span><span class="fi-label">' + _t('db.label.reward') + '</span><span class="fi-val" style="' + (hasTitle ? 'color:var(--coral);font-weight:700' : 'color:var(--gold);font-weight:700') + '">' + _L(item.reward) + '</span></div>' +
          '</div>' +
        '</div>' +
        // ── Tips strip (if present) ──
        (aTips ? '<div class="fish-note-strip achievement-tips-strip">💡 ' + _L(aTips) + '</div>' : '') +
        // ── Footer: category + difficulty ──
        '<div class="card-footer">' +
          '<div class="fish-card-footer-left">' +
            '<span style="font-size:0.75rem;color:var(--text-dim)">📂</span>' +
            '<span class="badge badge-teal" style="font-size:0.72rem">' + _L(item.category) + '</span>' +
          '</div>' +
          '<div class="fish-card-footer-right">' +
            '<span style="font-size:0.75rem;color:var(--text-dim)">' + _t('db.difficultyWord') + ' ' + '★'.repeat(aRarity) + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    case 'scores':
      var se = getScoreEmoji(item.instrument);
      var sDiff = item.difficulty || 1;
      var sCls = rarityClass(sDiff);
      var moodEmoji = getMoodEmoji(item.mood);
      var noteText = item.note || '';

      return '<div class="db-item-card fish-card score-card ' + sCls + '">' +
        // ── Header: thumbnail + name ──
        '<div class="fish-card-header">' +
          '<div class="fish-thumb score-thumb">' +
            '<span class="fish-thumb-emoji">' + se.emoji + '</span>' +
          '</div>' +
          '<div class="fish-card-titles">' +
            '<span class="card-name">' + _name(item) + '</span>' +
            _sub(item) +
            '<div class="fish-card-tags-row">' +
              '<span class="card-stars">' + '★'.repeat(sDiff) + '<span>' + '☆'.repeat(5 - sDiff) + '</span></span>' +
              '<span class="badge" style="font-size:0.66rem;padding:1px 7px;background:var(--surface);color:var(--text-dim);border:1px solid var(--border)">' + _L(item.style || '音乐') + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        // ── Body: 3x2 detail grid ──
        '<div class="fish-card-body">' +
          '<div class="fish-detail-grid">' +
            // Row 1: Source / Instrument
            '<div class="fish-detail-cell"><span class="fi-icon">📦</span><span class="fi-label">' + _t('db.label.source') + '</span><span class="fish-location-pill">' + _L(item.source || '未知') + '</span></div>' +
            '<div class="fish-detail-cell"><span class="fi-icon">🎸</span><span class="fi-label">' + _t('db.label.instrument') + '</span><span class="fi-val">' + _L(item.instrument) + '</span></div>' +
            // Row 2: Style / Duration
            '<div class="fish-detail-cell"><span class="fi-icon">🎼</span><span class="fi-label">' + _t('db.label.style') + '</span><span class="fi-val">' + _L(item.style || '—') + '</span></div>' +
            '<div class="fish-detail-cell"><span class="fi-icon">⏱️</span><span class="fi-label">' + _t('db.label.duration') + '</span><span class="fi-val">' + (item.duration || '—') + '</span></div>' +
            // Row 3: Mood / BPM
            '<div class="fish-detail-cell"><span class="fi-icon">' + moodEmoji + '</span><span class="fi-label">' + _t('db.label.mood') + '</span><span class="fi-val">' + _L(item.mood || '—') + '</span></div>' +
            '<div class="fish-detail-cell"><span class="fi-icon">🎵</span><span class="fi-label">BPM</span><span class="fi-val">' + (item.bpm || '—') + '</span></div>' +
          '</div>' +
        '</div>' +
        // ── Note strip (if present) ──
        (noteText ? '<div class="fish-note-strip score-note-strip">💡 ' + _L(noteText) + '</div>' : '') +
        // ── Footer: unlock condition ──
        '<div class="card-footer">' +
          '<div class="fish-card-footer-left">' +
            '<span style="font-size:0.75rem;color:var(--text-dim)">🔓</span>' +
            '<span style="font-size:0.78rem;color:var(--text-muted)">' + _L(item.unlock) + '</span>' +
          '</div>' +
          '<div class="fish-card-footer-right">' +
            '<span style="font-size:0.75rem;color:var(--text-dim)">' + _L(se.label) + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    default:
      return '';
  }
}

// Re-render the current tab when the language switches
window.addEventListener('langchange', function () {
  if (dataLoaded) applyFilters();
});