'use strict'

import * as Filesystem from 'fs';

interface CacheInterface
{
    set(key: string, value: any): Promise<boolean>;
    get(key: string): Promise<object>;
    forget(key: string): Promise<boolean>;
}

export class Cached implements CacheInterface
{
    private dir: string = "/tmp/";

    private getPath(filename?:string): string
    {
        if (filename) {
            return this.dir+filename;
        }

        return this.dir;
    }

    public set(key: string, value: any): Promise<boolean>
    {
        return new Promise<boolean>((resolve, reject) => {
            try {
                let path = this.getPath(key+".json");
                let content = JSON.stringify(value);
                Filesystem.writeFileSync(path, content);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }

    public get(key: string): Promise<object>
    {
        return new Promise<object>((resolve, reject) => {
            try {
                let path = this.getPath(key+".json");
                let content = Filesystem.readFileSync(path, 'utf8');
                resolve(JSON.parse(content));
            } catch (error) {
                reject(error);
            }
        });
    }

    public forget(key: string): Promise<boolean>
    {
        return new Promise<boolean>((resolve, reject) => {
            try {
                let path = this.getPath(key+".json");

                Filesystem.unlinkSync(path);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }
}