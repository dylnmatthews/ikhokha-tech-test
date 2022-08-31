"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const CommentAnalyzer_1 = require("./CommentAnalyzer");
const cpus = require('os').cpus().length;
const cluster = require('cluster');
const dir = './docs';
const config = fs.readFileSync('config.json', { encoding: 'utf8', flag: 'r' }).toString();
let shownOutput = false;
let results = JSON.parse(config);
let counter = 0;
/**
 * @function main
 * @description function to be called by each worker, split reading of files and calling of analyzer
 * @returns array with list results
 */
const main = () => {
    const targetFiles = fs.readdirSync(dir).filter((value) => value.endsWith('.txt'));
    //split files to run on different cpu's 
    const clusterFiles = targetFiles.filter((_value, index) => index % cpus === cluster.worker.id - 1);
    let result = [];
    for (let file of clusterFiles) {
        const commentAnalyzer = new CommentAnalyzer_1.CommentAnalyzer(file);
        commentAnalyzer.setConfig(config);
        result.push(commentAnalyzer.analyze());
    }
    return { 'result': result, 'fileLength': targetFiles.length };
};
/**
 * @function calculateResults
 * @param childResults
 * @description function to handle the results from each worker and print result
 */
const calculateResults = (childResults) => {
    {
        if (childResults.result) {
            const fileLength = childResults.result.fileLength;
            // console.log(childResults.result.result)
            for (const child of childResults.result.result) {
                counter++;
                for (const [key, value] of Object.entries(child)) {
                    results[key] += value;
                }
            }
            // for (let result of childResults.result.result) {
            //   counter++;
            //   results['SHORTER_THAN_15'] += result['SHORTER_THAN_15'];
            //   results['MOVER_MENTIONS'] += result['MOVER_MENTIONS'];
            //   results['SHAKER_MENTIONS'] += result['SHAKER_MENTIONS'];
            //   results['QUESTIONS'] += result['QUESTIONS'];
            //   results['SPAM'] += result['SPAM'];
            // }
            if (counter == fileLength && !shownOutput) {
                shownOutput = true;
                // console.table(test)
                console.log("RESULTS\n\=======");
                for (const [key, value] of Object.entries(results)) {
                    console.log(`${key}: ${value}`);
                }
                process.exit(0);
            }
        }
    }
};
// check if main process
if (cluster.isMaster) {
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }
    for (const id in cluster.workers) {
        // wait for worker to send message back to the main process to process the results
        cluster.workers[id].on('message', calculateResults);
    }
    for (let key in results) {
        results[key] = 0;
    }
}
else {
    // run cluster processes
    const mainResult = main();
    // if there are less files than threads it will return with no result
    if (mainResult.result.length) {
        if (process.send) {
            process.send({ 'result': mainResult });
        }
    }
}