import { CHIP_TYPE, COMPILE_URLS } from "../utils/const";
import { HttpService } from "./httpservice";

export class CompileManager{
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
        return Promise.resolve(JSON.parse(resp)["code"] === 1);
    }

    public async query(jobId: string, httpService: HttpService): Promise<boolean>{
        let resp = await httpService.session({
            url: COMPILE_URLS.QUERY + jobId,
            method: 'GET',
            json: true
        });
        console.log(resp);
        return Promise.resolve(JSON.parse(resp)["code"] === 1);
    }

    public async download(jobId: string, httpService: HttpService): Promise<boolean>{
        let resp = await httpService.session({
            url: COMPILE_URLS.DOWNLOAD + jobId,
            method: 'GET',
            json: true
        });
        console.log(resp);
        return Promise.resolve(JSON.parse(resp)["code"] === 1);
    }

    private getBase64(filepath: string){
        const fs = require('fs');
        const contents = fs.readFileSync(filepath, {encoding: 'base64'});
        return contents;
    }
} 