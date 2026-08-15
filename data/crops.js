var CROPS_DATA = [
  // ═══════════════════════════════════════════
  // 谷物类
  // ═══════════════════════════════════════════
  {"name":"小麦","enName":"Wheat","category":"谷物","growthTime":"4小时","season":"全年","sellPrice":20,"seedPrice":5,"profitPerHour":5,"harvestType":"单次收获","priority":"最高","note":"后期几乎所有高利润食谱都需要，批量种植","unlock":"初始解锁"},
  {"name":"水稻","enName":"Rice","category":"谷物","growthTime":"3小时","season":"春、夏","sellPrice":25,"seedPrice":8,"profitPerHour":8.3,"harvestType":"单次收获","priority":"高","note":"米饭、寿司类食谱基础材料","unlock":"农耕等级3"},
  {"name":"玉米","enName":"Corn","category":"谷物","growthTime":"3小时","season":"夏、秋","sellPrice":40,"seedPrice":10,"profitPerHour":13.3,"harvestType":"单次收获","priority":"中","note":"玉米浓汤材料，也可直接烤制","unlock":"农耕等级2"},
  {"name":"大豆","enName":"Soybean","category":"谷物","growthTime":"2小时","season":"夏","sellPrice":28,"seedPrice":8,"profitPerHour":14,"harvestType":"单次收获","priority":"中","note":"豆腐、豆浆原料，加工后价值翻倍","unlock":"农耕等级4"},
  {"name":"甘蔗","enName":"Sugarcane","category":"谷物","growthTime":"8小时","season":"夏","sellPrice":35,"seedPrice":12,"profitPerHour":4.4,"harvestType":"单次收获","priority":"低","note":"制糖原料，用于甜点类食谱","unlock":"农耕等级5"},

  // ═══════════════════════════════════════════
  // 蔬菜类
  // ═══════════════════════════════════════════
  {"name":"土豆","enName":"Potato","category":"蔬菜","growthTime":"2小时","season":"全年","sellPrice":35,"seedPrice":5,"profitPerHour":17.5,"harvestType":"单次收获","priority":"高","note":"比番茄收益高3倍，新手首选作物","unlock":"初始解锁"},
  {"name":"番茄","enName":"Tomato","category":"蔬菜","growthTime":"1小时","season":"全年","sellPrice":12,"seedPrice":3,"profitPerHour":12,"harvestType":"多次收获","priority":"低","note":"收益低，仅做任务或食谱配料","unlock":"初始解锁"},
  {"name":"胡萝卜","enName":"Carrot","category":"蔬菜","growthTime":"2小时","season":"全年","sellPrice":30,"seedPrice":6,"profitPerHour":15,"harvestType":"单次收获","priority":"中","note":"胡萝卜蛋糕材料，烹饪后价值提升","unlock":"初始解锁"},
  {"name":"辣椒","enName":"Chili Pepper","category":"蔬菜","growthTime":"3小时","season":"夏","sellPrice":32,"seedPrice":8,"profitPerHour":10.7,"harvestType":"多次收获","priority":"中","note":"辛辣料理必备，咖喱核心材料","unlock":"农耕等级4"},
  {"name":"黄瓜","enName":"Cucumber","category":"蔬菜","growthTime":"2小时","season":"春、夏","sellPrice":22,"seedPrice":5,"profitPerHour":11,"harvestType":"多次收获","priority":"中","note":"沙拉原料，也可腌制保存","unlock":"农耕等级2"},
  {"name":"洋葱","enName":"Onion","category":"蔬菜","growthTime":"3小时","season":"全年","sellPrice":28,"seedPrice":6,"profitPerHour":9.3,"harvestType":"单次收获","priority":"中","note":"多种料理的通用配料","unlock":"初始解锁"},
  {"name":"茄子","enName":"Eggplant","category":"蔬菜","growthTime":"4小时","season":"夏、秋","sellPrice":38,"seedPrice":10,"profitPerHour":9.5,"harvestType":"多次收获","priority":"中","note":"烧烤、炖菜材料","unlock":"农耕等级3"},
  {"name":"白菜","enName":"Chinese Cabbage","category":"蔬菜","growthTime":"3小时","season":"全年","sellPrice":24,"seedPrice":5,"profitPerHour":8,"harvestType":"单次收获","priority":"低","note":"泡菜、炒菜基础食材","unlock":"初始解锁"},
  {"name":"生菜","enName":"Lettuce","category":"蔬菜","growthTime":"1.5小时","season":"春","sellPrice":18,"seedPrice":4,"profitPerHour":12,"harvestType":"单次收获","priority":"低","note":"沙拉核心材料，生长快速","unlock":"初始解锁"},
  {"name":"南瓜","enName":"Pumpkin","category":"蔬菜","growthTime":"5小时","season":"秋","sellPrice":55,"seedPrice":15,"profitPerHour":11,"harvestType":"单次收获","priority":"中","note":"南瓜派材料，秋季限定高收益","unlock":"农耕等级5"},
  {"name":"青椒","enName":"Green Pepper","category":"蔬菜","growthTime":"2.5小时","season":"夏","sellPrice":26,"seedPrice":7,"profitPerHour":10.4,"harvestType":"多次收获","priority":"低","note":"炒菜配料，可搭配多种食谱","unlock":"农耕等级3"},
  {"name":"甜菜","enName":"Beet","category":"蔬菜","growthTime":"3小时","season":"春、秋","sellPrice":30,"seedPrice":8,"profitPerHour":10,"harvestType":"单次收获","priority":"低","note":"制糖替代原料，营养丰富","unlock":"农耕等级3"},

  // ═══════════════════════════════════════════
  // 水果类
  // ═══════════════════════════════════════════
  {"name":"蓝莓","enName":"Blueberry","category":"水果","growthTime":"6小时","season":"夏","sellPrice":16,"seedPrice":20,"profitPerHour":2.7,"harvestType":"多次收获","priority":"高","note":"4颗做蓝莓酱=170金币，利润翻倍","unlock":"农耕等级6"},
  {"name":"草莓","enName":"Strawberry","category":"水果","growthTime":"8小时","season":"春","sellPrice":30,"seedPrice":25,"profitPerHour":3.75,"harvestType":"多次收获","priority":"高","note":"制作草莓酱中后期单批赚数万","unlock":"农耕等级7"},
  {"name":"葡萄","enName":"Grape","category":"水果","growthTime":"12小时","season":"秋","sellPrice":40,"seedPrice":30,"profitPerHour":3.3,"harvestType":"多次收获","priority":"高","note":"制作葡萄酱利润极高，长期投资","unlock":"农耕等级8"},
  {"name":"柠檬","enName":"Lemon","category":"水果","growthTime":"6小时","season":"全年","sellPrice":25,"seedPrice":15,"profitPerHour":4.2,"harvestType":"多次收获","priority":"低","note":"烹饪配料，需求量小但全年可种","unlock":"农耕等级5"},
  {"name":"西瓜","enName":"Watermelon","category":"水果","growthTime":"10小时","season":"夏","sellPrice":80,"seedPrice":35,"profitPerHour":8,"harvestType":"单次收获","priority":"中","note":"夏季高产值作物，直接出售收益可观","unlock":"农耕等级6"},
  {"name":"菠萝","enName":"Pineapple","category":"水果","growthTime":"14小时","season":"夏","sellPrice":120,"seedPrice":50,"profitPerHour":8.6,"harvestType":"单次收获","priority":"中","note":"热带水果，生长期长但售价高","unlock":"农耕等级9"},
  {"name":"可可豆","enName":"Cocoa Bean","category":"水果","growthTime":"8小时","season":"全年","sellPrice":38,"seedPrice":20,"profitPerHour":4.8,"harvestType":"多次收获","priority":"中","note":"巧克力原料，甜品核心材料","unlock":"农耕等级7"},

  // ═══════════════════════════════════════════
  // 花卉类
  // ═══════════════════════════════════════════
  {"name":"向日葵","enName":"Sunflower","category":"花卉","growthTime":"4小时","season":"夏","sellPrice":50,"seedPrice":15,"profitPerHour":12.5,"harvestType":"单次收获","priority":"中","note":"产葵花籽用于榨油，装饰性也高","unlock":"农耕等级5"},
  {"name":"棉花","enName":"Cotton","category":"花卉","growthTime":"6小时","season":"春、夏","sellPrice":45,"seedPrice":18,"profitPerHour":7.5,"harvestType":"单次收获","priority":"低","note":"纺织材料，用于制作布料和服装","unlock":"农耕等级6"},

  // ═══════════════════════════════════════════
  // 菌类 / 采集品
  // ═══════════════════════════════════════════
  {"name":"蘑菇","enName":"Mushroom","category":"菌类","growthTime":"无（采集）","season":"秋","sellPrice":15,"seedPrice":0,"profitPerHour":"采集","harvestType":"野外采集","priority":"中","note":"免费采集，烤蘑菇零成本赚钱","unlock":"无需解锁"},
  {"name":"黑松露","enName":"Black Truffle","category":"采集品","growthTime":"无（采集）","season":"秋","sellPrice":200,"seedPrice":0,"profitPerHour":"采集","harvestType":"稀有采集","priority":"最高","note":"稀有采集品，高利润食谱核心材料","unlock":"采集等级5"}
]
;
