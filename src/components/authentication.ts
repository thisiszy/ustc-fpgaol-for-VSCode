import * as vscode from 'vscode';
import * as fs from "fs";
import * as path from "path";
import { CAS_CAPTCHA_URL, CAS_FPGAOL_LOGOUT_URL, CAS_LOGIN_URL, CAS_LOGOUT_URL, CAS_RETURN_URL, CHECK_PAGE, HTTP_HEADER } from '../utils/const';
import { HttpService } from "./httpservice";
import { getExtensionPath, Logger } from "../utils/tools";
import { GlobalVars } from '../utils/global';

export class AuthenticateService {
    constructor() { }
    public async logout(httpService: HttpService) {
        try {
            await httpService.sendRequest({
                url: CAS_FPGAOL_LOGOUT_URL,
                method: 'get',
                json: true,
                headers: HTTP_HEADER
            });
            await httpService.sendRequest({
                url: CAS_LOGOUT_URL,
                method: 'get',
                json: true,
                headers: HTTP_HEADER
            });
            httpService.clearCookie();
        } catch (error: any) {
            Logger.error("logout error: " + error.message);
        }
        vscode.window.showInformationMessage('注销成功！');
    }

    public async login(httpService: HttpService): Promise<boolean> {
        if (await this.isAuthenticated(httpService)) {
            vscode.window.showInformationMessage('已登陆，无需重复登录');
            return Promise.resolve(false);
        }
        GlobalVars.statusBarItem.tooltip = "FPGAOL";
        GlobalVars.statusBarItem.show();
        let panel: vscode.WebviewPanel | undefined = undefined;
        do {
            GlobalVars.statusBarItem.text = '$(sync~spin) Preparing';
            let resp = await httpService.sendRequest(
                {
                    url: CAS_LOGIN_URL,
                    method: 'get',
                    qs: { service: CAS_RETURN_URL },
                    json: true,
                    headers: HTTP_HEADER
                }
            );
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
            if (!captcahLt) { return Promise.reject("Not find capture"); }

            // save captcha
            let captchaImg = await httpService.sendRequest(
                {
                    url: CAS_CAPTCHA_URL,
                    method: 'get',
                    headers: HTTP_HEADER,
                    encoding: null
                }
            );
            fs.writeFileSync(path.join(getExtensionPath(), 'tmp', 'captcha.png'), captchaImg);

            GlobalVars.statusBarItem.text = '$(sync~spin) Waiting';
            var username: string | undefined = await vscode.window.showInputBox({
                prompt: "输入学号",
                placeHolder: "",
                ignoreFocusOut: true
            });
            if (!username) { GlobalVars.statusBarItem.hide(); return Promise.resolve(false); }
            var password: string | undefined = await vscode.window.showInputBox({
                prompt: "输入密码",
                placeHolder: "",
                password: true,
                ignoreFocusOut: true
            });
            if (!password) { GlobalVars.statusBarItem.hide(); return Promise.resolve(false); }

            // display captcha
            GlobalVars.statusBarItem.text = '$(sync~spin) Rendering';
            panel = vscode.window.createWebviewPanel(
                'captcha',
                '验证码',
                vscode.ViewColumn.One,
                {}
            );
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
            GlobalVars.statusBarItem.text = '$(sync~spin) Waiting';
            var captchaCode: string | undefined = await vscode.window.showInputBox({
                prompt: "输入验证码",
                placeHolder: "",
                ignoreFocusOut: true
            });
            panel.dispose();
            if (!captchaCode) { GlobalVars.statusBarItem.hide(); return Promise.resolve(false); }
            GlobalVars.statusBarItem.text = '$(sync~spin) Verifying';
            await httpService.sendRequest({
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
                    // 每个验证码都有一个唯一的lt
                    CAS_LT: captcahLt,
                    // 验证码数字
                    LT: captchaCode,
                },
                json: true,
                followAllRedirects: true
            });
            if (!await this.isAuthenticated(httpService)) {
                vscode.window.showWarningMessage('信息错误，请重新输入');
            }
            else {
                vscode.window.showInformationMessage('登录成功！');
                GlobalVars.statusBarItem.hide();
                break;
            }
        } while (true);
        return Promise.resolve(true);
    }

    // 判断是否已经登录
    async isAuthenticated(httpService: HttpService): Promise<boolean> {
        try {
            await httpService.sendRequest({
                url: CHECK_PAGE,
                method: "get",
                resolveWithFullResponse: true,
                header: HTTP_HEADER,
                json: true,
                followRedirect: false
            });
            return Promise.resolve(true);
        } catch (error: any) {
            return Promise.resolve(false);
        }
    }
}