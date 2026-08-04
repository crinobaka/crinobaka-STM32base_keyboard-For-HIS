// processor/processor.js
class TextProcessor {

    constructor(config, commandManager) {

        this.config = config;
        this.commandManager = commandManager;
        this.dictionary = window.DictionaryData;

        // 各处理模块 Pipeline
        this.lexer = new Lexer(config);
        this.parser = new Parser(
            config,
            this.commandManager
        );
        this.translator = new Translator(
            config,
            this.commandManager
        );
        this.encoder = new Encoder(config);
        this.resetState();
    }

    // ============================================================
    // 重置Processor入口
    //
    // 每次处理文本都会恢复默认状态
    // 后续自动IME切换将在这里初始化
    // ============================================================

    resetState() {
        this.currentMode = this.config.ime.defaultMode;
    }
    // ============================================================
    // 文本处理入口
    //
    // String
    //   ↓
    // Lexer
    //   ↓
    // Parser
    //   ↓
    // Translator
    //   ↓
    // Encoder
    //   ↓
    // String
    // ============================================================
    process(text) {
        this.resetState();
        // 1. 词法分析
        const tokens = this.lexer.tokenize(text);

        // 2. 语法解析
        const nodes = this.parser.parse(tokens);

        // 3. 翻译
        const translated = this.translator.translate(nodes);

        // processor (二期拓展)
        const processed = this.processSegments(translated);
        // 恢复默认状态(二期拓展)
        this.restoreState(processed);

        // 4. 编码
        return this.encoder.encode(processed);

    }

    // ============================================================
    //
    // Commit 1: 不改变Translator输出
    // Commit 2: 自动切换IME
    // Commit 3: 中文自动断句
    //
    // ============================================================
    processSegments(segments) {
        this.resetState();
        const output = [];
        for (let segment of segments) {
            // 中文
            if (segment.type === "han") {
                const targetMode = this.getTargetMode(segment);
                this.switchMode(targetMode, output);
                segment = this.convertPinyin(segment);
                output.push(segment);
                continue;
            }
            // 标点处理
            if (segment.type === "punct") {
                this.processPunction(segment,output);
                continue;
            }
            // 其他
            const targetMode = this.getTargetMode(segment);
            this.switchMode(targetMode, output);
            output.push(segment);
        }
        // 恢复默认输入法
        this.resetState(output);
        return output
    }

    // ============================================================
    // 输入法切换 -> Commit 2 实现
    // ============================================================
    switchMode(targetMode, output) {
        if (!targetMode) {
            return;
        }
        
        if (targetMode === this.currentMode) {
            return;
        }

        output.push({
            type: "command",
            raw: "",
            text: this.commandManager.formatCommand("ime")
        });

        output.push({
            type: "command",
            raw: "",
            text: "<DELAY_150>"
        });

        this.currentMode = targetMode;
    }

    // ============================================================
    // 恢复默认状态 -> Commit 3 实现
    // ============================================================
    restoreState(output) {
        if (this.currentMode === this.config.ime.defaultMode) {
            return;
        }

        output.push({
            type: "command",
            raw: "",
            text: this.commandManager.formatCommand("ime")
        });
        
        this.currentMode = this.config.ime.defaultMode;
    }

    // ============================================================
    // 是否中文全角标点
    // ============================================================
    isChinesePunctuation(text) {
        for (const ch of text ) {
            if (
                Object.prototype.hasOwnProperty.call(
                    this.config.ime.punctuationMap, ch
                ) 
            ) {
                return true;
            }
        }

        return false;
    }

    // ============================================================
    // 获取目标输入法模式
    // ============================================================
    getTargetMode(segment) {
        switch (segment.type) {
            case "han":
                return "chinese";
            
            case "english":
            case "number":
                return "english";
            case "punct":
                return this.isChinesePunctuation(segment.raw)
                ? "chinese"
                : "english";
            default:
                return null;
        }
    }

    // processPunctuation [】]问题
    processPunction(segment, output) {
        for (const ch of segment.raw) {
            const subSegment = {
                type: "punct",
                raw: ch,
                text: this.convertPunctuation(ch)
            };
            const targetMode = this.getTargetMode(subSegment);
            this.switchMode(targetMode,output);
            output.push(subSegment);
        }
    }

    // ============================================================
    // 中文转拼音
    // ============================================================
    convertPinyin(segment) {

        return {
            ...segment,
            text: segment.text.map(
                text => this.convertChineseText(text)
            )
        };

    }

    // ============================================================
    // 一段中文转拼音
    // ============================================================
    convertChineseText(text) {

        const medical = this.lookupMedicalPinyin(text);

        if (medical) {
            return medical.replace(/\s+/g, "") + " ";
        }

        return this.convertNormalPinyin(text);
    }

    // ============================================================
    // 查询拼音
    // ============================================================
    lookupMedicalPinyin(text) {

        return this.dictionary.pinyinMedical?.[text]?? null;
    }

    // 紧急修补符号问题
    convertPunctuation(ch) {
        
        return this.config.ime.punctuationMap[ch] ?? ch;

    }

    // ============================================================
    // 普通中文转拼音
    // ============================================================
    convertNormalPinyin(text) {

        return pinyinPro.pinyin(
            text,
            {
                toneType: "none",
                type: "array",
                multiple: false
            }
        ).join("") + " ";
    }
            
}