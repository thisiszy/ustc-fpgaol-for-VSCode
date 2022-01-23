import path = require("path");
import { getExtensionPath, Logger } from "../utils/tools";
import * as fs from 'fs';
import request = require('request-promise');
import fileCookieStore = require('tough-cookie-filestore');
import { GlobalVars } from "../utils/global";

export class HttpService {
    public session: any;
    public cookieJar: any = undefined;

    constructor() {
        this.session = require('request-promise');
    }

    public async sendRequest(options: any): Promise<any> {
        this.setCookies();
        options.jar = this.cookieJar;
        var resp = await this.session(options);
        return Promise.resolve(resp);
    }

    private setCookies() {
        if (!this.cookieJar){
            let cookiePath = path.join(getExtensionPath(), 'storage', 'cookies.json');
            if(!fs.existsSync(cookiePath) || !GlobalVars.logginWithCookies){
                fs.writeFileSync(cookiePath, '');
            }
            this.cookieJar = request.jar(new fileCookieStore(cookiePath));
        }
    }

    public async abortRequest(): Promise<void> {
        this.session.abort();
    }

    public clearCookie() {
        let cookiePath = path.join(getExtensionPath(), 'storage', 'cookies.json');
        this.cookieJar = undefined;
        fs.writeFileSync(cookiePath, '');
    }
}

// export const clearCookie = httpService.clearCookie;