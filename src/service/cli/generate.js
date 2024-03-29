'use strict';

const fs = require(`fs`).promises;
const {DateTime, Duration} = require(`luxon`);
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const {ExitCode} = require(`../../constants`);
const {getRandomInt, shuffle, getRandomRange} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const MAX_ANNOUNCE_LINES = 5;
const MAX_COMMENTS = 2;
const MAX_MONTH_FROM_NOW = 3;
const MS_IN_MONTH = Duration.fromObject({month: 1}).as(`milliseconds`);
const SENTENCES_PATH = `./data/sentences.txt`;
const TITLES_PATH = `./data/titles.txt`;
const CATEGORIES_PATH = `./data/categories.txt`;
const COMMENTS_PATH = `./data/comments.txt`;
const MAX_ID_LENGTH = 6;

const getDate = () => {
  const now = Date.now();
  const ms = getRandomInt(now - MAX_MONTH_FROM_NOW * MS_IN_MONTH, now);

  return DateTime.fromMillis(ms);
};

const readContent = async (path) => {
  try {
    const content = await fs.readFile(path, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (count, comments) => {
  return Array(count)
    .fill(1)
    .map(() => ({
      id: nanoid(MAX_ID_LENGTH),
      text: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `),
    }));
};

const generatePosts = ({count, titles, categories, sentences, comments}) =>
  Array(count)
    .fill(1)
    .map(() => ({
      id: nanoid(MAX_ID_LENGTH),
      title: titles[getRandomInt(0, titles.length - 1)],
      createdDate: getDate().toFormat(`y-MM-dd hh:mm:ss`),
      announce: getRandomRange(shuffle(sentences), 1, MAX_ANNOUNCE_LINES).join(` `),
      fullText: getRandomRange(shuffle(sentences), MAX_ANNOUNCE_LINES).join(` `),
      category: getRandomRange(shuffle(categories)),
      comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
    }));

module.exports = {
  name: `--generate`,
  async run(args) {
    const [countArg] = args;
    const count = Number.parseInt(countArg, 10) || DEFAULT_COUNT;

    if (count > 1000) {
      console.info(chalk.blue(`Не больше 1000 публикаций`));
      return;
    }
    const titles = await readContent(TITLES_PATH);
    const categories = await readContent(CATEGORIES_PATH);
    const sentences = await readContent(SENTENCES_PATH);
    const comments = await readContent(COMMENTS_PATH);
    const data = JSON.stringify(generatePosts({count, titles, categories, sentences, comments}));
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
