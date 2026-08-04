<<<<<<< HEAD
// test/assertions.js

function runAssertions(packet, processor) {

    let pass = true;

    console.log("\n========== Assertions ==========");

    //--------------------------------------
    // Packet不能为空
    //--------------------------------------

    if (!packet.length) {

        console.error("❌ Packet Empty");

        pass = false;

    }

    //--------------------------------------
    // Processor恢复默认状态
    //--------------------------------------

    if (

        processor.currentMode !==

        CONFIG.ime.defaultMode

    ) {

        console.error("❌ Final Mode Error");

        pass = false;

    }

    //--------------------------------------
    // 连续IME切换
    //--------------------------------------

    if (

        packet.includes("<SWITCH_IME><SWITCH_IME>")

    ) {

        console.error("❌ Duplicate SWITCH_IME");

        pass = false;

    }

    //--------------------------------------

    console.log(

        pass

            ? "✅ PASS"

            : "❌ FAIL"

    );

}

=======
// test/assertions.js

function runAssertions(packet, processor) {

    let pass = true;

    console.log("\n========== Assertions ==========");

    //--------------------------------------
    // Packet不能为空
    //--------------------------------------

    if (!packet.length) {

        console.error("❌ Packet Empty");

        pass = false;

    }

    //--------------------------------------
    // Processor恢复默认状态
    //--------------------------------------

    if (

        processor.currentMode !==

        CONFIG.ime.defaultMode

    ) {

        console.error("❌ Final Mode Error");

        pass = false;

    }

    //--------------------------------------
    // 连续IME切换
    //--------------------------------------

    if (

        packet.includes("<SWITCH_IME><SWITCH_IME>")

    ) {

        console.error("❌ Duplicate SWITCH_IME");

        pass = false;

    }

    //--------------------------------------

    console.log(

        pass

            ? "✅ PASS"

            : "❌ FAIL"

    );

}

>>>>>>> e20817d76230c55abbf7fece21e1aec4b14f4db5
window.runAssertions = runAssertions;