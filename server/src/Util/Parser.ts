'use strict'

import * as _ from 'lodash';
import {Cached} from './Cached';
import * as Filesystem from 'fs';
import {ParsedObject} from './../Interfaces/Interfaces';
import {RecursiveFiles} from './RecursiveFiles';

// TODO: Figure out why I can't use import for this.
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
    public parse(file): Promise<ParsedObject>
    {
        return new Promise<ParsedObject>((resolve, reject) => {
            let cacheKey = file.split('/').join('.');
            this.cacheManager.get(cacheKey)
                .then(resolve)
                .catch(error => { console.log('File is not cached.'); })
                .then(() => {
                    let content = Filesystem.readFileSync(file, 'utf8');
                    // parse the abstract syntax tree for the file
                    return this.parser.parseCode(content);
                })
                .then(this.getFQCN)
                .then((parsedObject) => {
                    this.cacheManager.set(cacheKey, parsedObject)
                    .then(() => { resolve(parsedObject); })
                    .catch((error) => {console.log(error); reject('Caching failed')});
                });
        });
    }

    /**
     * Get the fully qualified classname for a given AST.
     *
     * @param AST
     */
    public getFQCN(AST): ParsedObject
    {
        let fqcn = '';

        if (!_.isNil(AST.children)) {
          AST.children
            .forEach((childNode) => {
              if(childNode.kind === 'namespace') {
                fqcn = childNode.name;
                if (!_.isNil(childNode.children)) {
                  childNode.children
                    .forEach((childNode) => {
                      if (childNode.kind === 'class') {
                        fqcn = [fqcn, childNode.name].join("\\");
                      }
                    })
                }
              } else if (childNode.kind === 'class' || childNode.kind === 'interface') {
                fqcn = childNode.name;
              }
            });
        }

        return { ast: AST, fqcn: fqcn };
    }
    /**
     * Parse the project root, this will generate cached AST files for all files in the project.
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
