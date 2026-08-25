/* ============================================================
   Heartopia · 作物数据 CROPS_DATA
   ------------------------------------------------------------
   数据来源与核查（2026-08-24 事实核查）：
     · 种子价 / 成长时间：heartopia.life/database/crops（2026-07-28 更新，直抓）
     · 售价 / 园艺等级：screenhype.co.uk、gameanimetech.com、heartopia.live/zh/crops
     · 交叉验证：WebSearch 多源一致（土豆 30G/1h/1★90G、小麦 95G/4h/1★285G、
       番茄 10G/15m/1★30G）
   ------------------------------------------------------------
   重要事实：
     1. 游戏内可种植作物共 18 种（13 常驻 + 5 活动限定），此前本文件列出的
        大豆/甘蔗/辣椒/黄瓜/洋葱/白菜/南瓜/青椒/甜菜/向日葵/棉花/柠檬/西瓜
        共 13 种在游戏中不存在，已删除。
     2. 蓝莓 / 蘑菇 / 黑松露 不是作物，是采集品，已移出本表（见 FORAGE_DATA）。
     3. 作物星级售价阶梯为「每星 +1/3 基准价」：
        1★ = 基准，2★ ≈ ×1.33，3★ ≈ ×1.67，4★ = ×2，5★ ≈ ×2.33。
        （注意：鱼类与料理用的是另一套 ×1/1.5/2/4/8，勿混用。）
     4. sellPrice 一律存 1★ 基准价。
     5. profitPerHour = (1★售价 − 种子价) ÷ 成长小时数，为计算值。
     6. 值为「未确认」或空字符串表示查无可靠来源 —— 不要用看起来合理的数字填补。
   ============================================================ */

