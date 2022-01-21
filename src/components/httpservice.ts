import { HTTP_HEADER, CHECK_PAGE } from "../utils/const";


export class HttpService {
    public session: any;
    public cookieJar: any;

    constructor() {
        const request = require('request-promise');
        this.cookieJar = request.jar();
        this.session = request.defaults( { jar: this.cookieJar } );
    }

    public clearCookie() {
        this.cookieJar = require('request-promise').jar();
    }

    // 判断是否已经登录
    async isAuthenticated(): Promise<boolean>  {
        try{
            await this.session({
                url: CHECK_PAGE,
                method: "get",
                resolveWithFullResponse: true,
                header: HTTP_HEADER,
                json: true,
                followRedirect: false
            });
            return Promise.resolve(true);
        } catch(error: any) {
            return Promise.resolve(false);
        }
    }
}

var httpService = new HttpService();

export const clearCookie = httpService.clearCookie;