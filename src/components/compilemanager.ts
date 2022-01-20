import { CHIP_TYPE, COMPILE_STATUS, COMPILE_URLS } from "../utils/const";
import { HttpService } from "./httpservice";

export class CompileManager{
    private jobs: Set<string> = new Set();
    curStatus: Record<string, string> = {};

    constructor(){};

    public async compile(jobId: string, filepath: string, httpService: HttpService): Promise<boolean>{
        let file = this.getBase64(filepath);
        let resp = await httpService.session({
            url: COMPILE_URLS.SUBMIT,
            method: 'POST',
            form: {
                inputJobId: jobId,
                inputFPGA: CHIP_TYPE.ARTIX7,
                inputZipFile: file
            },
            json: true
        });
        console.log(resp);
        this.jobs.add(jobId);
        return Promise.resolve(resp["code"] === 1);
    }

    public async query(jobId: string, httpService: HttpService): Promise<number>{
        let resp = await httpService.session({
            url: COMPILE_URLS.QUERY + jobId,
            method: 'GET',
            json: true
        });
        return Promise.resolve(resp["data"]['status']);
    }

    public async queryAll(httpService: HttpService){
        this.curStatus = {};
        for (var jobId of this.jobs){
            var resp = await httpService.session({
                url: COMPILE_URLS.QUERY + jobId,
                method: 'GET',
                json: true
            });
            this.curStatus[jobId] = COMPILE_STATUS[resp["data"]['status']];
        }
        console.log(this.curStatus);
    }

    public async download(jobId: string, httpService: HttpService): Promise<boolean>{
        let resp = await httpService.session({
            url: COMPILE_URLS.DOWNLOAD + jobId,
            method: 'GET',
            json: true
        });
        console.log(resp);
        return Promise.resolve(resp["code"] === 1);
    }

    public addFile(jobId: string){
        this.jobs.add(jobId);
    }

    private getBase64(filepath: string){
        const fs = require('fs');
        const contents = fs.readFileSync(filepath, {encoding: 'base64'});
        return contents;
    }
} 