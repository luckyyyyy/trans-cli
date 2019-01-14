/**
 * This file is part of the Translate.
 * @author William Chan <root@williamchan.me>
 */
import Translate from './Translate';
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const chalk = require('chalk');

/**
 * 有道翻译类
 */
export default class Youdao extends Translate {
  public readonly api = 'http://fanyi.youdao.com/openapi.do?keyfrom=node-fanyi&key=110811608&type=data&doctype=json&version=1.1&q=${word}';

  /**
   * @inheritdoc
   */
  public render() {
    const data = JSON.parse(entities.decode(this.raw));

    let firstLine = '';

    // word
    firstLine += data.query;

    // phonetic symbol
    if (data.basic && data.basic.phonetic) {
      firstLine += chalk.magenta('  [ ' + data.basic.phonetic + ' ]');
    }

    this.log(firstLine + chalk.gray('  ~  fanyi.youdao.com'));

    if (data.translation) {
      this.log();
      this.log(chalk.gray('- ') + chalk.yellow(data.translation.join('')));
    }

    // pos & acceptation
    if (data.basic && data.basic.explains) {
      this.log();
      data.basic.explains.forEach((item) => {
        this.log(chalk.gray('- ') + chalk.green(item));
      });
    }

    // sentence
    if (data.web && data.web.length) {
      this.log();
      data.web.forEach((item, i) => {
        this.log(chalk.gray(i + 1 + '. ') + this.highlight(item.key, data.query));
        this.log('   ' + chalk.cyan(item.value.join(',')));
      });
    }

    this.log();
    this.log(chalk.gray(' -------- '))
    this.log();
  }
}