var CROPS_DATA = [
  // ═══════════════════════════════════════════
  // 谷物类
  // ═══════════════════════════════════════════
  {"name":"小麦","enName":"Wheat","category":"谷物","growthTime":"4小时","season":"常驻","sellPrice":285,"seedPrice":95,"profitPerHour":47.5,"harvestType":"—","priority":"最高","note":"中后期几乎所有高利润食谱的基础材料，值得长期批量种植。1★ 285 / 2★ 381 / 3★ 475 / 4★ 570。","note_en":"The backbone ingredient for most mid- and late-game recipes; worth planting in bulk long term. 1★ 285 / 2★ 381 / 3★ 475 / 4★ 570.","unlock":"园艺 Lv.2"},
  {"name":"玉米","enName":"Corn","category":"谷物","growthTime":"12小时","season":"常驻","sellPrice":515,"seedPrice":170,"profitPerHour":28.8,"harvestType":"—","priority":"中","note":"成长期长，适合睡前种。玉米浓汤的核心材料。另有来源记作 510，差异极小。","note_en":"Long grower — plant before logging off. Core ingredient for Corn Soup. One source lists 510 instead of 515.","unlock":"园艺 Lv.6"},
  {"name":"水稻","enName":"Paddy","category":"谷物","growthTime":"20分钟","season":"活动限定 · 端午","sellPrice":"未确认","seedPrice":12,"profitPerHour":"未确认","harvestType":"—","priority":"未确认","note":"端午活动作物，产白米用于粽子系列食谱。售价查无可靠来源。","note_en":"Dragon Boat Festival event crop; yields rice for the zongzi recipes. No reliable sell price found.","unlock":"未确认"},

  // ═══════════════════════════════════════════
  // 蔬菜类
  // ═══════════════════════════════════════════
  {"name":"土豆","enName":"Potatoes","category":"蔬菜","growthTime":"1小时","season":"常驻","sellPrice":90,"seedPrice":30,"profitPerHour":60,"harvestType":"—","priority":"最高","note":"新手首选：1 小时成熟，园艺 1 级即可种，售价为番茄的 3 倍。炸鱼薯条的材料之一。","note_en":"The beginner pick: ready in one hour, available at Gardening Lv.1, and sells for 3x what a tomato does. Also a Fish and Chips ingredient.","unlock":"园艺 Lv.1"},
  {"name":"番茄","enName":"Tomato","category":"蔬菜","growthTime":"15分钟","season":"常驻","sellPrice":30,"seedPrice":10,"profitPerHour":80,"harvestType":"—","priority":"高","note":"全游戏最快作物之一，15 分钟一轮。单价低但按小时算收益很高，也是居民委托的常见交付物。","note_en":"One of the fastest crops in the game at 15 minutes a cycle. Low unit price but excellent per-hour return, and a common villager-request turn-in.","unlock":"园艺 Lv.1"},
  {"name":"生菜","enName":"Lettuce","category":"蔬菜","growthTime":"8小时","season":"常驻","sellPrice":435,"seedPrice":145,"profitPerHour":36.3,"harvestType":"—","priority":"高","note":"单株售价高，适合睡前种。乡村炖菜、田园沙拉材料。","note_en":"High price per plant and a good overnight crop. Used in Rustic Ratatouille and House Salad.","unlock":"园艺 Lv.3"},
  {"name":"胡萝卜","enName":"Carrot","category":"蔬菜","growthTime":"2小时","season":"常驻","sellPrice":155,"seedPrice":50,"profitPerHour":52.5,"harvestType":"—","priority":"中","note":"胡萝卜蛋糕材料。2 小时一轮，白天可多次轮种。","note_en":"Carrot Cake ingredient. A two-hour cycle, so you can rotate it several times during a play session.","unlock":"园艺 Lv.5"},
  {"name":"茄子","enName":"Eggplant","category":"蔬菜","growthTime":"5小时","season":"常驻","sellPrice":406,"seedPrice":135,"profitPerHour":54.2,"harvestType":"—","priority":"中","note":"每小时收益在中期作物里偏高。肉酱焗茄子材料。","note_en":"One of the stronger per-hour returns among mid-game crops. Used in Baked Eggplant with Meat.","unlock":"园艺 Lv.8"},
  {"name":"白萝卜","enName":"White Radish","category":"蔬菜","growthTime":"15分钟","season":"活动限定 · 冬霜季","sellPrice":30,"seedPrice":10,"profitPerHour":80,"harvestType":"—","priority":"中","note":"冬霜季活动作物，用于白萝卜奶油汤等企鹅灶台食谱。园艺等级要求未确认。","note_en":"Winter Frost event crop, used in Penguin Stove dishes such as Creamy White Radish Soup. Required gardening level unconfirmed.","unlock":"未确认"},
  {"name":"罗马生菜","enName":"Romaine Lettuce","category":"蔬菜","growthTime":"15分钟","season":"活动限定 · 拼合街市","sellPrice":30,"seedPrice":10,"profitPerHour":80,"harvestType":"—","priority":"中","note":"活动作物，罗马生菜塔可材料。园艺等级要求未确认。","note_en":"Event crop used for the Romaine Lettuce Taco. Required gardening level unconfirmed.","unlock":"未确认"},

  // ═══════════════════════════════════════════
  // 水果类
  // ═══════════════════════════════════════════
  {"name":"菠萝","enName":"Pineapple","category":"水果","growthTime":"30分钟","season":"常驻","sellPrice":52,"seedPrice":15,"profitPerHour":74,"harvestType":"—","priority":"高","note":"30 分钟一轮，按小时算是收益最好的水果之一。菠萝酱材料。","note_en":"A 30-minute cycle makes this one of the best fruits by hourly return. Used for Pineapple Jam.","unlock":"园艺 Lv.4"},
  {"name":"草莓","enName":"Strawberry","category":"水果","growthTime":"6小时","season":"常驻","sellPrice":375,"seedPrice":125,"profitPerHour":41.7,"harvestType":"—","priority":"最高","note":"务必做成草莓酱再卖 —— 4 颗草莓（成本 500）做出的草莓酱 1★ 就值 1580。别直接出售。","note_en":"Always turn these into Strawberry Jam before selling: four berries (500G of seed) make a jam worth 1,580G at one star. Do not sell them raw.","unlock":"园艺 Lv.6"},
  {"name":"葡萄","enName":"Grape","category":"水果","growthTime":"10小时","season":"常驻","sellPrice":480,"seedPrice":160,"profitPerHour":32,"harvestType":"—","priority":"高","note":"睡前种植的长线作物，葡萄酱材料。葡萄酱售价来源单一，暂不列出。","note_en":"A long overnight crop and the base for Grape Jam. The jam's price comes from a single source, so it is not listed here.","unlock":"园艺 Lv.7"},
  {"name":"牛油果","enName":"Avocado","category":"水果","growthTime":"13小时","season":"常驻","sellPrice":540,"seedPrice":180,"profitPerHour":27.7,"harvestType":"—","priority":"中","note":"全游戏成长期最长的作物。鲜虾酪梨杯材料。售价存在来源分歧（540 与 330），取证据较强的 540。","note_en":"The longest-growing crop in the game. Used in the Shrimp Avocado Cup. Sources disagree on price (540 vs 330); the better-supported 540 is listed.","unlock":"园艺 Lv.13"},
  {"name":"杨桃","enName":"Starfruit","category":"水果","growthTime":"15分钟","season":"活动限定 · 寻鲸季","sellPrice":"未确认","seedPrice":10,"profitPerHour":"未确认","harvestType":"—","priority":"未确认","note":"寻鲸季活动作物，用于杨桃酱与海洋冰饮。售价查无可靠来源。","note_en":"Call of Whales event crop, used for Starfruit Jam and the Ocean Iced Drink. No reliable sell price found.","unlock":"未确认"},

  // ═══════════════════════════════════════════
  // 香草 / 特产类
  // ═══════════════════════════════════════════
  {"name":"茶叶","enName":"Tea Leaf","category":"香草","growthTime":"45分钟","season":"常驻","sellPrice":75,"seedPrice":25,"profitPerHour":66.7,"harvestType":"—","priority":"中","note":"所有茶饮的基础材料（红茶、绿茶、奶茶系列）。售价为单一来源，置信度中等。","note_en":"The base for every tea drink (black, green and the milk-tea line). Price comes from a single source — medium confidence.","unlock":"园艺 Lv.11"},
  {"name":"可可豆","enName":"Cacao Bean","category":"特产","growthTime":"5小时","season":"常驻","sellPrice":330,"seedPrice":110,"profitPerHour":44,"harvestType":"—","priority":"中","note":"巧克力酱与可可奶茶材料。售价为单一来源，置信度中等。","note_en":"Used for Chocolate Sauce and Cocoa Milk Tea. Price comes from a single source — medium confidence.","unlock":"园艺 Lv.12"},
  {"name":"柠檬马鞭草","enName":"Lemon Verbena","category":"香草","growthTime":"15分钟","season":"活动限定 · 拼合街市","sellPrice":"未确认","seedPrice":10,"profitPerHour":"未确认","harvestType":"—","priority":"未确认","note":"活动作物，马鞭草派系列食谱材料。售价查无可靠来源。","note_en":"Event crop used across the Verbena Pie recipes. No reliable sell price found.","unlock":"未确认"}
]
;

