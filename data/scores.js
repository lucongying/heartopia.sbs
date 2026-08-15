var SCORES_DATA = [
  // ═══════════════════════════════════════════════
  // 初始 / 主线乐谱
  // ═══════════════════════════════════════════════
  {"name":"Heartopia 主题曲","enName":"Heartopia Main Theme","source":"游戏原声","instrument":"钢琴","difficulty":2,"style":"古典","duration":"2:30","mood":"温馨","bpm":"72","unlock":"自动解锁","note":"游戏的主题旋律，简单优美，适合新手练习"},
  {"name":"冒险进行曲","enName":"Adventure March","source":"主线任务","instrument":"小号","difficulty":2,"style":"进行曲","duration":"1:45","mood":"激昂","bpm":"120","unlock":"DG Lv.5","note":"节奏明快的进行曲，是冒险者的必备曲目"},
  {"name":"梦想启程","enName":"Dream Departure","source":"主线任务","instrument":"钢琴","difficulty":3,"style":"古典","duration":"3:00","mood":"温馨","bpm":"80","unlock":"DG Lv.10","note":"Dream系统解锁后的纪念乐章，充满希望与温暖"},
  {"name":"丰收庆典","enName":"Harvest Festival","source":"主线任务","instrument":"小提琴","difficulty":3,"style":"民谣","duration":"2:15","mood":"欢快","bpm":"132","unlock":"DG Lv.15","note":"庆祝丰收的传统曲目，在小镇节日中广为流传"},

  // ═══════════════════════════════════════════════
  // 区域探索乐谱
  // ═══════════════════════════════════════════════
  {"name":"渔村小调","enName":"Fishing Village Ditty","source":"渔村区域","instrument":"吉他","difficulty":1,"style":"民谣","duration":"1:30","mood":"宁静","bpm":"60","unlock":"到达渔村","note":"渔村老渔民口耳相传的小曲，简单却充满生活气息"},
  {"name":"森林漫步","enName":"Forest Stroll","source":"森林区域","instrument":"长笛","difficulty":2,"style":"古典","duration":"2:00","mood":"宁静","bpm":"68","unlock":"到达森林","note":"模仿林间鸟鸣的轻快乐章，漫步森林时的完美伴奏"},
  {"name":"温泉小夜曲","enName":"Hot Spring Serenade","source":"温泉区域","instrument":"竖琴","difficulty":3,"style":"古典","duration":"3:30","mood":"宁静","bpm":"56","unlock":"到达温泉","note":"温泉雾气中飘荡的悠扬旋律，让人身心放松"},
  {"name":"花田圆舞曲","enName":"Flower Field Waltz","source":"花田区域","instrument":"小提琴","difficulty":2,"style":"古典","duration":"2:45","mood":"欢快","bpm":"96","unlock":"到达花田","note":"三拍子的优雅圆舞曲，仿佛在花海中旋转起舞"},
  {"name":"海滩午后","enName":"Beach Afternoon","source":"海滩区域","instrument":"吉他","difficulty":1,"style":"民谣","duration":"1:45","mood":"欢快","bpm":"108","unlock":"到达海滩","note":"阳光沙滩上的轻松弹唱，带着海风的味道"},

  // ═══════════════════════════════════════════════
  // 四季限定乐谱
  // ═══════════════════════════════════════════════
  {"name":"春日序曲","enName":"Spring Overture","source":"春季活动","instrument":"小提琴","difficulty":3,"style":"古典","duration":"3:15","mood":"欢快","bpm":"104","unlock":"春季限定","note":"万物复苏的春日赞歌，樱花飘落时的绝美旋律"},
  {"name":"樱花纷飞","enName":"Cherry Blossom Dance","source":"春季活动","instrument":"长笛","difficulty":2,"style":"古典","duration":"2:20","mood":"温馨","bpm":"76","unlock":"春季限定","note":"以樱花为灵感的轻盈曲调，春天的代表乐章"},
  {"name":"夏夜小夜曲","enName":"Summer Night Serenade","source":"夏季活动","instrument":"钢琴","difficulty":3,"style":"古典","duration":"3:45","mood":"宁静","bpm":"64","unlock":"夏季限定","note":"夏夜星空下的浪漫夜曲，蝉鸣与琴声交织"},
  {"name":"海浪狂想曲","enName":"Wave Rhapsody","source":"夏季活动","instrument":"打击乐","difficulty":4,"style":"爵士","duration":"4:00","mood":"激昂","bpm":"144","unlock":"夏季限定","note":"充满激情与力量的打击乐作品，仿佛与海浪搏击"},
  {"name":"秋日私语","enName":"Autumn Whisper","source":"秋季活动","instrument":"吉他","difficulty":2,"style":"民谣","duration":"2:30","mood":"忧伤","bpm":"72","unlock":"秋季限定","note":"落叶飘零时的温柔私语，带着淡淡的思念"},
  {"name":"红叶协奏曲","enName":"Red Leaf Concerto","source":"秋季活动","instrument":"钢琴","difficulty":4,"style":"古典","duration":"5:00","mood":"忧伤","bpm":"66","unlock":"秋季限定","note":"秋意最浓时的华美乐章，技巧与情感并重"},
  {"name":"冬日暖阳","enName":"Winter Sunshine","source":"冬季活动","instrument":"钢琴","difficulty":3,"style":"古典","duration":"3:00","mood":"温馨","bpm":"70","unlock":"冬季限定","note":"窗外飘雪、屋内暖炉般的温暖旋律"},
  {"name":"雪之华","enName":"Snow Flower","source":"冬季活动","instrument":"竖琴","difficulty":3,"style":"古典","duration":"2:50","mood":"宁静","bpm":"58","unlock":"冬季限定","note":"雪花缓缓飘落的晶莹音色，冬日最美独奏曲"},

  // ═══════════════════════════════════════════════
  // 节日/活动乐谱
  // ═══════════════════════════════════════════════
  {"name":"节日欢歌","enName":"Festival Carol","source":"节日活动","instrument":"合奏","difficulty":4,"style":"流行","duration":"3:30","mood":"欢快","bpm":"128","unlock":"节日限定","note":"小镇节日庆典的压轴曲目，需要多人合奏完成"},
  {"name":"星空摇篮曲","enName":"Starry Lullaby","source":"夜间探索","instrument":"竖琴","difficulty":2,"style":"古典","duration":"3:00","mood":"宁静","bpm":"52","unlock":"Dream解锁后","note":"仰望星空时的安眠曲，能让听众安然入梦"},
  {"name":"新月夜想曲","enName":"New Moon Nocturne","source":"夜间探索","instrument":"钢琴","difficulty":4,"style":"古典","duration":"4:30","mood":"忧伤","bpm":"60","unlock":"Dream解锁后","note":"月光下的独奏，技巧难度较高但意境绝美"},
  {"name":"烟花进行曲","enName":"Firework March","source":"节日活动","instrument":"小号","difficulty":4,"style":"进行曲","duration":"2:30","mood":"激昂","bpm":"140","unlock":"节日限定","note":"配合烟花表演的激昂乐章，节日气氛的顶点"},

  // ═══════════════════════════════════════════════
  // NPC赠送/友好度乐谱
  // ═══════════════════════════════════════════════
  {"name":"多萝西的时装秀","enName":"Dorothy's Fashion Show","source":"Dorothy 友好Lv.5","instrument":"钢琴","difficulty":3,"style":"流行","duration":"2:15","mood":"欢快","bpm":"116","unlock":"Dorothy 好感度Lv.5","note":"Dorothy亲手谱写的时装秀BGM，时尚感十足"},
  {"name":"渔夫之歌","enName":"Fisherman's Song","source":"Bill 友好Lv.5","instrument":"吉他","difficulty":1,"style":"民谣","duration":"1:30","mood":"欢快","bpm":"88","unlock":"Bill 好感度Lv.5","note":"Bill在渔村弹唱的拿手曲目，唱着大海的故事"},
  {"name":"园艺小调","enName":"Gardener's Tune","source":"Blanc 友好Lv.5","instrument":"长笛","difficulty":2,"style":"民谣","duration":"2:00","mood":"温馨","bpm":"78","unlock":"Blanc 好感度Lv.5","note":"Blanc在花园里常哼的旋律，充满了对花草的爱"},
  {"name":"美食家圆舞曲","enName":"Gourmet Waltz","source":"Massimo 友好Lv.5","instrument":"小提琴","difficulty":3,"style":"古典","duration":"3:00","mood":"欢快","bpm":"100","unlock":"Massimo 好感度Lv.5","note":"Massimo做菜时喜欢听的优雅乐章，据说能提升厨艺"},
  {"name":"虫鸣协奏曲","enName":"Insect Concerto","source":"Naniwa 友好Lv.5","instrument":"钢琴","difficulty":4,"style":"古典","duration":"4:00","mood":"激昂","bpm":"110","unlock":"Naniwa 好感度Lv.5","note":"Naniwa以虫鸣为灵感创作的独特作品，充满大自然的声音"},

  // ═══════════════════════════════════════════════
  // 隐藏/稀有乐谱
  // ═══════════════════════════════════════════════
  {"name":"传说之歌","enName":"Legendary Ballad","source":"隐藏探索","instrument":"合奏","difficulty":5,"style":"古典","duration":"6:00","mood":"激昂","bpm":"90","unlock":"完成所有主线后","note":"Heartopia最珍贵的乐谱，传说级难度，需要极高的演奏技巧"},
  {"name":"海底幻想曲","enName":"Underwater Fantasy","source":"隐藏探索","instrument":"竖琴","difficulty":4,"style":"古典","duration":"4:15","mood":"宁静","bpm":"62","unlock":"深海钓鱼成就","note":"据说听到这首曲子的人，能看见海底的梦幻世界"},
  {"name":"爵士咖啡馆","enName":"Jazz Café","source":"隐藏探索","instrument":"萨克斯","difficulty":3,"style":"爵士","duration":"3:45","mood":"欢快","bpm":"135","unlock":"艺术街区域","note":"艺术街咖啡馆里流淌的慵懒爵士，让人忍不住摇摆"},
  {"name":"彩虹桥","enName":"Rainbow Bridge","source":"隐藏探索","instrument":"合奏","difficulty":5,"style":"世界音乐","duration":"5:30","mood":"温馨","bpm":"84","unlock":"彩虹出现时","note":"只有在彩虹出现时才能获得的稀有乐谱，旋律如彩虹般绚丽"}
];
