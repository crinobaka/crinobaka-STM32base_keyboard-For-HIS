// processor/lexer.js
class Lexer {

    constructor(config) {

        this.config = config;

        this.reset();

    }

    // ============================================================
    // 重置Lexer状态
    // ============================================================
    reset() {

        this.tokens = [];

        this.buffer = "";

        this.state = null;

        this.start = 0;

        this.end = 0;

    }

    // ============================================================
    // 文本词法分析
    //
    // 输入：
    // String
    //
    // 输出：
    // [
    //     {
    //         index,
    //         type,
    //         value,
    //         start,
    //         end
    //     }
    // ]
    // ============================================================
    tokenize(text) {

        this.reset();

        let position = 0;

        for (const ch of text) {

            const type = this.getCharType(ch);

            // 第一个字符
            if (this.state === null) {

                this.state = type;

                this.buffer = ch;

                this.start = position;

                this.end = position;

                position++;

                continue;

            }

            // 同类型字符
            if (type === this.state) {

                this.buffer += ch;

                this.end = position;

                position++;

                continue;

            }

            // 类型发生变化
            this.flush();

            this.state = type;

            this.buffer = ch;

            this.start = position;

            this.end = position;

            position++;

        }

        // 输出最后一个Token
        this.flush();

        return this.tokens;

    }

    // ============================================================
    // 输出当前Token
    // ============================================================
    flush() {

        if (!this.buffer.length) {

            return;

        }

        this.tokens.push({

            index: this.tokens.length,

            type: this.state,

            value: this.buffer,

            start: this.start,

            end: this.end

        });

        this.buffer = "";

        this.state = null;

    }
    
    // ============================================================
    // 获取字符类型
    // ============================================================
    getCharType(ch) {

        if (this.isChinese(ch)) {

            return "han";

        }

        if (this.isEnglish(ch)) {

            return "english";

        }

        if (this.isNumber(ch)) {

            return "number";

        }

        if (this.isWhitespace(ch)) {

            return "space";

        }

        if (this.isPunctuation(ch)) {

            return "punct";

        }

        return "unknown";

    }

    // ============================================================
    // 是否为中文字符
    // ============================================================
    isChinese(ch) {

        return /[\u3400-\u9FFF]/.test(ch);

    }

    // ============================================================
    // 是否为英文字母
    // ============================================================
    isEnglish(ch) {

        return /[A-Za-z]/.test(ch);

    }

    // ============================================================
    // 是否为数字
    // ============================================================
    isNumber(ch) {

        return /[0-9]/.test(ch);

    }

    // ============================================================
    // 是否为空白字符
    // ============================================================
    isWhitespace(ch) {

        return /\s/.test(ch);

    }

    // ============================================================
    // 是否为标点符号
    // ============================================================
    isPunctuation(ch) {

        // 配置中的中文标点
        if (
            Object.prototype.hasOwnProperty.call(
                this.config.ime.punctuationMap, 
                ch
            )
        ) {

            return true;

        }

        // ASCII 标点
        return /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(ch);

    }

    // ============================================================
    // 是否为未知字符
    // （保留接口，后续可扩展 Emoji、日文等）
    // ============================================================
    isUnknown(ch) {

        return this.getCharType(ch) === "unknown";

    }

}