'use strict'

import {Cached} from './Cached';
import * as Filesystem from 'fs';
import {RecursiveFiles} from './RecursiveFiles';
const Engine = require('php-parser');

/**
 * Parser all project files. Build data structure to access the parsed tokens easily.
 *
 */
export class Parser {

    private projectRoot:string;

    constructor(projectRoot: string)
    {
        this.projectRoot = projectRoot;
    }

    /**
     * Ger a list of file paths for all files in the workspace folder
     */
    private getFilesListForProject(path:string): Promise<Array<any>>{
        return new Promise<Array<any>>((resolve, reject) => {
            let getFilesListPromise = Promise.all([RecursiveFiles(path)]);
            getFilesListPromise
                .then(result => { return result[0]; })
                .then(files => {
                    resolve(files);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /**
     * Parse the given file and return the AST.
     */
    public parse(file): Promise<object>
    {
        return new Promise<object>((resolve, reject) => {
            let content = Filesystem.readFileSync(file, 'utf8');

            let Parser = new Engine({
                // some options :
                parser: {
                    extractDoc: true,
                    locations: false,
                    suppressErrors: true
                },
                ast: {
                    withPositions: true
                }
            });

            // parse the abstract syntax tree for the file
            let AST = Parser.parseCode(content);

            resolve(AST);
        });
    }
    /**
     * Parse the project root
     */
    public process(): Promise<Array<any>>
    {
        return new Promise<Array<any>>((resolve, reject) => {
            this.getFilesListForProject(this.projectRoot)
            .then(files => {
                let parsedFiles = [];

                files
                    .forEach(file => {
                        //console.log('Parse the AST', file);
                        parsedFiles.push(file);
                    });

                resolve(parsedFiles);
            })
            .catch(error => {
                reject(error);
            });
        });
    }
}
