// test/cases.js

const TEST_CASES = [

    {
        name: "中文",
        input: "你好世界"
    },

    {
        name: "英文",
        input: "Hello World"
    },

    {
        name: "中英混输",
        input: "你好abc世界"
    },

    {
        name: "数字",
        input: "abc123你好"
    },

    {
        name: "中文全角",
        input: "【】（）"
    },

    {
        name: "英文半角",
        input: "[]()"
    },

    {
        name: "连续切换",
        input: "【】,x]（）"
    },

    {
        name: "真实场景",
        input: "n你家门前，来种树【】好吧~_~majsk"
    },

    {
        name: "命令",
        input: "/ime"
    },

    {
        name: "模板",
        input: "/br"
    },

    //============================================================
    // 医学场景
    //============================================================

    {
        name: "病史采集",
        input: "患者因胸闷3天入院。"
    },

    {
        name: "查房记录",
        input: "BP120/80mmHg，HR80次/分。"
    },

    {
        name: "内分泌",
        input: "HbA1c 8.5%，TSH正常。"
    },

    {
        name: "中英混排",
        input: "FT3 3.52pmol/L，FT4 12.6pmol/L。"
    },

    {
        name: "模板+正文",
        input: "/br患者因发热3天入院。"
    },

    {
        name: "命令+正文",
        input: "/imeHello World"
    },

    {
        name: "真实混输",
        input: "n你家门前，来种树【】好吧~_~majsk"
    },

    {
        name: "全半角切换",
        input: "【】[]（）()"
    },

    {
        name: "数字单位",
        input: "Na+ 140mmol/L，K+ 4.2mmol/L。"
    },

    {
        name: "连续英文",
        input: "OpenAI GPT JavaScript STM32 HID"
    }

];

window.TEST_CASES = TEST_CASES;