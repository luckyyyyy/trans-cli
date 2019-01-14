'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

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
class Translate {
    /**
     * 构造函数
     * @param word
     */
    constructor(word) {
        this.word = word;
    }
    /**
     * 朗读内容
     */
    say() {
        try {
            require('say').speak(this.word, isChinese(this.word) ? 'Ting-Ting' : null);
        }
        catch (e) {
        }
    }
    /**
     * 请求内容
     */
    request() {
        return new Promise((resolve, reject) => {
            const word = encodeURIComponent(this.word);
            request.get(this.api.replace('${word}', word), (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    this.raw = body;
                    resolve(true);
                }
                else {
                    this._error = error;
                    reject(false);
                }
            });
        });
    }
    ;
    /**
     * 输出最近一次错误
     * @return {string}
     */
    getError() {
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
    log(message = '', indentNum = 1) {
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
    highlight(string, key, defaultColor = 'gray') {
        string = string.replace(new RegExp('(.*)(' + key + ')(.*)', 'gi'), '$1$2' + chalk[defaultColor]('$3'));
        return string.replace(new RegExp('(.*?)(' + key + ')', 'gi'), chalk[defaultColor]('$1') + chalk.yellow('$2'));
    }
}

/**
 * This file is part of the Translate.
 * @author William Chan <root@williamchan.me>
 */
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const chalk$1 = require('chalk');
/**
 * 有道翻译类
 */
class Youdao extends Translate {
    constructor() {
        super(...arguments);
        this.api = 'http://fanyi.youdao.com/openapi.do?keyfrom=node-fanyi&key=110811608&type=data&doctype=json&version=1.1&q=${word}';
    }
    /**
     * @inheritdoc
     */
    render() {
        const data = JSON.parse(entities.decode(this.raw));
        let firstLine = '';
        // word
        firstLine += data.query;
        // phonetic symbol
        if (data.basic && data.basic.phonetic) {
            firstLine += chalk$1.magenta('  [ ' + data.basic.phonetic + ' ]');
        }
        this.log(firstLine + chalk$1.gray('  ~  fanyi.youdao.com'));
        if (data.translation) {
            this.log();
            this.log(chalk$1.gray('- ') + chalk$1.yellow(data.translation.join('')));
        }
        // pos & acceptation
        if (data.basic && data.basic.explains) {
            this.log();
            data.basic.explains.forEach((item) => {
                this.log(chalk$1.gray('- ') + chalk$1.green(item));
            });
        }
        // sentence
        if (data.web && data.web.length) {
            this.log();
            data.web.forEach((item, i) => {
                this.log(chalk$1.gray(i + 1 + '. ') + this.highlight(item.key, data.query));
                this.log('   ' + chalk$1.cyan(item.value.join(',')));
            });
        }
        this.log();
        this.log(chalk$1.gray(' -------- '));
        this.log();
    }
}
//# sourceMappingURL=Youdao.js.map

const ora = require('ora');
const chalk$2 = require('chalk');
const isChinese$1 = require('is-chinese');
/**
 * 入口函数
 * @param argc
 * @param argv
 * @param args
 */
function main(argc, argv, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const word = argv.join(' ');
        const spinner = ora().start();
        try {
            require('say').speak(word, isChinese$1(word) ? 'Ting-Ting' : null);
        }
        catch (e) {
        }
        const translate = new Youdao(word);
        try {
            yield translate.request();
            translate.render();
            spinner.stop();
        }
        catch (e) {
            console.error(chalk$2.red('Error: ') + translate.getError());
        }
        process.exit();
    });
}
//# sourceMappingURL=main.js.map

module.exports = main;