/* ============================================================
   采集品 FORAGE_DATA
   ------------------------------------------------------------
   以下三类此前被错误地列为「作物」。它们无法种植，只能在野外采集。
   ============================================================ */
var FORAGE_DATA = [
  {"name":"蓝莓","enName":"Blueberry","category":"采集品","sellPrice":16,"location":"灌木丛（夏季）","note":"采集所得，不可种植。4 颗做蓝莓酱 1★ 值 170，是新手最早能接触到的加工增值路径。","note_en":"Foraged from bushes, not plantable. Four berries make a Blueberry Jam worth 170G at one star — the earliest value-add loop a beginner can reach.","respawn":"未确认"},
  {"name":"蘑菇（平菇/香菇/白蘑菇/牛肝菌）","enName":"Mushrooms","category":"采集品","sellPrice":16,"location":"平菇=温泉山 · 香菇=渔村 · 白蘑菇=风车花田 · 牛肝菌=森林","note":"零成本采集。同种蘑菇 4 个可做烤蘑菇（1★ 180），2 个加小麦鸡蛋可做蘑菇派（1★ 500）。","note_en":"Free to gather. Four of the same kind make Grilled Mushrooms (180G at one star); two plus wheat and an egg make a Mushroom Pie (500G at one star).","respawn":"来源不一：一说 2–3 分钟，一说每日 6:00 刷新"},
  {"name":"黑松露","enName":"Black Truffle","category":"采集品","sellPrice":99,"location":"森林岛（地图东北，东海以北）","note":"从深色小土堆徒手挖取，无需工具，无季节限制，开局即可前往。做成黑松露派（1★ 830）或黑松露奶油意面（1★ 900）远比直接卖划算。","note_en":"Dug by hand from small dark mounds — no tool needed, no season gate, reachable from the start. Far better cooked into Black Truffle Pie (830G) or Black Truffle Cream Pasta (900G) than sold raw.","respawn":"约 15 分钟（来源区间 10–20 分钟）"}
]
;
