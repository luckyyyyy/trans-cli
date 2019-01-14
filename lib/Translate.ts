/**
 * This file is part of the Translate.
 * @author William Chan <root@williamchan.me>
 */
const isChinese = require('is-chinese');
const request = require('request');
const chalk = require('chalk');

/**
 * 翻译抽象类
 */
export default abstract class Translate {

  public word: string;
  // public example: string;
  public raw: string = '';
  public abstract readonly api: string;
  private _error: Error = new Error();

  /**
   * 构造函数
   * @param word
   */
  constructor(word: string) {
    this.word = word;
  }

  /**
   * 朗读内容
   */
  public say(): void {
    try {
      require('say').speak(this.word, isChinese(this.word) ? 'Ting-Ting' : null);
    } catch (e) {

    }
  }

  /**
   * 请求内容
   */
  public request(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const word = encodeURIComponent(this.word);
      request.get(this.api.replace('${word}', word), (error, response, body: string) => {
        if (!error && response.statusCode == 200) {
          this.raw = body;
          resolve(true);
        } else {
          this._error = error;
          reject(false);
        };
      });
    });
  };

  /**
   * 输出最近一次错误
   * @return {string}
   */
  public getError(): string {
    if (this._error) {
      return this._error.message;
    }
    return '';
  }

  /**
   * 输出日志
   * @param message
   * @param indentNum
   */
  protected log(message: string = '', indentNum: number = 1): void {
    let indent = '';
    for (let i = 1; i < indentNum; i += 1) {
      indent += '  ';
    }
    console.log(indent, message || '');
  }

  /**
   * 高亮文本
   * @param string
   * @param key
   * @param defaultColor
   */
  protected highlight(string: string, key: string, defaultColor: string = 'gray') {
    string = string.replace(new RegExp('(.*)(' + key + ')(.*)', 'gi'), '$1$2' + chalk[defaultColor]('$3'));
    return string.replace(new RegExp('(.*?)(' + key + ')', 'gi'), chalk[defaultColor]('$1') + chalk.yellow('$2'));
  }

  /**
   * 输出内容
   */
  abstract render(): void;



}





