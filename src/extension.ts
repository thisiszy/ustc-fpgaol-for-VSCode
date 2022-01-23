// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ExplorerCommanders } from './components/commanders';
import { HttpService } from "./components/httpservice";
import { AuthenticateService } from './components/authentication';
import { DeviceManager } from './components/devicemanager';
import { getExtensionPath, Logger, setContext, zipDirectory } from "./utils/tools";
import * as fs from "fs";
import * as path from "path";
import { ExplorerDeviceStatus } from './components/devicestatus';
import { CompileManager } from './components/compilemanager';
import { ExplorerCompileStatus } from './components/compilestatus';
import { configure } from './components/configure';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// 设置插件路径等设置
	setContext(context);
	const explorerCommanders = new ExplorerCommanders();
	const explorerDeviceStatus = new ExplorerDeviceStatus();
	const authenticateService = new AuthenticateService();
	const httpService = new HttpService();
	const deviceManager = new DeviceManager();
	const compileManager = new CompileManager();
	const explorerCompileStatus = new ExplorerCompileStatus();
	configure();
	const tmpPath = path.join(getExtensionPath(), 'tmp');
	if (!fs.existsSync(tmpPath)){
		fs.mkdirSync(tmpPath);
	}
	const storagePath = path.join(getExtensionPath(), 'storage');
	if (!fs.existsSync(storagePath)){
		fs.mkdirSync(storagePath);
	}
	console.log('Congratulations, your extension "ustc-fpgaol" is now active!');

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.login', async () => {
			try{
				if(await authenticateService.login(httpService)){
					await deviceManager.updateDeviceStatus(undefined, true, httpService, authenticateService);
					explorerDeviceStatus.updateDeviceStatus(deviceManager.curStatus);
				}
			}
			catch (e: any){
				if (e.name === 'RequestError'){
					Logger.error(`${e.name}: ${e.message}\nPossible Solution: 1. Update your vscode version.\n2. Add "tlsRejectUnauthorized": "0" to settings.json`);
				}
				else{
					Logger.error(e.name + ': ' + e.message);
				}
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.logout', () => {
			authenticateService.logout(httpService);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.welcome', () => {
		vscode.window.showInformationMessage('Welcome to USTC FPGAOL!');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.acquire', async (type: string) => {
			await deviceManager.acquireDevice(type, httpService, authenticateService);
			explorerDeviceStatus.updateDeviceStatus(deviceManager.curStatus);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.release', async (type: string) => {
			await deviceManager.releaseDevice(type, httpService, authenticateService);
			explorerDeviceStatus.updateDeviceStatus(deviceManager.curStatus);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.openDevice', (url: string) => {
			vscode.env.openExternal(vscode.Uri.parse(url));
		})
	);
	// 下载文件，目前通过直接访问网页实现
	// TODO: 独立GUI
	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.download', (url: string) => {
			vscode.env.openExternal(vscode.Uri.parse(url));
		})
	);
	// 访问一个网页
	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.visit', (url: string) => {
			vscode.env.openExternal(vscode.Uri.parse(url));
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.refreshDeviceStatus', async () => {
			await deviceManager.updateDeviceStatus(undefined, true, httpService, authenticateService);
			explorerDeviceStatus.updateDeviceStatus(deviceManager.curStatus);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.compile', async (uri:vscode.Uri) => {
			var jobid: string | undefined = await vscode.window.showInputBox({
                prompt: "提交：输入Job ID",
                placeHolder: "",
                ignoreFocusOut: true
            });
			if (jobid === undefined) {return; }
			await compileManager.compile(jobid, uri.fsPath, httpService);
			await compileManager.queryAll(httpService);
			explorerCompileStatus.updateCompileStatus(compileManager.curStatus);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.compileFolder', async (uri:vscode.Uri) => {
			var zipPath = path.join(getExtensionPath(), 'tmp', 'source.zip');
			zipDirectory(uri.fsPath, zipPath);
			var jobid: string | undefined = await vscode.window.showInputBox({
                prompt: "提交：输入Job ID",
                placeHolder: "",
                ignoreFocusOut: true
            });
			if (jobid === undefined) {return; }
			await compileManager.compile(jobid, zipPath, httpService);
			await compileManager.queryAll(httpService);
			explorerCompileStatus.updateCompileStatus(compileManager.curStatus);
		})
	);

	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('ustc-fpgaol.queryCompileStatus', async () => {
	// 		var jobid: string | undefined = await vscode.window.showInputBox({
    //             prompt: "查询：输入Job ID",
    //             placeHolder: "",
    //             ignoreFocusOut: true
    //         });
	// 		if (jobid === undefined) {
	// 			return;
	// 		}
	// 		compileManager.query(jobid, httpService);
	// 	})
	// );

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.refreshCompileStatus', async () => {
			await compileManager.queryAll(httpService);
			explorerCompileStatus.updateCompileStatus(compileManager.curStatus);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.addJob', async () => {
			var jobid: string | undefined = await vscode.window.showInputBox({
                prompt: "Add",
                placeHolder: "",
                ignoreFocusOut: true
            });
			if (jobid === undefined) {
				return;
			}
			compileManager.addFile(jobid);
			await compileManager.queryAll(httpService);
			explorerCompileStatus.updateCompileStatus(compileManager.curStatus);
		})
	);
	// 每隔一定时间更新状态栏
	setInterval(async () => {
		await compileManager.queryAll(httpService);
		explorerCompileStatus.updateCompileStatus(compileManager.curStatus);
	}, 5000);	// 单位毫秒
	setInterval(async () => {
		if(await authenticateService.isAuthenticated(httpService)){
			await deviceManager.updateDeviceStatus(undefined, true, httpService, authenticateService);
			explorerDeviceStatus.updateDeviceStatus(deviceManager.curStatus);
		}
	}, 5000);
	vscode.window.registerTreeDataProvider('Commands', explorerCommanders);
	vscode.window.registerTreeDataProvider('DeviceStatus', explorerDeviceStatus);
	vscode.window.registerTreeDataProvider('CompileStatus', explorerCompileStatus);

}

// this method is called when your extension is deactivated
export function deactivate() {}
