// config.js
const CONFIG = {
    // 串口配置
    serial: {
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        parity: 'none'
    },
    // 输入法状态
    ime: {
        // 默认输入模式
        defaultMode : "chinese",
        mode: 'chinese', // 'chinese' | 'english'
        punctuation: 'chinese', // 'chinese' | 'english'

        // 标点符号映射 (中文标点 → 英文/ASCII 表示)
        punctuationMap: {
            '，': ',', '。': '.', '；': ';', '：': ':',
            '“': '"', '”': '"', '‘': "'", '’': "'",
            '（': '(', '）': ')', '！': '!', '？': '?',
            '、': '\\', '《': '<', '》': '>',
            '【':'[','】':']'
        }
    },
    // 特殊命令定义 (前端标识 → 发送给STM32的命令字符串)
    commands: {
        prefix:"/",
        ime:{
            title:"切换输入法",
            value:"<SWITCH_IME>",
            appendSpace:false
        },
        punct:{
            title:"切换标点",
            value:"<SWITCH_PUNCT>",
            appendSpace:false
        },
        enter:{
            title:"回车",
            value:"<ENTER>",
            appendSpace:false
        },
        tab:{
            title:"Tab",
            value:"<TAB>",
            appendSpace:false
        }
    },
    // 快捷模板定义
    templates: {
        br:{
            title:"主诉",
            value:"主诉：患者因入院",
            cursorOffset:-2
        },
        jc:{
            title:"体检",
            value:"体格检查...",
            cursorOffset:0
        }
        // 你可以在这里继续添加更多医学模板
    },
    // UI配置
    ui:{
        autoClear:false,
        autoFocus:true,
        sendDelay:3000,

        statusDuration:2500
    },
    translator: {
        // 连续中文最大长度
        maxHanLength: 15,
        // 中文拆分规则 ==> 移动到 \processor\dictionary\.
       
    }
    
};