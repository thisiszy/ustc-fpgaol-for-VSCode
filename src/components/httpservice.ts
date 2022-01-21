import path = require("path");
import { getExtensionPath } from "../utils/tools";
import * as fs from 'fs';


export class HttpService {
    public session: any;
    public cookieJar: any = undefined;

    constructor() {
            const request = require('request-promise');
            this.session = request;
    }

    public async sendRequest(options: any): Promise<any> {
        this.getCookies();
        options.jar = this.cookieJar;
        var resp = await this.session(options);
        return Promise.resolve(resp);
    }

    public getCookies() {
        let cookiePath = path.join(getExtensionPath(), 'storage', 'cookies.json');
        if(!fs.existsSync(cookiePath)){
            fs.writeFileSync(cookiePath, '');
        }
        if (!this.cookieJar){
            const request = require('request-promise');
            var fileCookieStore = require('tough-cookie-filestore');
            this.cookieJar = request.jar(new fileCookieStore(cookiePath));
        }
    }

    // public clearCookie() {
    //     let cookiePath = path.join(getExtensionPath(), 'storage', 'cookies.json');
    //     this.cookieJar = undefined;
    //     fs.writeFileSync(cookiePath, '');
    // }
}

var httpService = new HttpService();

// export const clearCookie = httpService.clearCookie;