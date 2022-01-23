import * as vscode from 'vscode';

export class GlobalVars {
    public static statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    public static logginWithCookies: boolean;
}