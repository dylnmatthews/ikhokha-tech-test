import * as fs from 'fs';
import { parentPort, workerData} from 'worker_threads';
export class CommentAnalyzer {

    private file: string;
    private dir = './docs';

    constructor(file: string) {
        this.file = file;
    }

    analyze() {
        let results = {
            "SHORTER_THAN_15": 0,
            "MOVER_MENTIONS": 0,
            "SHAKER_MENTIONS": 0,
            "QUESTIONS": 0,
            "SPAM": 0
        }
       
        const file_data = fs.readFileSync(`${this.dir}/${this.file}`, { encoding: 'utf8', flag: 'r' }).toString().replace(/\r\n/g, '\n').split('\n');
        for (let line of file_data) {
            line = line.toLowerCase().trim();

            //  determine which look ups to do and add one to the right key
            if (line.length < 15) {
                results['SHORTER_THAN_15'] += 1
            }
            if (line.includes('mover')) {
                results['MOVER_MENTIONS'] += line.split('mover').length - 1
            }
            if (line.includes('shaker')) {
                results['SHAKER_MENTIONS'] += line.split('shaker').length - 1
            }
            if (line.includes('?')) {
                results['QUESTIONS'] += line.split('?').length - 1
            }
            if (line.includes('https://') || line.includes('http://') || line.includes('www.')) {
                results['SPAM'] += 1
            }
        }
        return results

    }
}
// try {
//     console.time(workerData.file);
//     const comments = new CommentAnalyzer(workerData.file);
//     const results = comments.analyze();
   
//     const sendBack = {'successState': true, result: results};
//     parentPort?.postMessage(sendBack);
//     console.timeEnd(workerData.file);
// } catch(error){
//     console.warn(`${workerData.file} has failed ${error}`)
//     const sendBack = {'successState': false};
//     parentPort?.postMessage(sendBack);
// }