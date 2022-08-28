"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const worker_threads_1 = require("worker_threads");
const dir = './docs';
class Main {
    constructor() {
        this.results = {
            "SHORTER_THAN_15": 0,
            "MOVER_MENTIONS": 0,
            "SHAKER_MENTIONS": 0,
            "QUESTIONS": 0,
            "SPAM": 0
        };
        this.counter = 0;
        let allFilesInDirectory = fs.readdirSync(dir);
        let targetFiles = [];
        for (let file of allFilesInDirectory) {
            if (path.extname(file).toLowerCase() === '.txt') {
                targetFiles.push(file);
            }
        }
        let fileLength = targetFiles.length;
        console.time('time');
        for (let file of targetFiles) {
            // const commentAnalyzer = new CommentAnalyzer(file);
            // const results = commentAnalyzer.analyze();
            // this.calculateResults(results);
            // this.counter++;
            // this.checkIfFinished(fileLength);
            const worker = new worker_threads_1.Worker('./CommentAnalyzer.js', { workerData: { 'file': file } });
            worker.on('message', (data) => {
                // check the success state of the worker
                if (data.successState) {
                    this.calculateResults(data.result);
                    this.counter++;
                    this.checkIfFinished(fileLength);
                }
                else {
                    // lower number of files as the file failed
                    fileLength--;
                    this.checkIfFinished(fileLength);
                }
            });
        }
        console.log('after loop');
    }
    /**
     *
     * @param fileLength
     * @description check if the files have finished as they running all concurrently
     */
    checkIfFinished(fileLength) {
        if (this.counter == fileLength) {
            console.table(this.results);
            console.timeEnd('time');
        }
    }
    calculateResults(result) {
        this.results['SHORTER_THAN_15'] += result['SHORTER_THAN_15'];
        this.results['MOVER_MENTIONS'] += result['MOVER_MENTIONS'];
        this.results['SHAKER_MENTIONS'] += result['SHAKER_MENTIONS'];
        this.results['QUESTIONS'] += result['QUESTIONS'];
        this.results['SPAM'] += result['SPAM'];
    }
}
new Main();
