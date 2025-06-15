const texts = [
  {
    title: 'Piru piru',
    ai: 'Piru piru ai 1',
    human: 'Piru piru human 1',
    author: 'Maria'
  },
  {
    title: 'I pianeti',
    ai: 'Piru piru ai 2',
    human: 'Piru piru human 2',
    author: 'Giggino'
  },
  {
    title: 'I gelati',
    ai: 'Piru piru ai 3',
    human: 'Piru piru human 3',
    author: 'Piero'
  },
  {
    title: 'La cacca',
    ai: 'Piru piru ai 4',
    human: 'Piru piru human 4',
    author: 'Pino'
  },
  {
    title: 'La fida',
    ai: 'Piru piru ai 5',
    human: 'Piru piru human 5',
    author: 'Mario'
  },
]

export const textsA: Text[] = [
  {text: texts[0].ai, type: 'ai', labeled: true, id: '1', title: texts[0].title, author: texts[0].author},
  {text: texts[1].human, type: 'human', labeled: true, id: '2', title: texts[1].title, author: texts[1].author},
  {text: texts[2].ai, type: 'ai', labeled: false, id: '3', title: texts[2].title, author: texts[2].author},
  {text: texts[3].human, type: 'human', labeled: false, id: '4', title: texts[3].title, author: texts[3].author},
];

export const textsB: Text[] = [
  {text: texts[0].human, type: 'human', labeled: true, id: '1', title: texts[0].title, author: texts[0].author},
  {text: texts[1].ai, type: 'ai', labeled: true, id: '2', title: texts[1].title, author: texts[1].author},
  {text: texts[2].human, type: 'human', labeled: false, id: '3', title: texts[2].title, author: texts[2].author},
  {text: texts[3].ai, type: 'ai', labeled: false, id: '4', title: texts[3].title, author: texts[3].author},
];

export const textsC: Text[] = [
  {text: texts[0].ai, type: 'ai', labeled: false, id: '1', title: texts[0].title, author: texts[0].author},
  {text: texts[1].human, type: 'human', labeled: false, id: '2', title: texts[1].title, author: texts[1].author},
  {text: texts[2].ai, type: 'ai', labeled: true, id: '3', title: texts[2].title, author: texts[2].author},
  {text: texts[3].human, type: 'human', labeled: true, id: '4', title: texts[3].title, author: texts[3].author},
];

export const textsD: Text[] = [
  {text: texts[0].human, type: 'human', labeled: false, id: '1', title: texts[0].title, author: texts[0].author},
  {text: texts[1].ai, type: 'ai', labeled: false, id: '2', title: texts[1].title, author: texts[1].author},
  {text: texts[2].human, type: 'human', labeled: true, id: '3', title: texts[2].title, author: texts[2].author},
  {text: texts[3].ai, type: 'ai', labeled: true, id: '4', title: texts[3].title, author: texts[3].author},
];


export const textPerGroup: {
  [key: string]: Text[]
} = {
  A: textsA,
  B: textsB,
  C: textsC,
  D: textsD,
};

export type Text = {
  text?: string;
  title?: string;
  type: 'ai' | 'human';
  author: string;
  labeled: boolean;
  id: string;
};
