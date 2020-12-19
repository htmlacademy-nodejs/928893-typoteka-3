'use strict';

const fs = require(`fs`).promises;
const {DateTime, Duration} = require(`luxon`);
const chalk = require(`chalk`);
const {ExitCode} = require(`../../constants`);
const {getRandomInt, shuffle, getRandomRange} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const MAX_ANNOUNCE_LINES = 5;
const MAX_MONTH_FROM_NOW = 3;
const MS_IN_MONTH = Duration.fromObject({month: 1}).as(`milliseconds`);

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`,
];

const LINES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
];

const getDate = () => {
  const now = Date.now();
  const ms = getRandomInt(now - MAX_MONTH_FROM_NOW * MS_IN_MONTH, now);

  return DateTime.fromMillis(ms);
};

const generatePosts = (count) => Array(count).fill(1).map(() => ({
  title: TITLES[getRandomInt(0, TITLES.length - 1)],
  createdDate: getDate().toFormat(`y-MM-dd hh:mm:ss`),
  announce: getRandomRange(shuffle(LINES), 1, MAX_ANNOUNCE_LINES).join(` `),
  fullText: getRandomRange(shuffle(LINES), MAX_ANNOUNCE_LINES).join(` `),
  category: getRandomRange(shuffle(CATEGORIES)),
}));

module.exports = {
  name: `--generate`,
  async run(args) {
    const [countArg] = args;
    const count = Number.parseInt(countArg, 10) || DEFAULT_COUNT;

    if (count > 1000) {
      console.info(chalk.blue(`Не больше 1000 публикаций`));
      process.exit(ExitCode.success);
    }

    const data = JSON.stringify(generatePosts(count));
    try {
      await fs.writeFile(FILE_NAME, data);
      console.log(chalk.green(`Данные успешно записаны в файл.`));
    } catch (e) {
      console.error(chalk.red(`Не удалось записать данные в файл...`));
      console.error(chalk.red(`Ошибка: ${e.message}`));
      process.exit(ExitCode.error);
    }
  },
};
