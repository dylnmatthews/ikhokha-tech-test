"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentAnalyzer = void 0;
const fs = __importStar(require("fs"));
class CommentAnalyzer {
    constructor(file) {
        this.dir = './docs';
        this.file = file;
    }
    analyze() {
        let results = {
            "SHORTER_THAN_15": 0,
            "MOVER_MENTIONS": 0,
            "SHAKER_MENTIONS": 0,
            "QUESTIONS": 0,
            "SPAM": 0
        };
        const file_data = fs.readFileSync(`${this.dir}/${this.file}`, { encoding: 'utf8', flag: 'r' }).toString().replace(/\r\n/g, '\n').split('\n');
        for (let line of file_data) {
            line = line.toLowerCase();
            //  determine which look ups to do and add one to the right key
            if (line.length < 15) {
                results['SHORTER_THAN_15'] += 1;
            }
            if (line.includes('mover')) {
                results['MOVER_MENTIONS'] += line.split('mover').length - 1;
            }
            if (line.includes('shaker')) {
                results['SHAKER_MENTIONS'] += line.split('shaker').length - 1;
            }
            if (line.includes('?')) {
                results['QUESTIONS'] += line.split('?').length - 1;
            }
            if (line.includes('https://') || line.includes('http://') || line.includes('www.')) {
                results['SPAM'] += 1;
            }
        }
        return results;
    }
}
exports.CommentAnalyzer = CommentAnalyzer;
