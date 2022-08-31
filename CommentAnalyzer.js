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
/**
 * @class CommentAnalyzer
 * @description class to handle the analyzing for the comments based off the config.json file.
 */
class CommentAnalyzer {
    constructor(file) {
        this.dir = './docs';
        this.results = {};
        this.file = file;
    }
    /**
     * @function setConfig
     * @param config
     * @description function to set the config which could
     */
    setConfig(config) {
        this.config = JSON.parse(config);
        for (let key in this.config) {
            this.results[key] = 0;
        }
    }
    analyze() {
        var _a;
        const keys = Object.keys(this.config);
        const file_data = fs.readFileSync(`${this.dir}/${this.file}`, { encoding: 'utf8', flag: 'r' }).toString().replace(/\r\n/g, '\n').split('\n');
        for (let line of file_data) {
            line = line.toLowerCase();
            for (let key of keys) {
                const regex = new RegExp(this.config[key]);
                this.results[key] += ((_a = line.match(regex)) === null || _a === void 0 ? void 0 : _a.length) || 0;
            }
        }
        return this.results;
    }
}
exports.CommentAnalyzer = CommentAnalyzer;
