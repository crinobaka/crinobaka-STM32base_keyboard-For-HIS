// processor/translator.js
class Translator {

    constructor(config, commandManager) {

        this.config = config;

        this.commandManager = commandManager;

        this.dictionary = window.DictionaryData;

    }

    // ============================================================
    // 翻译语法节点
    // ============================================================
    translate(nodes) {

        const result = [];

        for (const node of nodes) {

            switch (node.type) {

                case "command":

                    result.push({
                        type: "command", 
                        raw: node.value,
                        text: this.translateCommand(node)
                    });

                    break;

                case "template":

                    result.push({
                        type: "template",
                        raw: node.value,
                        text: this.translateTemplate(node)
                    });

                    break;

                case "han":
                    result.push({
                        type: "han",
                        raw: node.value,
                        text: this.translateChinese(node)
                    });

                    break;

                case "english":
                    result.push({
                        type: "english",
                        raw: node.value,
                        text: this.translateText(node)
                    });

                    break;

                case "number":
                    result.push({
                        type: "number",
                        raw: node.value,
                        text: this.translateText(node)
                    });

                    break;

                case "punct":
                    result.push({
                        type: "punct",
                        raw: node.value,
                        text: this.translateText(node)
                    });

                    break;

                case "space":

                    result.push({
                        type: "space",
                        raw: node.value,
                        text: this.translateText(node)
                    });

                    break;

                default:

                    result.push({
                        type: "default",
                        raw: node.value,
                        text: node.value
                    });

                    break;

            }

        }

        return result;

    }

    // ============================================================
    // 普通文本
    // ============================================================
    translateText(node) {

        return node.value;

    }

    // ============================================================
    // 中文翻译暂时按长度切分
    // ============================================================
    translateChinese(node) {

        const maxLength = this.config.translator?.maxHanLength?? 15;

        // 第一阶段：规则拆分
        let words = this.splitChinese(node.value);

        words = this.splitMedicalWords(words);

        const result = [];

        // 第二阶段：检查每一项
        for (const word of words) {

            if (word.length <= maxLength) {

                result.push(word);

                continue;

            }
        
        // 兜底硬切

        result.push(...this.sliceChinese(word, maxLength));
        
        }

        return result;

    }

    // ============================================================
    // 系统命令
    // ============================================================
    translateCommand(node) {

        return this.commandManager.formatCommand(node.key);

    }

    // ============================================================
    // 模板
    // ============================================================
    translateTemplate(node) {

        return this.commandManager.getTemplateValue(node.key);

    }

    // ============================================================
    // 中文规则拆分
    // ============================================================
    splitChinese(text) {

        const splitWords =
            this.dictionary.split;

        const prefixWords =
            this.dictionary.prefix;

        const result = [];

        let buffer = "";

        let i = 0;

        while (i < text.length) {

            let matched = "";

            let type = "";

            // 优先匹配 splitWords
            for (const word of splitWords) {

                if (
                    text.startsWith(word, i) &&
                    word.length > matched.length
                ) {

                    matched = word;
                    type = "split";

                }

            }

            // 再匹配 prefixWords
            for (const word of prefixWords) {

                if (
                    text.startsWith(word, i) &&
                    word.length > matched.length
                ) {

                    matched = word;
                    type = "prefix";

                }

            }

            if (!matched) {

                buffer += text[i];

                i++;

                continue;

            }

            //----------------------------------------
            // 普通分割词
            //----------------------------------------
            if (type === "split") {

                if (buffer.length) {

                    result.push(buffer);

                }

                result.push(matched);

                buffer = "";

                i += matched.length;

                continue;

            }

            //----------------------------------------
            // 前缀词
            //----------------------------------------
            if (type === "prefix") {

                if (buffer.length) {

                    result.push(buffer);

                }

                buffer = matched;

                i += matched.length;

                continue;

            }

        }

        if (buffer.length) {

            result.push(buffer);

        }

        return result;

    }

    // ============================================================
    // 医学词拆分
    // ============================================================
    splitMedicalWords(words) {

        const medicalWords =
            this.dictionary.medical;

        const result = [];

        for (const word of words) {

            // 已经够短，不处理
            if (word.length <= 1) {

                result.push(word);

                continue;

            }

            result.push(
                ...this.splitByDictionary(
                    word,
                    medicalWords
                )
            );

        }

        return result;

    }

    // ============================================================
    // 根据词典拆分
    // ============================================================
    splitByDictionary(text, dictionary) {

        if (!dictionary.length) {

            return [text];

        }

        const result = [];

        let buffer = "";

        let i = 0;

        while (i < text.length) {

            let matched = "";

            for (const word of dictionary) {

                if (
                    text.startsWith(word, i) &&
                    word.length > matched.length
                ) {

                    matched = word;

                }

            }

            if (!matched) {

                buffer += text[i];

                i++;

                continue;

            }

            if (buffer.length) {

                result.push(buffer);

                buffer = "";

            }

            result.push(matched);

            i += matched.length;

        }

        if (buffer.length) {

            result.push(buffer);

        }

        return result;

    }

    // ============================================================
    // 中文硬切（最终兜底）
    // ============================================================
    sliceChinese(text, maxLength) {

        const result = [];

        for (
            let i = 0; 
            i < text.length; 
            i += maxLength
        ) {
            result.push(
                text.slice(i, i + maxLength)
            );
        }

        return result;

    }

}