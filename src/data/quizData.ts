import type { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: '我们的纪念日是哪一天？',
    options: ['2019年6月20日', '2019年7月20日', '2019年8月20日', '2020年7月20日'],
    correctIndex: 1,
    hint: '是在七月的一个特别的日子哦~',
    loveMessage: '那个夏天，是我们故事开始的地方',
  },
  {
    id: 2,
    question: '我们是在哪里相识的？',
    options: ['大学校园', '朋友介绍', '高中校园', '网络'],
    correctIndex: 2,
    hint: '想想我们青涩的学生时代~',
    loveMessage: '从那时起，我就知道你是特别的',
  },
  {
    id: 3,
    question: '我们大学在哪个城市？',
    options: ['上海', '北京', '广州', '深圳'],
    correctIndex: 1,
    hint: '在祖国的首都，我们一起追逐梦想',
    loveMessage: '这座城市见证了我们的成长与爱情',
  },
  {
    id: 4,
    question: '我最喜欢叫你什么？',
    options: ['老婆', '宝贝', '思宝', '亲爱的'],
    correctIndex: 2,
    hint: '这是只属于你的专属称呼~',
    loveMessage: '思宝，你是我心中独一无二的存在',
  },
  {
    id: 5,
    question: '我们在一起多少年了？',
    options: ['4年', '5年', '6年', '7年'],
    correctIndex: 1,
    hint: '从2019年开始计算哦~',
    loveMessage: '五年多的时光，感谢你一直陪伴在我身边',
  },
];

export const proposalText = `亲爱的思宝：

从高中校园的初次相遇
到北京城里的相依相伴
五年多的时光
在你身边，每一天都是诗

你是我青春里最美的风景
是我生命中最动人的篇章
是我想用一生来珍藏的至宝

星河璀璨，不及你眼中的光芒
山盟海誓，不及与你相守的日常

今天
我想问你一个问题
这个问题
我已经在心里问了无数遍`;

export const proposalQuestion = '思宝，你愿意嫁给我吗？';

export const proposalSignature = '—— 永远爱你的罗先生';
