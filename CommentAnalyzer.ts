import * as fs from 'fs';


/**
 * @class CommentAnalyzer
 * @description class to handle the analyzing for the comments based off the config.json file.
 */
export class CommentAnalyzer {

    private file: string;
    private dir = './docs';
    private config:any;
    private results:any = {};

    constructor(file: string) {
        this.file = file;
    }

    /**
     * @function setConfig
     * @param config
     * @description function to set the config which could 
     */
    setConfig(config:string){
        this.config = JSON.parse(config);
        for (let key in this.config) {
            // initializes results so each key starts at 0
            this.results[key] = 0;
          }
    }

    /**
     * @function analyze
     * @description function to analyze the file which it reads, does the analysis based off the config.json regex
     * @returns results
     */
    analyze() {
       const keys = Object.keys(this.config)
        const file_data = fs.readFileSync(`${this.dir}/${this.file}`, { encoding: 'utf8', flag: 'r' }).toString().replace(/\r\n/g, '\n').split('\n');
        for (let line of file_data) {
            line = line.toLowerCase();
            for (let key of keys){
                // converts regex string from config.json to a regex expression
                const regex = new RegExp(this.config[key]);
                this.results[key] += line.match(regex)?.length || 0;
            }

        }
        return this.results

    }
}