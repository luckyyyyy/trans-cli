/**
 * This file is part of the Translate.
 * @author William Chan <root@williamchan.me>
 */
import Youdao from './Youdao';

const ora = require('ora');
const chalk = require('chalk');
const isChinese = require('is-chinese');

/**
 * 入口函数
 * @param argc
 * @param argv
 * @param args
 */
async function main(argc: number, argv: string[], args: object): Promise<void> {
  const word: string = argv.join(' ');
  const spinner = ora().start();
  try {
    require('say').speak(word, isChinese(word) ? 'Ting-Ting' : null);
  } catch (e) {

  }

  const translate = new Youdao(word);
  try {
    await translate.request();
    translate.render();
    spinner.stop();
  } catch (e) {
    console.error(chalk.red('Error: ') + translate.getError());
  }
  process.exit();
}

export default main;
