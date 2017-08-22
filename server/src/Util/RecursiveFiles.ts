'use strict'

import * as Filesystem from 'fs';

let processedFiles = [];

export function RecursiveFiles(path): any[]
{
    let allFiles = Filesystem.readdirSync(path);

    // iterate all the files from the current
    // directory. Filter out the hidden files
    // and process the other directories.
    allFiles
        .filter((file) => {
            if (!file.startsWith('.')) {

                let stats = Filesystem.lstatSync(path + file);

                if (stats.isDirectory()) {
                    RecursiveFiles(path + file + "/");
                } else {
                    // console.log("file", file);
                    return true;
                }
            }
        }).forEach((file) => { processedFiles.push(path + file); });

        return processedFiles;
}