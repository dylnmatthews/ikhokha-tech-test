
export class CommentAnalyzer {

    private results: any = {}
    private line: string = "";

    /**
     * @function setLine
     * @param line:string
     * @description function to set the line for the class to analyze
     */
    setLine(line: string) {
        this.line = line.toLowerCase()
    }

    /**
     * @function calculateResults
     * @param attribute:string
     * @description function to set the attribute and set the result of it
     */
    calculateResults(attribute: string) {
        if (!Object.keys(this.results).includes(attribute)) {
            // initialize attribute if it doesnt exist yet  
            this.results[attribute] = 0;
        }
        this.results[attribute] += 1;
    }

    /**
     * @function determineShorterThan
     * @param length:number
     * @param attribute:string
     * @description to check of the length of the line is shorted than required amount
     */
    determineShorterThan(length: number, attribute: string) {
        if (this.line.length < length) {
            this.calculateResults(attribute)
        }
    }

    /**
     * @function determineText
     * @param phrase:string
     * @param attribute:string
     * @description function to check if a phrase is part of the line 
     */
    determineText(phrase: string, attribute: string) {
        if (this.line.includes(phrase)) {
            this.calculateResults(attribute)
        }
    }
    /**
    * @function getResults
    * @description function to get the results
    */
    getResults() {
        return this.results;
    }
}