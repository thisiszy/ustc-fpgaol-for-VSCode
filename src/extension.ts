// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ExplorerCommanders } from './components/commanders';
import { HttpService } from "./components/httpservice";
import { AuthenticateService } from './components/authentication';
import { DeviceManager } from './components/devicemanager';
import { getExtensionPath, setContext } from "./utils/tools";
import * as fs from "fs";
import * as path from "path";
import { ExplorerDeviceStatus } from './components/devicestatus';
import { CompileManager } from './components/compilemanager';
import { ExplorerCompileStatus } from './components/compilestatus';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const explorerCommanders = new ExplorerCommanders();
	const explorerDeviceStatus = new ExplorerDeviceStatus();
	const authenticateService = new AuthenticateService(explorerCommanders);
	const httpService = new HttpService();
	const deviceManager = new DeviceManager();
	const compileManager = new CompileManager();
	const explorerCompileStatus = new ExplorerCompileStatus();
	setContext(context);
	var tmpPath = path.join(getExtensionPath(), 'tmp');
	if (!fs.existsSync(tmpPath)){
		fs.mkdirSync(tmpPath);
	}
	console.log('Congratulations, your extension "ustc-fpgaol" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.login', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
			await authenticateService.login(httpService);
			await deviceManager.updateDeviceStatus(undefined, true, httpService);
			explorerDeviceStatus.updateDeviceStatus(deviceManager.curStatus);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.logout', () => {
			authenticateService.logout(httpService);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.welcome', () => {
		vscode.window.showInformationMessage('Welcome!');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.acquire', async (type: string) => {
			await deviceManager.acquireDevice(type, httpService);
			explorerDeviceStatus.updateDeviceStatus(deviceManager.curStatus);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.release', async (type: string) => {
			await deviceManager.releaseDevice(type, httpService);
			explorerDeviceStatus.updateDeviceStatus(deviceManager.curStatus);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.openDevice', (url: string) => {
			vscode.window.showInformationMessage(url);
			vscode.env.openExternal(vscode.Uri.parse(url));
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.refreshDeviceStatus', async () => {
			await deviceManager.updateDeviceStatus(undefined, true, httpService);
			explorerDeviceStatus.updateDeviceStatus(deviceManager.curStatus);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.compile', async (uri:vscode.Uri) => {
			vscode.window.showInformationMessage(uri.fsPath);
			var jobid: string | undefined = await vscode.window.showInputBox({
                prompt: "提交：输入Job ID",
                placeHolder: "",
                ignoreFocusOut: true
            });
			if (jobid === undefined) {
				return;
			}
			compileManager.compile(jobid, uri.fsPath, httpService);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.queryCompileStatus', async () => {
			var jobid: string | undefined = await vscode.window.showInputBox({
                prompt: "查询：输入Job ID",
                placeHolder: "",
                ignoreFocusOut: true
            });
			if (jobid === undefined) {
				return;
			}
			compileManager.query(jobid, httpService);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ustc-fpgaol.refreshCompileStatus', async () => {
			vscode.window.showInformationMessage('refresh CompileStatus!');
		})
	);
	
	vscode.window.registerTreeDataProvider('Commands', explorerCommanders);
	vscode.window.registerTreeDataProvider('DeviceStatus', explorerDeviceStatus);
	vscode.window.registerTreeDataProvider('CompileStatus', explorerCompileStatus);

}

// this method is called when your extension is deactivated
export function deactivate() {}
