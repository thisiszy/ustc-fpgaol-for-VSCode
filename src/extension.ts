// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ExplorerCommanders } from './components/commanders';
import { HttpService } from "./components/httpservice";
import {AuthenticateService} from './components/authentication';
import { getExtensionPath, setContext } from "./utils/tools";
import * as fs from "fs";
import * as path from "path";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const explorerCommanders = new ExplorerCommanders();
	const authenticateService = new AuthenticateService(explorerCommanders);
	const httpService = new HttpService();
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
		vscode.commands.registerCommand('ustc-fpgaol.login', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
			authenticateService.login(httpService);
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
		vscode.commands.registerCommand('ustc-fpgaol.acquire', (type: string) => {
			vscode.window.showInformationMessage('Acquire ' + type);
		})
	);
	
	vscode.window.registerTreeDataProvider('Commands', explorerCommanders);

}

// this method is called when your extension is deactivated
export function deactivate() {}
