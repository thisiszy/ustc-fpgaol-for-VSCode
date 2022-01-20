import * as vscode from 'vscode';
import { DEVICE } from '../utils/const';

export class ExplorerDeviceStatus implements vscode.TreeDataProvider<Status> {
    
    private readonly contents: Status[] = [];
    private _onDidChangeTreeData: vscode.EventEmitter<Status | undefined | null | void> = new vscode.EventEmitter<Status | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Status | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor() {
    }

    updateDeviceStatus(deviceConst: any) {
        this.contents.splice(0);
        const Collapsed = vscode.TreeItemCollapsibleState.Collapsed;
        const Expanded = vscode.TreeItemCollapsibleState.Expanded;
        const None = vscode.TreeItemCollapsibleState.None;
        const device1 = new Status(`FPGAOL 1.0 (${deviceConst[DEVICE.FPGAOL1.TYPE]['availableNum']}/${deviceConst[DEVICE.FPGAOL1.TYPE]['totalNum']})`, Expanded, undefined, 'notebook-kernel-select');
        const device2 = new Status(`FPGAOL 2.0 (${deviceConst[DEVICE.FPGAOL2.TYPE]['availableNum']}/${deviceConst[DEVICE.FPGAOL2.TYPE]['totalNum']})`, Expanded, undefined, 'notebook-kernel-select');
        const device3 = new Status(`ZYBO Linaro (${deviceConst[DEVICE.ZYBO.TYPE]['availableNum']}/${deviceConst[DEVICE.ZYBO.TYPE]['totalNum']})`, Expanded, undefined, 'notebook-kernel-select');
        this.contents.push(device1);
        this.contents.push(device2);
        this.contents.push(device3);
        if (deviceConst[DEVICE.FPGAOL1.TYPE]['isAcquired']) {
            device1.children.push(new Status(`Device ID: ${deviceConst[DEVICE.FPGAOL1.TYPE]['totalNum']}`, None, undefined, 'dash'));
            device1.children.push(new Status(`Expire: ${deviceConst[DEVICE.FPGAOL1.TYPE]['expireTime']}`, None, undefined, 'dash'));
            device1.children.push(new Status(`Open Device`, None, {command: 'ustc-fpgaol.openDevice', title: '', arguments: [deviceConst[DEVICE.FPGAOL1.TYPE]['link']]}, 'open-preview'));
        }
        if (deviceConst[DEVICE.FPGAOL2.TYPE]['isAcquired']) {
            device2.children.push(new Status(`Device ID: ${deviceConst[DEVICE.FPGAOL2.TYPE]['totalNum']}`, None, undefined, 'dash'));
            device2.children.push(new Status(`Expire: ${deviceConst[DEVICE.FPGAOL2.TYPE]['expireTime']}`, None, undefined, 'dash'));
            device2.children.push(new Status(`Open Device`, None, {command: 'ustc-fpgaol.openDevice', title: '', arguments: [deviceConst[DEVICE.FPGAOL2.TYPE]['link']]}, 'open-preview'));
        }
        if (deviceConst[DEVICE.ZYBO.TYPE]['isAcquired']) {
            device3.children.push(new Status(`Device ID: ${deviceConst[DEVICE.ZYBO.TYPE]['totalNum']}`, None, {command: 'ustc-fpgaol.acquire', title: '', arguments: ['FPGAOL1']}, 'dash'));
            device3.children.push(new Status(`Expire: ${deviceConst[DEVICE.ZYBO.TYPE]['expireTime']}`, None, undefined, 'dash'));
            device3.children.push(new Status(`Open Device`, None, {command: 'ustc-fpgaol.openDevice', title: '', arguments: [deviceConst[DEVICE.ZYBO.TYPE]['link']]}, 'open-preview'));
        }
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Status): vscode.TreeItem {

        const treeItem: vscode.TreeItem = new vscode.TreeItem(element.label, element.collapsibleState);
        treeItem.command = element.command;
        treeItem.contextValue = element.label;
        treeItem.iconPath = element.codicon && new vscode.ThemeIcon(element.codicon);

        return treeItem;
    }

    getChildren(element?: Status): Status[] {
        if (!element) {
            return this.contents;
        }

        return element.children;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}

class Status {

    public children: Status[] = [];

    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command,
        public readonly codicon?: string
    ) {

    }
}