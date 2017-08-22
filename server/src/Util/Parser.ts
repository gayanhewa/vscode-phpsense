'use strict'

import * as Engine from 'php-parser';

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
    private getFilesListForProject(path:string): Promise<Array<string>> {
        return new Promise<Array<string>>((resolve, reject) => {

        });
    }

    /**
     * Parse the project root
     */
    public parse()
    {

    }

}