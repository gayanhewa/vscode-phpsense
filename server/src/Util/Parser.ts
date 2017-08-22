'use strict'

import * as Engine from 'php-parser';
import {RecursiveFiles} from './RecursiveFiles';
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
     * Parse the project root
     */
    public parse(): Promise<Array<any>>
    {
        return new Promise<Array<any>>((resolve, reject) => {
            this.getFilesListForProject(this.projectRoot)
            .then(files => {
                let parsedFiles = [];

                files
                    .forEach(file => {
                        console.log('Parse the AST', file);
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