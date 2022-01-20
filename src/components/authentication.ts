import { ExplorerCommanders } from '../components/commanders';
import * as vscode from 'vscode';
import { CAS_CAPTCHA_URL, CAS_LOGIN_URL, CAS_RETURN_URL, HTTP_HEADER } from '../utils/const';
import { HttpService } from "./httpservice";
import * as fs from "fs";
import * as path from "path";
import { getExtensionPath } from "../utils/tools";

export class AuthenticateService {
    constructor(
        // protected profileService: ProfileService,
        protected feedTreeViewProvider: ExplorerCommanders) {
    }
    public logout(httpService: HttpService) {
        try {
            httpService.clearCookie();
            this.feedTreeViewProvider.refresh();
        } catch (error) {
            console.log(error);
        }
        vscode.window.showInformationMessage('注销成功！');
    }

    public async login(httpService: HttpService) {
        if (!await httpService.isAuthenticated()) {
            vscode.window.showWarningMessage('尚未登陆，请先登录！');
        }
        else{
            vscode.window.showInformationMessage('已登陆，无需重复登录');
            return;
        }
        let panel: vscode.WebviewPanel | undefined = undefined;
        do {
            let resp = await httpService.session(
                {
                    url: CAS_LOGIN_URL,
                    method: 'get',
                    qs: { service: CAS_RETURN_URL },
                    json: true,
                    headers: HTTP_HEADER
                }
            );
            console.log(httpService.cookieJar);

            var reg = /<input.*?name="CAS_LT".*?>/;
            var x = reg.exec(resp);
            reg = /LT-\w*/;
            let captcahLt: any = undefined;
            if (x !== null) {
                let lt = reg.exec(x[0]);
                if (lt) {
                    captcahLt = lt[0];
                }
            }
            if (!captcahLt) { return; }

            // save captcha
            let captchaImg = await httpService.session(
                {
                    url: CAS_CAPTCHA_URL,
                    method: 'get',
                    headers: HTTP_HEADER,
                    encoding: null
                }
            );
            fs.writeFileSync(path.join(getExtensionPath(), 'tmp', 'captcha.png'), captchaImg);

            // display captcha
            if (panel !== undefined) {
                panel.dispose();
            }
            panel = vscode.window.createWebviewPanel(
                'captcha',
                '验证码',
                vscode.ViewColumn.One,
                {}
            );
            var username: string | undefined = await vscode.window.showInputBox({
                prompt: "输入学号",
                placeHolder: "",
                ignoreFocusOut: true
            });
            var password: string | undefined = await vscode.window.showInputBox({
                prompt: "输入密码",
                placeHolder: "",
                ignoreFocusOut: true
            });

            const imgSrc = panel.webview.asWebviewUri(vscode.Uri.file(path.join(getExtensionPath(), 'tmp', 'captcha.png'))
            );
            
            panel.webview.html = `<!DOCTYPE html>
            <html lang="en">
            <body>
                <br>
                <br>
                <br>
                <img src="${imgSrc.toString()}" width="300" />
            </body>
            </html>`;
            var captchaCode: string | undefined = await vscode.window.showInputBox({
                prompt: "输入验证码",
                placeHolder: "",
                ignoreFocusOut: true
            });
            resp = await httpService.session({
                    url: CAS_LOGIN_URL,
                    method: 'POST',
                    form: {
                        model: "uplogin.jsp",
                        service: CAS_RETURN_URL,
                        warn: "",
                        showCode: "1",
                        username: username,
                        password: password,
                        button: "",
                        CAS_LT: captcahLt,
                        LT: captchaCode,
                    },
                    json: true,
                    resolveWithFullResponse: true,
                    followAllRedirects: true
            });
            if (!await httpService.isAuthenticated()) {
                vscode.window.showWarningMessage('信息错误，请重新输入');
            }
            else {
                vscode.window.showInformationMessage('登录成功！');
                panel.dispose();
                break;
            }
    } while (true);
    }
}