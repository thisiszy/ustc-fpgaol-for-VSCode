import { HTTP_HEADER, CHECK_PAGE } from "../utils/const";


export class HttpService {
    public session: any;
    public cookieJar: any;

    constructor() {
        const request = require('request-promise');
        this.cookieJar = request.jar();
        this.session = request.defaults( { jar: this.cookieJar } );
    }

    // public async sendRequest(options: any): Promise<any> {
    //     options.headers = HTTP_HEADER;
    //     var returnBody;
    //     if (
    //         options.resolveWithFullResponse === undefined ||
    //         options.resolveWithFullResponse === false
    //     ) {
    //         returnBody = true;
    //     } else {
    //         returnBody = false;
    //     }
    //     options.resolveWithFullResponse = true;

    //     options.simple = false;

    //     // var resp;
    //     // try {

    //     // } catch (error) {
    //     //     // vscode.window.showInformationMessage('请求错误');
    //     //     return Promise.resolve(null);
    //     // }
    //     // if (returnBody) {
    //     //     return Promise.resolve(resp.body);
    //     // } else {
    //     //     return Promise.resolve(resp);
    //     // }
    // }

    public clearCookie() {
        this.cookieJar = require('request-promise').jar();
    }

    async isAuthenticated(): Promise<boolean>  {
        try{
            var req = await this.session({
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

// export const sendRequest = httpService.sendRequest;
export const clearCookie = httpService.clearCookie;