'use strict'

import {Cached} from './Cached';
import * as Filesystem from 'fs';
import {RecursiveFiles} from './RecursiveFiles';
const Engine = require('php-parser');
const parserOptions = {
    parser: {
        extractDoc: true,
        locations: false,
        suppressErrors: true
    },
    ast: {
        withPositions: true
    }
};

/**
 * Parser all project files. Build data structure to access the parsed tokens easily.
 *
 */
export class Parser {

    private cacheManager: Cached;
    private projectRoot:string;
    private parser;

    constructor(projectRoot: string)
    {
        this.projectRoot = projectRoot;
        this.cacheManager = new Cached();
        this.parser = new Engine(parserOptions);
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
            let cacheKey = file.split('/').join('.');
            this.cacheManager.get(cacheKey)
                .then(resolve)
                .catch(error => { console.log('File is not cached.'); })
                .then(() => {
                    let content = Filesystem.readFileSync(file, 'utf8');
                    // parse the abstract syntax tree for the file
                    let AST = this.parser.parseCode(content);
                    this.cacheManager.set(cacheKey, AST)
                        .then(() => { resolve(AST); })
                        .catch((error) => {console.log(error); reject('Caching failed')});
                })
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
                        this.parse(file)
                            .then(() => {
                                parsedFiles.push(file);
                            })
                            .catch(error => { console.log(error); });
                    });

                resolve(parsedFiles);
            })
            .catch(error => {
                reject(error);
            });
        });
    }
}
