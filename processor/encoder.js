// processor/encoder.js
class Encoder {

    constructor(config) {

        this.config = config;

    }

    // ============================================================
    // 编码入口
    //
    // 输入：
    //[
    //     {
    //         type:"han",
    //         raw:"你好",
    //         text:["你好"]
    //     },
    //     {
    //         type:"english",
    //         raw:"ABC",
    //         text:[
    //             "<SWITCH_IME>",
    //             "ABC",
    //             "<SWITCH_IME>"
    //         ]
    //     }
    // ]
    //
    // 输出：
    // "你好<SWITCH_IME>ABC"
    // ============================================================
    encode(data) {

        if (!Array.isArray(data)) {

            return "";

        }

        const result = [];

        for (const item of data) {

            result.push(this.encodeItem(item));

        }

        return result.join("");

    }

    // ============================================================
    // 编码单个元素
    // ============================================================
    encodeItem(item) {

        if (item === null || item === undefined) {

            return "";

        }
        
        // 普通字符串
        if (typeof item === "string") {

            return item;

        }

        // 二期Segment
        if (typeof item === "object") {

            const text = item.text;

            if (Array.isArray(text)) {

                return text.join("");

            }

            return String(text);

        }

        return String(item);

    }

    // ============================================================
    // 判断是否为空
    // ============================================================
    isEmpty(item) {

        return item === null ||
               item === undefined ||
               item === "";

    }

}