const fs = require('fs')
const path = require('path');
const cpus = require('os').cpus().length
const cluster = require('cluster');
import { CommentAnalyzer } from './CommentAnalyzer';


const dir = './docs'
let shownOutput = false;
let results: any = {}
let counter = 0;

/**
 * @function main
 * @description function to be called by each worker, split reading of files and calling of analyzer
 * @returns array with list results 
 */
const main = () => {
  const targetFiles = fs.readdirSync(dir).filter((value: string) => value.endsWith('.txt'));
  //split files to run on different cpu's 
  const filesByCPU = targetFiles.filter((_value: string, index: number) => index % cpus === cluster.worker.id - 1);
  let result: any[] = [];
  for (let file of filesByCPU) {
    const file_data = fs.readFileSync(`${dir}/${file}`, { encoding: 'utf8', flag: 'r' }).toString().replace(/\r\n/g, '\n').split('\n');
    const commentAnalyzer = new CommentAnalyzer();
    for (let line of file_data) {
      commentAnalyzer.setLine(line)
      commentAnalyzer.determineShorterThan(15, 'SHORTER_THAN_15');
      commentAnalyzer.determineText('mover', 'MOVER_MENTIONS');
      commentAnalyzer.determineText('shaker', 'SHAKER_MENTIONS');
      commentAnalyzer.determineText('?', 'QUESTIONS');
      commentAnalyzer.determineText('http', 'SPAM');
    }
    result.push(commentAnalyzer.getResults());
  }
  return { 'result': result, 'fileLength': targetFiles.length }
}


/**
 * @function calculateResults
 * @param childResults 
 * @description function to handle the results from each worker and print result 
 */
const calculateResults = (childResults: any) => {
  {

    if (childResults.result) {

      const fileLength = childResults.result.fileLength;
      //loops through each child by thread and amend key values 
      for (const child of childResults.result.result) {
        counter++;
        for (const key of Object.keys(child)) {
          if (!Object.keys(results).includes(key)) {
            results[key] = 0;
          }
          results[key] += child[key]
        }
      }

      //determine if every file has been read and that the output hasn't occurred because of concurrent threads being run
      if (counter == fileLength && !shownOutput) {
        shownOutput = true;
        console.log("RESULTS\n\=======");
        for (const [key, value] of Object.entries(results)) {
          console.log(`${key}: ${value}`);
        }
        process.exit(0);
      }
    }
  }
}

// check if main process
if (cluster.isMaster) {
  for (let i = 0; i < cpus; i++) {
    cluster.fork()
  }

  for (const id in cluster.workers) {
    // wait for worker to send message back to the main process to process the results
    cluster.workers[id].on('message', calculateResults);
  }
  for (let key in results) {
    results[key] = 0;
  }

} else {
  // run cluster processes
  const mainResult = main();
  // if there are less files than threads it will return with no result
  if (mainResult.result.length) {
    if (process.send) {
      process.send({ 'result': mainResult })
    }
  }
}
