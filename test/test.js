// test/test.js

function printTitle(title) {

    console.log(`\n========== ${title} ==========`);

}

function print(title, data) {

    printTitle(title);

    console.log(data);

}

//------------------------------------------------------------
// 打印 Summary
//------------------------------------------------------------
function printSummary({

    input,
    tokens,
    nodes,
    translated,
    processed,
    encoded,
    processor

}) {

    printTitle("Summary");

    console.table({

        inputLength: input.length,

        tokenCount: tokens.length,

        nodeCount: nodes.length,

        translatedCount: translated.length,

        processedCount: processed.length,

        packetLength: encoded.length,

        defaultMode: CONFIG.ime.defaultMode,

        finalMode: processor.currentMode

    });

}

//------------------------------------------------------------
// 简单断言
//------------------------------------------------------------
function runAssertions(encoded, processor) {

    printTitle("Assertions");

    let pass = true;

    // 报文不能为空
    if (!encoded.length) {

        console.error("❌ Packet Empty");

        pass = false;

    }

    // Processor必须恢复默认状态
    if (processor.currentMode !== CONFIG.ime.defaultMode) {

        console.error("❌ Final Mode Error");

        pass = false;

    }

    // 连续IME切换
    if (encoded.includes("<SWITCH_IME><SWITCH_IME>")) {

        console.error("❌ Duplicate IME Switch");

        pass = false;

    }

    if (pass) {

        console.log("✅ PASS");

    }

}

//============================================================
// 运行所有测试
//============================================================
function runAllTests() {

    console.clear();

    console.log("====================================");
    console.log("Running All Test Cases");
    console.log("====================================");

    TEST_CASES.forEach((testCase, index) => {

        console.group(

            `[${index + 1}] ${testCase.name}`

        );

        runTest(testCase.input);
        console.groupEnd();

    });

}

//============================================================
// 根据名字运行测试
//============================================================
function runCase(name) {

    const testCase = TEST_CASES.find(

        item => item.name === name

    );

    if (!testCase) {

        console.error(`Case Not Found : ${name}`);

        return;

    }

    runTest(testCase.input);

}

window.runAllTests = runAllTests;
window.runCase = runCase;

//------------------------------------------------------------
// 主测试
//------------------------------------------------------------
function runTest(text) {

    console.clear();

    console.log("====================================");

    console.log(`Input : ${text}`);

    console.log("====================================");

    const commandManager = new CommandManager(CONFIG);

    const lexer = new Lexer(CONFIG);

    const parser = new Parser(CONFIG, commandManager);

    const translator = new Translator(CONFIG, commandManager);

    const processor = new TextProcessor(CONFIG, commandManager);

    const encoder = new Encoder(CONFIG);

    //---------------------------------
    // Lexer
    //---------------------------------

    const tokens = lexer.tokenize(text);

    printList("Lexer", tokens);

    //---------------------------------
    // Parser
    //---------------------------------

    const nodes = parser.parse(tokens);

    printList("Parser", nodes);

    //---------------------------------
    // Translator
    //---------------------------------

    const translated = translator.translate(nodes);

    printList("Translator", translated);

    //---------------------------------
    // Processor
    //---------------------------------

    const processed = processor.processSegments(translated);

    printList("Processor", processed);

    //---------------------------------
    // Encoder
    //---------------------------------

    const encoded = encoder.encode(processed);

    print("Encoder", encoded);

    //---------------------------------
    // STM32 Packet
    //---------------------------------

    print("STM32 Packet", encoded);

    
    //---------------------------------
    // Summary
    //---------------------------------

    printSummary({

        inputLength: text.length,

        tokensCount: tokens.length,

        nodesCount: nodes.length,

        translatedCount: translated.length,

        processedCount: processed.length,

        packetLength: encoded.length,

        defaultMode: CONFIG.ime.defaultMode,
        
        finalMode: processor.currentMode

    });

    //---------------------------------
    // Assertions
    //---------------------------------

    runAssertions(encoded, processor);


    window.runTest = runTest;

}