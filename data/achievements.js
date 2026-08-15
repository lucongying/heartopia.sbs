var ACHIEVEMENTS_DATA = [
  // ── 🗺️ 冒险 ──
  {"name":"初来乍到","category":"冒险","enName":"First Steps","description":"首次登岛，踏入心托邦的世界","unlock":"自动解锁","reward":"许愿星 ×10","difficulty":1,"tips":"完成新手教程即可自动获得"},
  {"name":"Dream探索者","category":"冒险","enName":"Dream Explorer","description":"完成10次Dream探索","unlock":"DG Lv.16","reward":"许愿星 ×100","difficulty":3,"tips":"每日可进行Dream探索，坚持参与即可达成"},
  {"name":"Dream大师","category":"冒险","enName":"Dream Master","description":"完成50次Dream探索","unlock":"DG Lv.16","reward":"许愿星 ×300","difficulty":4,"tips":"长期目标，配合日常任务一起完成"},
  {"name":"岛屿开拓者","category":"冒险","enName":"Island Pioneer","description":"解锁全部岛屿区域","unlock":"DG Lv.20","reward":"称号「开拓者」","difficulty":4,"tips":"提升DG等级以解锁新区域"},
  {"name":"宝藏猎人","category":"冒险","enName":"Treasure Hunter","description":"挖掘50个埋藏宝箱","unlock":"解锁铲子后","reward":"许愿星 ×150","difficulty":3,"tips":"注意观察地面上的特殊标记"},
  {"name":"地宫勇者","category":"冒险","enName":"Dungeon Brave","description":"完成所有地宫挑战","unlock":"DG Lv.10","reward":"称号「勇者」","difficulty":5,"tips":"准备充足的回复道具再挑战"},
  {"name":"传送大师","category":"冒险","enName":"Teleport Master","description":"解锁全部传送点","unlock":"DG Lv.8","reward":"许愿星 ×80","difficulty":2,"tips":"探索地图各区域即可逐步解锁"},

  // ── 🎣 钓鱼 ──
  {"name":"钓鱼新手","category":"钓鱼","enName":"Fishing Novice","description":"钓到第一条鱼","unlock":"解锁钓鱼后","reward":"许愿星 ×20","difficulty":1,"tips":"在任意水域抛竿即可"},
  {"name":"钓鱼达人","category":"钓鱼","enName":"Fishing Expert","description":"钓到50种不同的鱼","unlock":"解锁钓鱼后","reward":"许愿星 ×100","difficulty":3,"tips":"注意不同季节、天气和时间段的鱼种变化"},
  {"name":"钓鱼大师","category":"钓鱼","enName":"Fishing Master","description":"钓到全部91种鱼类","unlock":"解锁钓鱼后","reward":"称号「鱼王」","difficulty":5,"tips":"部分稀有鱼仅在特定天气出现，参考鱼类图鉴"},
  {"name":"金色传说","category":"钓鱼","enName":"Golden Legend","description":"钓到10条金色鱼影的鱼","unlock":"钓鱼Lv.5","reward":"许愿星 ×200","difficulty":4,"tips":"金色鱼影出现概率极低，在海洋区域耐心等待"},
  {"name":"彩虹之约","category":"钓鱼","enName":"Rainbow Catch","description":"在彩虹天气钓到彩虹鱼","unlock":"解锁钓鱼后","reward":"许愿星 ×150","difficulty":3,"tips":"彩虹鱼仅在春季彩虹天气出现于星光海"},
  {"name":"河川征服者","category":"钓鱼","enName":"River Conqueror","description":"钓到全部河流鱼类","unlock":"解锁钓鱼后","reward":"许愿星 ×120","difficulty":3,"tips":"河流鱼类分布在不同河段，注意位置区分"},

  // ── 🌱 园艺 ──
  {"name":"园艺新手","category":"园艺","enName":"Gardening Beginner","description":"收获第一次作物","unlock":"解锁园艺后","reward":"许愿星 ×20","difficulty":1,"tips":"购买种子后在农场种植并浇水"},
  {"name":"园艺大师","category":"园艺","enName":"Gardening Master","description":"收获100次作物","unlock":"解锁园艺后","reward":"许愿星 ×50","difficulty":2,"tips":"多种植生长周期短的作物可加速达成"},
  {"name":"绿手指","category":"园艺","enName":"Green Thumb","description":"收获500次作物","unlock":"解锁园艺后","reward":"许愿星 ×200","difficulty":4,"tips":"利用温室和季节优势，持续种植"},
  {"name":"百花齐放","category":"园艺","enName":"Blooming Garden","description":"种植过所有种类的花卉","unlock":"解锁园艺后","reward":"称号「花匠」","difficulty":4,"tips":"部分花卉种子需完成特定任务解锁"},
  {"name":"巨型作物","category":"园艺","enName":"Giant Crop","description":"收获一个巨型作物","unlock":"解锁园艺后","reward":"许愿星 ×80","difficulty":3,"tips":"将同种作物3×3种植，有概率长出巨型作物"},
  {"name":"四季农夫","category":"园艺","enName":"Four Seasons Farmer","description":"在四个季节各收获50次作物","unlock":"解锁园艺后","reward":"许愿星 ×150","difficulty":3,"tips":"每个季节选择当季作物种植效率最高"},

  // ── 🍳 烹饪 ──
  {"name":"烹饪新手","category":"烹饪","enName":"Cooking Rookie","description":"烹饪第一道菜","unlock":"解锁烹饪后","reward":"许愿星 ×20","difficulty":1,"tips":"收集材料后在厨房烹饪即可"},
  {"name":"烹饪达人","category":"烹饪","enName":"Cooking Expert","description":"烹饪50道菜","unlock":"解锁烹饪后","reward":"许愿星 ×50","difficulty":2,"tips":"尝试不同食谱，部分食谱需要解锁"},
  {"name":"烹饪大师","category":"烹饪","enName":"Cooking Master","description":"烹饪200道菜","unlock":"解锁烹饪后","reward":"称号「大厨」","difficulty":4,"tips":"批量烹饪低级食谱是最快的方式"},
  {"name":"三星主厨","category":"烹饪","enName":"Three-Star Chef","description":"烹饪出10道★★★品质料理","unlock":"烹饪Lv.8","reward":"许愿星 ×150","difficulty":4,"tips":"提升烹饪等级并选用高品质食材"},
  {"name":"食谱收藏家","category":"烹饪","enName":"Recipe Collector","description":"解锁全部食谱","unlock":"解锁烹饪后","reward":"称号「美食家」","difficulty":5,"tips":"部分食谱需要完成NPC任务或达到特定等级"},
  {"name":"甜品大师","category":"烹饪","enName":"Dessert Master","description":"烹饪30道甜品类料理","unlock":"解锁烹饪后","reward":"许愿星 ×80","difficulty":2,"tips":"甜点食谱多在烹饪等级提升后解锁"},
  {"name":"深夜食堂","category":"烹饪","enName":"Midnight Diner","description":"在夜间时段烹饪20道菜","unlock":"解锁烹饪后","reward":"许愿星 ×60","difficulty":2,"tips":"调整游戏时间到夜间再进行烹饪即可"},

  // ── 🦋 捕虫 ──
  {"name":"捕虫新手","category":"捕虫","enName":"Bug Catching Novice","description":"捕获第一只昆虫","unlock":"解锁捕虫后","reward":"许愿星 ×20","difficulty":1,"tips":"装备捕虫网后靠近昆虫即可捕获"},
  {"name":"捕虫高手","category":"捕虫","enName":"Bug Catching Expert","description":"捕获50种昆虫","unlock":"解锁捕虫后","reward":"许愿星 ×80","difficulty":3,"tips":"不同季节和天气出现的昆虫不同"},
  {"name":"捕虫大师","category":"捕虫","enName":"Bug Catching Master","description":"捕获全部昆虫种类","unlock":"解锁捕虫后","reward":"称号「虫王」","difficulty":5,"tips":"稀有昆虫通常出现在特定天气和时段"},
  {"name":"蝴蝶收集家","category":"捕虫","enName":"Butterfly Collector","description":"捕获全部蝴蝶品种","unlock":"解锁捕虫后","reward":"许愿星 ×120","difficulty":3,"tips":"蝴蝶多在白天晴朗天气出没于花田"},
  {"name":"甲虫猎人","category":"捕虫","enName":"Beetle Hunter","description":"捕获全部甲虫品种","unlock":"解锁捕虫后","reward":"许愿星 ×120","difficulty":4,"tips":"甲虫多在夜间出现在树干上"},
  {"name":"萤火虫之夜","category":"捕虫","enName":"Firefly Night","description":"在夜间捕获20只萤火虫","unlock":"解锁捕虫后","reward":"许愿星 ×60","difficulty":2,"tips":"夏季夜晚在河边和森林区域寻找"},

  // ── 🐦 观鸟 ──
  {"name":"观鸟新手","category":"观鸟","enName":"Birdwatching Beginner","description":"观测第一种鸟类","unlock":"解锁观鸟后","reward":"许愿星 ×20","difficulty":1,"tips":"装备望远镜后在鸟类栖息地观察"},
  {"name":"观鸟爱好者","category":"观鸟","enName":"Birdwatching Enthusiast","description":"观测30种鸟类","unlock":"解锁观鸟后","reward":"许愿星 ×60","difficulty":2,"tips":"不同区域有不同鸟类，多探索各区域"},
  {"name":"观鸟大师","category":"观鸟","enName":"Birdwatching Master","description":"观测全部鸟类","unlock":"观鸟Lv.10","reward":"称号「鸟语者」","difficulty":5,"tips":"高等级鸟类需要观鸟等级达标才能发现"},
  {"name":"猛禽观察者","category":"观鸟","enName":"Raptor Observer","description":"观测全部猛禽类鸟类","unlock":"观鸟Lv.6","reward":"许愿星 ×100","difficulty":4,"tips":"鹰、隼等猛禽多在高山和悬崖区域"},
  {"name":"晨鸟先知","category":"观鸟","enName":"Early Bird","description":"在清晨时段观测20种鸟类","unlock":"解锁观鸟后","reward":"许愿星 ×60","difficulty":2,"tips":"部分鸟类仅在清晨活跃，调整游戏时间"},

  // ── 👥 社交 ──
  {"name":"初识邻里","category":"社交","enName":"Meet the Neighbors","description":"与5位NPC交谈","unlock":"始终可用","reward":"许愿星 ×20","difficulty":1,"tips":"主动与岛上NPC对话即可"},
  {"name":"社交达人","category":"社交","enName":"Social Butterfly","description":"与所有NPC达到好友关系","unlock":"解锁友谊后","reward":"许愿星 ×100","difficulty":4,"tips":"每天送NPC喜欢的礼物可快速提升好感度"},
  {"name":"挚友如金","category":"社交","enName":"Best Friends Forever","description":"与5位NPC达到挚友关系","unlock":"解锁友谊后","reward":"称号「挚友」","difficulty":5,"tips":"持续送礼、完成NPC委托任务效果最佳"},
  {"name":"礼物专家","category":"社交","enName":"Gift Expert","description":"送出100件礼物给NPC","unlock":"解锁友谊后","reward":"许愿星 ×80","difficulty":2,"tips":"了解每位NPC的喜好可事半功倍"},
  {"name":"故事收集者","category":"社交","enName":"Story Collector","description":"触发全部NPC的个人剧情","unlock":"解锁友谊后","reward":"称号「倾听者」","difficulty":5,"tips":"提升好感度可解锁更多个人故事"},

  // ── 💰 财富 ──
  {"name":"第一桶金","category":"财富","enName":"First Fortune","description":"累计赚取10,000金币","unlock":"始终可用","reward":"许愿星 ×30","difficulty":1,"tips":"出售鱼类、作物等即可快速累积"},
  {"name":"百万富翁","category":"财富","enName":"Millionaire","description":"累计赚取1,000,000金币","unlock":"始终可用","reward":"称号「富豪」","difficulty":4,"tips":"高价值作物和稀有鱼类是不错的赚钱途径"},
  {"name":"亿万富翁","category":"财富","enName":"Billionaire","description":"累计赚取10,000,000金币","unlock":"始终可用","reward":"称号「大亨」","difficulty":5,"tips":"参考赚钱攻略页面，选择最优收益方式"},
  {"name":"勤俭持家","category":"财富","enName":"Thrifty Saver","description":"单日存下50,000金币","unlock":"始终可用","reward":"许愿星 ×80","difficulty":3,"tips":"在收获日集中出售高价值物品"},
  {"name":"挥金如土","category":"财富","enName":"Big Spender","description":"单日消费100,000金币","unlock":"始终可用","reward":"许愿星 ×100","difficulty":3,"tips":"攒够钱后一次性升级所有工具和建筑"},

  // ── 🏆 收集 ──
  {"name":"全能收集者","category":"收集","enName":"Ultimate Collector","description":"完成所有图鉴（鱼+虫+鸟）","unlock":"始终可用","reward":"称号「完美」","difficulty":5,"tips":"这是游戏的终极目标之一，需要极大耐心"},
  {"name":"博物馆捐赠","category":"收集","enName":"Museum Donor","description":"向博物馆捐赠50件藏品","unlock":"解锁博物馆后","reward":"许愿星 ×150","difficulty":3,"tips":"每种鱼类、昆虫和鸟类都可以捐赠一次"},
  {"name":"宝藏收藏家","category":"收集","enName":"Artifact Collector","description":"收集全部宝藏和文物","unlock":"始终可用","reward":"称号「考古学家」","difficulty":5,"tips":"挖掘、钓鱼和探索地宫均可获得文物"},
  {"name":"乐谱全通","category":"收集","enName":"Score Master","description":"收集全部乐谱","unlock":"解锁音乐后","reward":"许愿星 ×120","difficulty":4,"tips":"乐谱可通过NPC赠送、商店购买等途径获得"},

  // ── 🏠 建造 ──
  {"name":"家园设计师","category":"建造","enName":"Home Designer","description":"放置100件家具","unlock":"解锁建造后","reward":"许愿星 ×80","difficulty":2,"tips":"在商店购买或在任务中获得家具"},
  {"name":"室内装潢师","category":"建造","enName":"Interior Decorator","description":"放置300件家具","unlock":"解锁建造后","reward":"称号「设计师」","difficulty":4,"tips":"完成房间主题搭配可获得额外奖励"},
  {"name":"建筑大师","category":"建造","enName":"Master Builder","description":"升级全部建筑到最高等级","unlock":"解锁建造后","reward":"称号「建筑师」","difficulty":5,"tips":"优先升级功能性建筑如厨房和工作台"},
  {"name":"花园景观师","category":"建造","enName":"Landscape Artist","description":"在户外放置50件装饰物","unlock":"解锁建造后","reward":"许愿星 ×60","difficulty":2,"tips":"户外装饰包括栅栏、路灯、花坛等"},

  // ── 🐾 宠物 ──
  {"name":"宠物之友","category":"宠物","enName":"Pet Friend","description":"领养猫和狗","unlock":"DG Lv.12","reward":"许愿星 ×50","difficulty":2,"tips":"达到DG等级后前往宠物店领养"},
  {"name":"毛茸茸家族","category":"宠物","enName":"Furry Family","description":"领养全部种类的宠物","unlock":"DG Lv.18","reward":"称号「铲屎官」","difficulty":4,"tips":"部分稀有宠物需要完成特定任务解锁"},
  {"name":"最佳拍档","category":"宠物","enName":"Best Companion","description":"与宠物亲密度达到最高","unlock":"解锁宠物后","reward":"许愿星 ×100","difficulty":3,"tips":"每天喂食、抚摸和带宠物散步"},
  {"name":"宠物时装秀","category":"宠物","enName":"Pet Fashion Show","description":"为宠物购买10件饰品","unlock":"解锁宠物后","reward":"许愿星 ×50","difficulty":2,"tips":"宠物饰品可在宠物商店购买"},

  // ── 🎵 音乐 ──
  {"name":"音乐初心者","category":"音乐","enName":"Music Beginner","description":"学习演奏第一首乐曲","unlock":"解锁音乐后","reward":"许愿星 ×20","difficulty":1,"tips":"获得乐谱后在下雨或特定地点演奏"},
  {"name":"街头艺人","category":"音乐","enName":"Street Performer","description":"在公共场合演奏20次","unlock":"解锁音乐后","reward":"许愿星 ×60","difficulty":2,"tips":"在NPC聚集的区域演奏可获得更多关注"},
  {"name":"完美演奏","category":"音乐","enName":"Perfect Performance","description":"无失误演奏一首高难度乐曲","unlock":"音乐Lv.8","reward":"称号「音乐家」","difficulty":5,"tips":"多练习高难度乐谱，掌握节奏是关键"},

  // ── ⛏️ 采集 ──
  {"name":"采集新手","category":"采集","enName":"Foraging Beginner","description":"采集50个野生资源","unlock":"始终可用","reward":"许愿星 ×20","difficulty":1,"tips":"地图上各处都有可采集的浆果、蘑菇等"},
  {"name":"采集达人","category":"采集","enName":"Foraging Expert","description":"采集500个野生资源","unlock":"始终可用","reward":"许愿星 ×100","difficulty":3,"tips":"每天刷新采集点，坚持每日采集"},
  {"name":"伐木工","category":"采集","enName":"Lumberjack","description":"砍伐500棵树","unlock":"解锁斧头后","reward":"许愿星 ×80","difficulty":2,"tips":"树木每天刷新，砍伐后记得补种"},
  {"name":"矿工","category":"采集","enName":"Miner","description":"挖掘500个矿石","unlock":"解锁镐子后","reward":"许愿星 ×80","difficulty":2,"tips":"矿洞中矿石资源丰富，每日可进矿洞采集"},

  // ── 🎪 活动 ──
  {"name":"节日初体验","category":"活动","enName":"Festival First-Timer","description":"参加第一次节日活动","unlock":"季节活动期间","reward":"许愿星 ×30","difficulty":1,"tips":"留意日历上的节日标记，按时参加"},
  {"name":"活动达人","category":"活动","enName":"Event Enthusiast","description":"参加10次节日活动","unlock":"季节活动期间","reward":"许愿星 ×100","difficulty":3,"tips":"每个季节都有不同节日，不要错过"},
  {"name":"竞赛冠军","category":"活动","enName":"Competition Champion","description":"在任意竞赛中获得第一名","unlock":"解锁竞赛后","reward":"称号「冠军」","difficulty":4,"tips":"提前准备竞赛所需物品，如鱼、作物等"},
  {"name":"烟火大会","category":"活动","enName":"Fireworks Spectator","description":"参加夏季烟火大会","unlock":"夏季活动","reward":"许愿星 ×50","difficulty":1,"tips":"夏季夜晚在海滩区域参加"}
];
