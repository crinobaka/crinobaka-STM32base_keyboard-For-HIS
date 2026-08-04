// processor/parser.js
class Parser {

    constructor(config, commandManager) {

        this.config = config;

        this.commandManager = commandManager;

    }

    // ============================================================
    // Token解析
    // ============================================================
    parse(tokens) {

        const result = [];

        let index = 0;

        while (index < tokens.length) {

            const token = tokens[index];

            // 尝试解析命令
            const command = this.parseCommand(tokens, index);

            if (command) {

                result.push(command.node);

                index = command.next;

                continue;

            }

            // 普通文本
            result.push(this.parseText(token));

            index++;

        }

        return result;

    }

    // ============================================================
    // 解析普通文本
    // ============================================================
    parseText(token) {

        return {

            type: token.type,

            value: token.value

        };

    }

    // ============================================================
    // 解析命令
    // ============================================================
    parseCommand(tokens, index) {

        const token = tokens[index];

        // /
        if (
            token.type !== "punct" ||
            token.value !== this.commandManager.getCommandPrefix()
        ) {

            return null;

        }

        const next = tokens[index + 1];

        if (!next) {

            return null;

        }

        if (next.type !== "english") {

            return null;

        }

        const key = next.value.toLowerCase();

        // 系统命令
        if (this.commandManager.hasCommand(key)) {

            return {

                node: {

                    type: "command",

                    key

                },

                next: index + 2

            };

        }

        // 模板
        if (this.commandManager.hasTemplate(key)) {

            return {

                node: {

                    type: "template",

                    key

                },

                next: index + 2

            };

        }

        return null;

    }

}