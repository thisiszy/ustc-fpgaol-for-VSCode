import { CHIP_TYPE, COMPILE_STATUS, COMPILE_URLS } from "../utils/const";
import { HttpService } from "./httpservice";
import * as fs from "fs";
import * as path from "path";
import { getExtensionPath } from "../utils/tools";

export class CompileManager{
    private jobs: Set<string> = new Set();
    curStatus: Record<string, string> = {};

    constructor(){
        this.loadJobs();
    };

    public async compile(jobId: string, filepath: string, httpService: HttpService): Promise<boolean>{
        let file = this.getBase64(filepath);
        let resp = await httpService.sendRequest({
            url: COMPILE_URLS.SUBMIT,
            method: 'POST',
            form: {
                inputJobId: jobId,
                inputFPGA: CHIP_TYPE.ARTIX7,
                inputZipFile: file
            },
            json: true
        });
        this.jobs.add(jobId);
        this.saveJobs();
        return Promise.resolve(resp["code"] === 1);
    }

    public async query(jobId: string, httpService: HttpService): Promise<number>{
        let resp = await httpService.sendRequest({
            url: COMPILE_URLS.QUERY + jobId,
            method: 'GET',
            json: true
        });
        return Promise.resolve(resp["data"]['status']);
    }

    public async queryAll(httpService: HttpService){
        this.curStatus = {};
        for (var jobId of this.jobs){
            var resp = await httpService.sendRequest({
                url: COMPILE_URLS.QUERY + jobId,
                method: 'GET',
                json: true
            });
            this.curStatus[jobId] = COMPILE_STATUS[resp["data"]['status']];
        }
    }

    public async download(jobId: string, httpService: HttpService): Promise<boolean>{
        let resp = await httpService.sendRequest({
            url: COMPILE_URLS.DOWNLOAD + jobId,
            method: 'GET',
            json: true
        });
        console.log(resp);
        return Promise.resolve(resp["code"] === 1);
    }

    public addFile(jobId: string){
        this.jobs.add(jobId);
        this.saveJobs();
    }

    private getBase64(filepath: string){
        const fs = require('fs');
        const contents = fs.readFileSync(filepath, {encoding: 'base64'});
        return contents;
    }

    public saveJobs(){
        try {
            fs.writeFileSync(path.join(getExtensionPath(), 'storage', 'jobCache'), JSON.stringify(Array.from(this.jobs.values())));
        } catch (error) {
            console.log(error);
        }
    }

    public loadJobs(){
        try {
            this.jobs = new Set(JSON.parse(fs.readFileSync(path.join(getExtensionPath(), 'storage', 'jobCache'), {encoding: 'utf-8'})));
        } catch (error) {
        }
    }
} 