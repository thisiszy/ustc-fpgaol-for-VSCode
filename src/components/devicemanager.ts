import { HttpService } from "./httpservice";
import * as vscode from 'vscode';
import { CHECK_PAGE, DEVICE, HTTP_HEADER } from "../utils/const";
import { AuthenticateService } from "./authentication";
import { GlobalVars } from "../utils/global";

export class DeviceManager {
    public curStatus: Record<string, Record<string, string | boolean>> = {};

    constructor(){}

    public async acquireDevice(typeSelected: string, httpService: HttpService, authenticateService: AuthenticateService): Promise<boolean> {
        let deviceType: Record<string, string> = DEVICE[typeSelected];
        if (deviceType === undefined){
            vscode.window.showInformationMessage(`${typeSelected} not supported!`);
            return Promise.resolve(false);
        }
        if (!await authenticateService.isAuthenticated(httpService)){
            vscode.window.showWarningMessage('尚未登陆或登陆已过期！');
            return Promise.resolve(false);
        }
        GlobalVars.statusBarItem.text = `$(sync~spin) Acquiring`;
        GlobalVars.statusBarItem.show();
        let resp = await httpService.sendRequest({
            url: deviceType.ACQUIRE_URL,
            method: "get",
            header: HTTP_HEADER,
            json: true
        });
        await this.updateDeviceStatus(resp);
        GlobalVars.statusBarItem.hide();
        return Promise.resolve(true);
    }

    public async releaseDevice(typeSelected: string, httpService: HttpService, authenticateService: AuthenticateService): Promise<boolean> {
        let deviceType: Record<string, string> = DEVICE[typeSelected];
        if (deviceType === undefined){
            vscode.window.showInformationMessage(`${typeSelected} not supported!`);
            return Promise.resolve(false);
        }
        if (!await authenticateService.isAuthenticated(httpService)){
            vscode.window.showWarningMessage('尚未登陆或登陆已过期！');
            return Promise.resolve(false);
        }
        GlobalVars.statusBarItem.text = `$(sync~spin) Releasing`;
        GlobalVars.statusBarItem.show();
        let resp = await httpService.sendRequest({
            url: deviceType.RELEASE_URL,
            method: "get",
            header: HTTP_HEADER,
            json: true
        });
        await this.updateDeviceStatus(resp);
        GlobalVars.statusBarItem.hide();
        return Promise.resolve(true);
    }

    public async updateDeviceStatus(status?: any, needRequest = false, httpService?: HttpService, authenticateService?: AuthenticateService){
        if (needRequest){
            if (!(httpService && authenticateService)){
                console.log('deviceManager.updateDeviceStatus need httpService and authenticateService');
                return;
            };
            if (!await authenticateService.isAuthenticated(httpService)){
                vscode.window.showWarningMessage('尚未登陆或登陆已过期！');
                return;
            }
            status = await httpService.sendRequest({
                url: CHECK_PAGE,
                method: "get",
                header: HTTP_HEADER,
                json: true
            });
        }
        var JSSoup = require('jssoup').default;
        var soup = new JSSoup(status);
        // 解析平台设备信息
        var platformDeviceTable = soup.find('tbody').contents;
        var platformDeviceInfo = [];
        for (var row of platformDeviceTable){
            platformDeviceInfo.push(row.nextElement.nextSiblings[1].text.split('&nbsp;/&nbsp;'));
        }

        // 解析用户已获取的设备信息
        var acquiredDeviceTable = soup.find('table', 'table-striped').nextElement.contents;
        var table: Array<Array<string>> = [];
        for (var row of acquiredDeviceTable){
            table.push([]);
            for (var item of row.contents){
                table[table.length - 1].push(item.text);
            }
        }
        
        // 更新当前设备状态
        this.curStatus[DEVICE.FPGAOL1.TYPE] = {};
        this.curStatus[DEVICE.FPGAOL1.TYPE]['availableNum'] = platformDeviceInfo[0][0];
        this.curStatus[DEVICE.FPGAOL1.TYPE]['totalNum'] = platformDeviceInfo[0][1];
        this.curStatus[DEVICE.FPGAOL1.TYPE]['isAcquired'] = !(table[0][1] === 'None');
        this.curStatus[DEVICE.FPGAOL1.TYPE]['deviceID'] = table[0][1];
        this.curStatus[DEVICE.FPGAOL1.TYPE]['acquireTime'] = table[1][1];
        this.curStatus[DEVICE.FPGAOL1.TYPE]['expireTime'] = table[2][1];
        this.curStatus[DEVICE.FPGAOL1.TYPE]['link'] = table[3][1];

        this.curStatus[DEVICE.FPGAOL2.TYPE] = {};
        this.curStatus[DEVICE.FPGAOL2.TYPE]['availableNum'] = platformDeviceInfo[1][0];
        this.curStatus[DEVICE.FPGAOL2.TYPE]['totalNum'] = platformDeviceInfo[1][1];
        this.curStatus[DEVICE.FPGAOL2.TYPE]['isAcquired'] = !(table[0][2] === 'None');
        this.curStatus[DEVICE.FPGAOL2.TYPE]['deviceID'] = table[0][2];
        this.curStatus[DEVICE.FPGAOL2.TYPE]['acquireTime'] = table[1][2];
        this.curStatus[DEVICE.FPGAOL2.TYPE]['expireTime'] = table[2][2];
        this.curStatus[DEVICE.FPGAOL2.TYPE]['link'] = table[3][2];

        this.curStatus[DEVICE.ZYBO.TYPE] = {};
        this.curStatus[DEVICE.ZYBO.TYPE]['availableNum'] = platformDeviceInfo[2][0];
        this.curStatus[DEVICE.ZYBO.TYPE]['totalNum'] = platformDeviceInfo[2][1];
        this.curStatus[DEVICE.ZYBO.TYPE]['isAcquired'] = !(table[0][3] === 'None');
        this.curStatus[DEVICE.ZYBO.TYPE]['deviceID'] = table[0][3];
        this.curStatus[DEVICE.ZYBO.TYPE]['acquireTime'] = table[1][3];
        this.curStatus[DEVICE.ZYBO.TYPE]['expireTime'] = table[2][3];
        this.curStatus[DEVICE.ZYBO.TYPE]['link'] = table[3][3];
        GlobalVars.statusBarItem.hide();
    }
}