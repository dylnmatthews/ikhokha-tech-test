"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const CommentAnalyzer_1 = require("./CommentAnalyzer");
const forks = require('os').cpus().length;
const cluster = require('cluster');
const dir = './docs';
// let targetFiles: string[] = [];
let shownOutput = false;
let results = {
    "SHORTER_THAN_15": 0,
    "MOVER_MENTIONS": 0,
    "SHAKER_MENTIONS": 0,
    "QUESTIONS": 0,
    "SPAM": 0
};
let counter = 0;
/**
 * @fuction main
 * @description function to be called by each worker, split reading of files and calling of analyzer
 * @returns array with list results
 */
const main = () => {
    const targetFiles = fs.readdirSync(dir).filter((value) => value.endsWith('.txt'));
    //split files to run on different cpu's 
    const clusterFiles = targetFiles.filter((_value, index) => index % forks === cluster.worker.id - 1);
    console.log(clusterFiles.length);
    let result = [];
    for (let file of clusterFiles) {
        const commentAnalyzer = new CommentAnalyzer_1.CommentAnalyzer(file);
        result.push(commentAnalyzer.analyze());
    }
    return { 'result': result, 'fileLength': targetFiles.length };
};
const calculateResults = (childResults) => {
    {
        if (childResults.result) {
            const fileLength = childResults.result.fileLength;
            for (let result of childResults.result.result) {
                counter++;
                results['SHORTER_THAN_15'] += result['SHORTER_THAN_15'];
                results['MOVER_MENTIONS'] += result['MOVER_MENTIONS'];
                results['SHAKER_MENTIONS'] += result['SHAKER_MENTIONS'];
                results['QUESTIONS'] += result['QUESTIONS'];
                results['SPAM'] += result['SPAM'];
            }
            if (counter == fileLength && !shownOutput) {
                shownOutput = true;
                console.table(results);
                process.exit(0);
            }
        }
    }
};
// check if main process
if (cluster.isMaster) {
    for (let i = 0; i < forks; i++) {
        cluster.fork();
    }
    for (const id in cluster.workers) {
        // wait for worker to send message back to the main process to process the results
        cluster.workers[id].on('message', calculateResults);
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
    //stop process
    // process.exit(0);
}
