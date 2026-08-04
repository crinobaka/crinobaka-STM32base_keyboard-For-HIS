// test/printer.js

function printTitle(title) {

    console.log(`\n========== ${title} ==========`);

}

function print(title, data) {

    printTitle(title);

    console.log(data);

}

//==================================================
// Token / Node / Segment打印
//==================================================

function printList(title, list) {

    printTitle(title);

    list.forEach((item, index) => {

        console.log(`[${index}]`);

        Object.entries(item).forEach(([key, value]) => {

            console.log(`${key} :`, value);

        });

        console.log("");

    });

}

//==================================================
// Summary
//==================================================

function printSummary(summary) {

    printTitle("Summary");

    console.table(summary);

}

window.print = print;
window.printList = printList;
window.printSummary = printSummary;