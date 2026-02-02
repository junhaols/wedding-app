import { assetUrl } from '../utils/assets';
// 回忆盲盒数据 - 每张照片配一段文字
export interface MemoryCard {
  id: string;
  image: string;
  text: string;
  category: string;
  emoji: string;
}

export const memoryCards: MemoryCard[] = [
  // === 缅怀历史 (history) ===
  {
    id: 'history-1',
    image: assetUrl('/images/daily/history/WechatIMG1811.webp'),
    text: '那时的阳光正好，微风不噪，而你正好在笑。',
    category: '青春记忆',
    emoji: '🌱',
  },
  {
    id: 'history-2',
    image: assetUrl('/images/daily/history/WechatIMG1812.webp'),
    text: '翻开旧照片，每一帧都是我想私藏的时光。',
    category: '青春记忆',
    emoji: '📷',
  },
  {
    id: 'history-3',
    image: assetUrl('/images/daily/history/WechatIMG1813.webp'),
    text: '岁月漫长，唯有爱你的心，一如少年模样。',
    category: '青春记忆',
    emoji: '💫',
  },

  // === 巧克力 (chocolate) ===
  {
    id: 'chocolate-1',
    image: assetUrl('/images/daily/chocolate/WechatIMG1877.webp'),
    text: '那盒巧克力藏着我整个青春的勇气，幸好是你。',
    category: '甜蜜时刻',
    emoji: '🍫',
  },

  // === 99天纪念日 (anniversary) ===
  {
    id: 'anniversary-1',
    image: assetUrl('/images/daily/anniversary/WechatIMG1790.webp'),
    text: '在一起的第99天，想和你过每一个99年。',
    category: '纪念日',
    emoji: '💑',
  },
  {
    id: 'anniversary-2',
    image: assetUrl('/images/daily/anniversary/WechatIMG1791.webp'),
    text: '你眼中的光，是我此生见过最美的星辰。',
    category: '纪念日',
    emoji: '😊',
  },
  {
    id: 'anniversary-3',
    image: assetUrl('/images/daily/anniversary/WechatIMG1792.webp'),
    text: '想把所有美好的瞬间，都定格在有你的画面里。',
    category: '纪念日',
    emoji: '📸',
  },
  {
    id: 'anniversary-4',
    image: assetUrl('/images/daily/anniversary/WechatIMG1795.webp'),
    text: '这一天，我们许下了关于永远的诺言。',
    category: '纪念日',
    emoji: '💍',
  },
  {
    id: 'anniversary-5',
    image: assetUrl('/images/daily/anniversary/WechatIMG1796.webp'),
    text: '爱意随风起，风止意难平，你是我唯一的风景。',
    category: '纪念日',
    emoji: '❤️',
  },

  // === 一起自习 (study) ===
  {
    id: 'study-1',
    image: assetUrl('/images/daily/study/WechatIMG1897.webp'),
    text: '书页翻动的声音，和你呼吸的频率，是最好的白噪音。',
    category: '并肩成长',
    emoji: '📚',
  },
  {
    id: 'study-2',
    image: assetUrl('/images/daily/study/WechatIMG1898.webp'),
    text: '假装看书，其实余光全是你。',
    category: '并肩成长',
    emoji: '👀',
  },
  {
    id: 'study-3',
    image: assetUrl('/images/daily/study/WechatIMG1899.webp'),
    text: '并肩奋斗的日子，连空气都是甜的。',
    category: '并肩成长',
    emoji: '✨',
  },
  {
    id: 'study-4',
    image: assetUrl('/images/daily/study/WechatIMG1900.webp'),
    text: '累了就靠一下，我的肩膀永远为你留着。',
    category: '并肩成长',
    emoji: '🤗',
  },
  {
    id: 'study-5',
    image: assetUrl('/images/daily/study/WechatIMG1902.webp'),
    text: '最好的爱情，是势均力敌，也是相互成就。',
    category: '并肩成长',
    emoji: '💪',
  },

  // === 呼伦贝尔 (hulunbeier) ===
  {
    id: 'hulunbeier-1',
    image: assetUrl('/images/daily/hulunbeier/WechatIMG1774.webp'),
    text: '风吹草低，我听见了心动的声音。',
    category: '草原之旅',
    emoji: '🌾',
  },
  {
    id: 'hulunbeier-2',
    image: assetUrl('/images/daily/hulunbeier/WechatIMG1775.webp'),
    text: '想牵着你的手，去世界的尽头流浪。',
    category: '草原之旅',
    emoji: '☁️',
  },
  {
    id: 'hulunbeier-3',
    image: assetUrl('/images/daily/hulunbeier/WechatIMG1776.webp'),
    text: '天地辽阔，而我眼中只有微小的你。',
    category: '草原之旅',
    emoji: '🐎',
  },
  {
    id: 'hulunbeier-4',
    image: assetUrl('/images/daily/hulunbeier/WechatIMG1777.webp'),
    text: '草原上的落日余晖，不及你回眸一笑。',
    category: '草原之旅',
    emoji: '🌅',
  },
  {
    id: 'hulunbeier-5',
    image: assetUrl('/images/daily/hulunbeier/WechatIMG1778.webp'),
    text: '牛羊是风景，你是我的人间烟火。',
    category: '草原之旅',
    emoji: '🐑',
  },
  {
    id: 'hulunbeier-6',
    image: assetUrl('/images/daily/hulunbeier/WechatIMG1779.webp'),
    text: '呼伦贝尔的夏风，替我拥抱了你。',
    category: '草原之旅',
    emoji: '🌻',
  },
  {
    id: 'hulunbeier-7',
    image: assetUrl('/images/daily/hulunbeier/WechatIMG1780.webp'),
    text: '你奔跑的样子，像极了自由的风。',
    category: '草原之旅',
    emoji: '🎠',
  },
  {
    id: 'hulunbeier-8',
    image: assetUrl('/images/daily/hulunbeier/WechatIMG1781.webp'),
    text: '愿我们的爱，如这草原般生生不息。',
    category: '草原之旅',
    emoji: '💚',
  },
  {
    id: 'hulunbeier-9',
    image: assetUrl('/images/daily/hulunbeier/WechatIMG1783.webp'),
    text: '和你在一起，哪里都是自由的乐园。',
    category: '草原之旅',
    emoji: '🏃',
  },
  {
    id: 'hulunbeier-10',
    image: assetUrl('/images/daily/hulunbeier/WechatIMG1784.webp'),
    text: '天高地阔，只想将你紧紧拥入怀中。',
    category: '草原之旅',
    emoji: '🤗',
  },
  {
    id: 'hulunbeier-11',
    image: assetUrl('/images/daily/hulunbeier/WechatIMG1786.webp'),
    text: '把夏天写进诗里，把爱写进风里。',
    category: '草原之旅',
    emoji: '📝',
  },
  {
    id: 'hulunbeier-12',
    image: assetUrl('/images/daily/hulunbeier/WechatIMG1787.webp'),
    text: '草原再大，大不过我对你的思念。',
    category: '草原之旅',
    emoji: '💕',
  },
  {
    id: 'hulunbeier-13',
    image: assetUrl('/images/daily/hulunbeier/WechatIMG1788.webp'),
    text: '看过的风景，因为有你才有了意义。',
    category: '草原之旅',
    emoji: '🎞️',
  },
  {
    id: 'hulunbeier-14',
    image: assetUrl('/images/daily/hulunbeier/WechatIMG1809.webp'),
    text: '星空为被，大地为床，许你一世安稳。',
    category: '草原之旅',
    emoji: '⭐',
  },
  {
    id: 'hulunbeier-15',
    image: assetUrl('/images/daily/hulunbeier/WechatIMG1810.webp'),
    text: '这段旅程，是我们爱情最美的注脚。',
    category: '草原之旅',
    emoji: '📖',
  },

  // === 故宫 (gugong) ===
  {
    id: 'gugong-1',
    image: assetUrl('/images/daily/gugong/WechatIMG1794.webp'),
    text: '红墙金瓦锁不住流年，却锁住了我爱你的心。',
    category: '故宫之约',
    emoji: '🏯',
  },
  {
    id: 'gugong-2',
    image: assetUrl('/images/daily/gugong/WechatIMG1798.webp'),
    text: '在六百年的时光里，我们只是惊鸿一瞥，却是彼此的一生。',
    category: '故宫之约',
    emoji: '🚶',
  },
  {
    id: 'gugong-3',
    image: assetUrl('/images/daily/gugong/WechatIMG1827.webp'),
    text: '一眼万年，大概就是我看你时的感觉。',
    category: '故宫之约',
    emoji: '👑',
  },
  {
    id: 'gugong-4',
    image: assetUrl('/images/daily/gugong/WechatIMG1885.webp'),
    text: '触摸历史的温度，感受你在身边的踏实。',
    category: '故宫之约',
    emoji: '🧱',
  },
  {
    id: 'gugong-5',
    image: assetUrl('/images/daily/gugong/WechatIMG1887.webp'),
    text: '阳光倾洒，你比这宫殿更耀眼夺目。',
    category: '故宫之约',
    emoji: '☀️',
  },
  {
    id: 'gugong-6',
    image: assetUrl('/images/daily/gugong/WechatIMG1888.webp'),
    text: '愿得一心人，白首不相离——故宫为证。',
    category: '故宫之约',
    emoji: '💞',
  },
  {
    id: 'gugong-7',
    image: assetUrl('/images/daily/gugong/WechatIMG1889.webp'),
    text: '每一步都算数，因为是和你一起走的。',
    category: '故宫之约',
    emoji: '👣',
  },

  // === 北大初雪 (pkusnow) ===
  {
    id: 'pkusnow-1',
    image: assetUrl('/images/daily/pkusnow/WechatIMG1890.webp'),
    text: '初雪落下的时候，想和你一直走到了白头。',
    category: '初雪浪漫',
    emoji: '❄️',
  },
  {
    id: 'pkusnow-2',
    image: assetUrl('/images/daily/pkusnow/WechatIMG1891.webp'),
    text: '未名湖畔，雪落无声，爱意有痕。',
    category: '初雪浪漫',
    emoji: '🏔️',
  },
  {
    id: 'pkusnow-3',
    image: assetUrl('/images/daily/pkusnow/WechatIMG1892.webp'),
    text: '你站在雪里，像个坠入凡间的精灵。',
    category: '初雪浪漫',
    emoji: '👸',
  },
  {
    id: 'pkusnow-4',
    image: assetUrl('/images/daily/pkusnow/WechatIMG1894.webp'),
    text: '博雅塔守望着湖水，我守望着你。',
    category: '初雪浪漫',
    emoji: '🗼',
  },
  {
    id: 'pkusnow-5',
    image: assetUrl('/images/daily/pkusnow/WechatIMG1895.webp'),
    text: '约定好了，每年的初雪都要一起看。',
    category: '初雪浪漫',
    emoji: '⛄',
  },
  {
    id: 'pkusnow-6',
    image: assetUrl('/images/daily/pkusnow/WechatIMG1896.webp'),
    text: '天很冷，但牵着你的手就很暖。',
    category: '初雪浪漫',
    emoji: '🧣',
  },

  // === 成都 (chengdu) ===
  {
    id: 'chengdu-1',
    image: assetUrl('/images/daily/chengdu/WechatIMG1823.webp'),
    text: '成都带不走，但我能带走你。',
    category: '蜀地烟火',
    emoji: '🐼',
  },
  {
    id: 'chengdu-2',
    image: assetUrl('/images/daily/chengdu/WechatIMG1828.webp'),
    text: '火锅的辣和你的甜，是最佳绝配。',
    category: '蜀地烟火',
    emoji: '🍲',
  },
  {
    id: 'chengdu-3',
    image: assetUrl('/images/daily/chengdu/WechatIMG1829.webp'),
    text: '宽窄巷子，时光慢些，爱久一点。',
    category: '蜀地烟火',
    emoji: '🏮',
  },
  {
    id: 'chengdu-4',
    image: assetUrl('/images/daily/chengdu/WechatIMG1830.webp'),
    text: '就这样牵着手，在成都的街头走到灯火阑珊。',
    category: '蜀地烟火',
    emoji: '🍵',
  },
  {
    id: 'chengdu-5',
    image: assetUrl('/images/daily/chengdu/WechatIMG1831.webp'),
    text: '人间烟火气，最抚凡人心，你就是我的人间。',
    category: '蜀地烟火',
    emoji: '💝',
  },
  {
    id: 'chengdu-6',
    image: assetUrl('/images/daily/chengdu/WechatIMG1832.webp'),
    text: '足迹所至，皆是幸福的印记。',
    category: '蜀地烟火',
    emoji: '🛤️',
  },
  {
    id: 'chengdu-7',
    image: assetUrl('/images/daily/chengdu/WechatIMG1833.webp'),
    text: '旅行的意义，是看风景，更是看你。',
    category: '蜀地烟火',
    emoji: '🧳',
  },
  {
    id: 'chengdu-8',
    image: assetUrl('/images/daily/chengdu/WechatIMG1867.webp'),
    text: '大头贴定格的不仅是笑脸，更是那一刻的怦然心动。',
    category: '蜀地烟火',
    emoji: '🤳',
  },
  {
    id: 'chengdu-9',
    image: assetUrl('/images/daily/chengdu/WechatIMG1868.webp'),
    text: '无论多少次快门，都拍不够你的美。',
    category: '蜀地烟火',
    emoji: '📱',
  },

  // === 稻城亚丁 (daochengyading) ===
  {
    id: 'daochengyading-1',
    image: assetUrl('/images/daily/daochengyading/WechatIMG1836.webp'),
    text: '我偷偷告诉你，有一个地方叫做稻城，那是关于爱的终点。',
    category: '稻城之梦',
    emoji: '🏔️',
  },
  {
    id: 'daochengyading-2',
    image: assetUrl('/images/daily/daochengyading/WechatIMG1837.webp'),
    text: '雪山草甸，神山圣湖，不及你眉眼半分。',
    category: '稻城之梦',
    emoji: '🎨',
  },
  {
    id: 'daochengyading-3',
    image: assetUrl('/images/daily/daochengyading/WechatIMG1838.webp'),
    text: '稻城的秋天是童话，而你是童话里的公主。',
    category: '稻城之梦',
    emoji: '🍂',
  },
  {
    id: 'daochengyading-4',
    image: assetUrl('/images/daily/daochengyading/WechatIMG1839.webp'),
    text: '离天空越近，心跳的声音越清晰——全是爱你。',
    category: '稻城之梦',
    emoji: '🌤️',
  },
  {
    id: 'daochengyading-5',
    image: assetUrl('/images/daily/daochengyading/WechatIMG1840.webp'),
    text: '路过全世界，只想停留在你温暖的掌心。',
    category: '稻城之梦',
    emoji: '💖',
  },

  // === 藏袍 (tibetan) ===
  {
    id: 'tibetan-1',
    image: assetUrl('/images/daily/tibetan/WechatIMG1815.webp'),
    text: '一袭藏袍，惊艳了高原，也惊艳了我的岁月。',
    category: '高原风情',
    emoji: '🌸',
  },
  {
    id: 'tibetan-2',
    image: assetUrl('/images/daily/tibetan/WechatIMG1816.webp'),
    text: '阳光洒在你身上，美好得像一场梦。',
    category: '高原风情',
    emoji: '🖼️',
  },
  {
    id: 'tibetan-3',
    image: assetUrl('/images/daily/tibetan/WechatIMG1817.webp'),
    text: '高原的风知道，我有多爱你。',
    category: '高原风情',
    emoji: '💨',
  },
  {
    id: 'tibetan-4',
    image: assetUrl('/images/daily/tibetan/WechatIMG1818.webp'),
    text: '入目无别人，四下皆是你。',
    category: '高原风情',
    emoji: '👁️',
  },
  {
    id: 'tibetan-5',
    image: assetUrl('/images/daily/tibetan/WechatIMG1819.webp'),
    text: '我们是彼此最虔诚的信徒，信仰名为爱情。',
    category: '高原风情',
    emoji: '🙏',
  },
  {
    id: 'tibetan-6',
    image: assetUrl('/images/daily/tibetan/WechatIMG1820.webp'),
    text: '你的笑容，是高原上最纯净的氧气。',
    category: '高原风情',
    emoji: '😍',
  },
  {
    id: 'tibetan-7',
    image: assetUrl('/images/daily/tibetan/WechatIMG1821.webp'),
    text: '穿越千山万水，只为与你相遇。',
    category: '高原风情',
    emoji: '⏳',
  },
  {
    id: 'tibetan-8',
    image: assetUrl('/images/daily/tibetan/WechatIMG1822.webp'),
    text: '无论何时何地，你都是我心上的唯一。',
    category: '高原风情',
    emoji: '💯',
  },

  // === 西溪湿地 (xixishidi) ===
  {
    id: 'xixishidi-1',
    image: assetUrl('/images/daily/xixishidi/WechatIMG1850.webp'),
    text: '西溪且留下，留下你也留下了我。',
    category: '西溪诗意',
    emoji: '🌾',
  },
  {
    id: 'xixishidi-2',
    image: assetUrl('/images/daily/xixishidi/WechatIMG1851.webp'),
    text: '轻舟短棹，此生愿与你共渡。',
    category: '西溪诗意',
    emoji: '🛶',
  },
  {
    id: 'xixishidi-3',
    image: assetUrl('/images/daily/xixishidi/WechatIMG1852.webp'),
    text: '水光潋滟，不如你眼波流转。',
    category: '西溪诗意',
    emoji: '🌊',
  },
  {
    id: 'xixishidi-4',
    image: assetUrl('/images/daily/xixishidi/WechatIMG1853.webp'),
    text: '择一城终老，遇一人白首，幸好是你。',
    category: '西溪诗意',
    emoji: '🏡',
  },
  {
    id: 'xixishidi-5',
    image: assetUrl('/images/daily/xixishidi/WechatIMG1854.webp'),
    text: '和你在一起，荒草丛生也成了诗意盎然。',
    category: '西溪诗意',
    emoji: '📜',
  },
  {
    id: 'xixishidi-6',
    image: assetUrl('/images/daily/xixishidi/WechatIMG1855.webp'),
    text: '夕阳很美，但我想看的是陪我看夕阳的你。',
    category: '西溪诗意',
    emoji: '🌇',
  },
  {
    id: 'xixishidi-7',
    image: assetUrl('/images/daily/xixishidi/WechatIMG1856.webp'),
    text: '时光很慢，慢到一生只够爱一个人。',
    category: '西溪诗意',
    emoji: '⏰',
  },
  {
    id: 'xixishidi-8',
    image: assetUrl('/images/daily/xixishidi/WechatIMG1857.webp'),
    text: '这一刻的宁静，值得用一生去回味。',
    category: '西溪诗意',
    emoji: '🍃',
  },
  {
    id: 'xixishidi-9',
    image: assetUrl('/images/daily/xixishidi/WechatIMG1858.webp'),
    text: '所谓伊人，在水一方；所谓幸福，在你身旁。',
    category: '西溪诗意',
    emoji: '🏞️',
  },

  // === 异地视频 (video) ===
  {
    id: 'video-1',
    image: assetUrl('/images/daily/video/WechatIMG1870.webp'),
    text: '隔着屏幕的晚安，是每夜最温柔的星光。',
    category: '异地思念',
    emoji: '📱',
  },
  {
    id: 'video-2',
    image: assetUrl('/images/daily/video/WechatIMG1871.webp'),
    text: '所爱隔山海，山海皆可平。',
    category: '异地思念',
    emoji: '💕',
  },
  {
    id: 'video-3',
    image: assetUrl('/images/daily/video/WechatIMG1873.webp'),
    text: '每一次视频，都让思念更加汹涌，也更加坚定。',
    category: '异地思念',
    emoji: '🥰',
  },

  // === 簋街火锅 (guijie) ===
  {
    id: 'guijie-1',
    image: assetUrl('/images/daily/guijie/WechatIMG1901.webp'),
    text: '簋街的烟火气里，藏着我们最真实的幸福。',
    category: '簋街记忆',
    emoji: '🍲',
  },

  // === 生日 (birthday) ===
  {
    id: 'birthday-1',
    image: assetUrl('/images/daily/birthday/WechatIMG1802.webp'),
    text: '生日快乐，愿你眼里长着太阳，笑里全是坦荡。',
    category: '生日祝福',
    emoji: '🎂',
  },
  {
    id: 'birthday-2',
    image: assetUrl('/images/daily/birthday/WechatIMG1803.webp'),
    text: '吹灭蜡烛，许个愿：往后余生，都有我。',
    category: '生日祝福',
    emoji: '🕯️',
  },
  {
    id: 'birthday-3',
    image: assetUrl('/images/daily/birthday/WechatIMG1804.webp'),
    text: '最好的礼物不是昂贵的物品，而是你开心的笑脸。',
    category: '生日祝福',
    emoji: '🎁',
  },
  {
    id: 'birthday-4',
    image: assetUrl('/images/daily/birthday/WechatIMG1805.webp'),
    text: '你笑起来的样子，治愈了我所有的疲惫。',
    category: '生日祝福',
    emoji: '🌺',
  },
  {
    id: 'birthday-5',
    image: assetUrl('/images/daily/birthday/WechatIMG1806.webp'),
    text: '一年又一年，谢谢你还在我身边。',
    category: '生日祝福',
    emoji: '🎈',
  },
  {
    id: 'birthday-6',
    image: assetUrl('/images/daily/birthday/WechatIMG1843.webp'),
    text: '长大一岁，快乐加倍，爱你的心也加倍。',
    category: '生日祝福',
    emoji: '🎊',
  },
  {
    id: 'birthday-7',
    image: assetUrl('/images/daily/birthday/WechatIMG1844.webp'),
    text: '谢谢你诞生在这个世界上，让我遇见了光。',
    category: '生日祝福',
    emoji: '💫',
  },
  {
    id: 'birthday-8',
    image: assetUrl('/images/daily/birthday/WechatIMG1845.webp'),
    text: '生活很苦，但有你的生日蛋糕很甜。',
    category: '生日祝福',
    emoji: '🍰',
  },
  {
    id: 'birthday-9',
    image: assetUrl('/images/daily/birthday/WechatIMG1846.webp'),
    text: '愿所有的美好都如约而至，比如今天的你。',
    category: '生日祝福',
    emoji: '✨',
  },
  {
    id: 'birthday-10',
    image: assetUrl('/images/daily/birthday/WechatIMG1847.webp'),
    text: '庆祝的不是生日，而是有你的每一天。',
    category: '生日祝福',
    emoji: '🥳',
  },
  {
    id: 'birthday-11',
    image: assetUrl('/images/daily/birthday/WechatIMG1848.webp'),
    text: '亲爱的，生日快乐，不止生日，更要快乐。',
    category: '生日祝福',
    emoji: '🎉',
  },

  // === 美食 (food) ===
  {
    id: 'food-1',
    image: assetUrl('/images/daily/food/WechatIMG1797.webp'),
    text: '唯有美食与爱，不可辜负，而你两者皆占。',
    category: '美食时光',
    emoji: '🍜',
  },
  {
    id: 'food-2',
    image: assetUrl('/images/daily/food/WechatIMG1860.webp'),
    text: '爱就是在一起，吃好多好多顿饭。',
    category: '美食时光',
    emoji: '🍱',
  },
  {
    id: 'food-3',
    image: assetUrl('/images/daily/food/WechatIMG1861.webp'),
    text: '你剥的虾最鲜，你喂的水最甜。',
    category: '美食时光',
    emoji: '🥢',
  },
  {
    id: 'food-4',
    image: assetUrl('/images/daily/food/WechatIMG1862.webp'),
    text: '一日三餐，四季有你，这就是向往的生活。',
    category: '美食时光',
    emoji: '🍚',
  },
  {
    id: 'food-5',
    image: assetUrl('/images/daily/food/WechatIMG1866.webp'),
    text: '餐桌上的热气，是我们爱情升温的证据。',
    category: '美食时光',
    emoji: '❤️',
  },

  // === 高空餐厅 (restaurant) ===
  {
    id: 'restaurant-1',
    image: assetUrl('/images/daily/restaurant/WechatIMG1834.webp'),
    text: '俯瞰万家灯火，心里想的只有给你一个家。',
    category: '浪漫晚餐',
    emoji: '🌃',
  },
  {
    id: 'restaurant-2',
    image: assetUrl('/images/daily/restaurant/WechatIMG1835.webp'),
    text: '夜色撩人，而你撩动了我的心。',
    category: '浪漫晚餐',
    emoji: '🍷',
  },

  // === 执子之手 (hands) ===
  {
    id: 'hands-1',
    image: assetUrl('/images/daily/hands/WechatIMG1782.webp'),
    text: '紧握你的手，就像握住了整个世界。',
    category: '执子之手',
    emoji: '🤝',
  },
  {
    id: 'hands-2',
    image: assetUrl('/images/daily/hands/WechatIMG1793.webp'),
    text: '这条路很长，幸好有你的手牵着我。',
    category: '执子之手',
    emoji: '💑',
  },
  {
    id: 'hands-3',
    image: assetUrl('/images/daily/hands/WechatIMG1799.webp'),
    text: '十指相扣，将两颗心连在一起。',
    category: '执子之手',
    emoji: '🫶',
  },
  {
    id: 'hands-4',
    image: assetUrl('/images/daily/hands/WechatIMG1801.webp'),
    text: '死生契阔，与子成说；执子之手，与子偕老。',
    category: '执子之手',
    emoji: '💍',
  },
  {
    id: 'hands-5',
    image: assetUrl('/images/daily/hands/WechatIMG1849.webp'),
    text: '只要手牵着手，就没有什么能将我们分开。',
    category: '执子之手',
    emoji: '💪',
  },
  {
    id: 'hands-6',
    image: assetUrl('/images/daily/hands/WechatIMG1874.webp'),
    text: '从青春年少到白发苍苍，这双手我不放。',
    category: '执子之手',
    emoji: '💞',
  },
  {
    id: 'hands-7',
    image: assetUrl('/images/daily/hands/WechatIMG1875.webp'),
    text: '这不仅仅是牵手，更是交付一生的承诺。',
    category: '执子之手',
    emoji: '💝',
  },

  // === 游戏 (games) ===
  {
    id: 'games-1',
    image: assetUrl('/images/daily/games/WechatIMG1859.webp'),
    text: '生活是场游戏，而你是我的最佳队友。',
    category: '欢乐时光',
    emoji: '🎮',
  },

  // === 苏州 (suzhou) ===
  {
    id: 'suzhou-1',
    image: assetUrl('/images/daily/suzhou/WechatIMG1876.webp'),
    text: '苏州烟雨朦胧，我们的爱细水长流。',
    category: '江南水乡',
    emoji: '🌉',
  },
];

// 获取随机记忆卡片
export const getRandomMemory = (): MemoryCard => {
  const randomIndex = Math.floor(Math.random() * memoryCards.length);
  return memoryCards[randomIndex];
};

// 获取指定数量的不重复随机记忆
export const getRandomMemories = (count: number): MemoryCard[] => {
  const shuffled = [...memoryCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, memoryCards.length));
};
