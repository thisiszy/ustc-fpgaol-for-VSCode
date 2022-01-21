import * as vscode from 'vscode';
import { COMPILE_URLS } from '../utils/const';

export class ExplorerCompileStatus implements vscode.TreeDataProvider<Status> {
    
    private readonly contents: Status[] = [];
    private _onDidChangeTreeData: vscode.EventEmitter<Status | undefined | null | void> = new vscode.EventEmitter<Status | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Status | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor() {
    }

    updateCompileStatus(curStatus: Record<string, string> ) {
        this.contents.splice(0);
        const Collapsed = vscode.TreeItemCollapsibleState.Collapsed;
        const Expanded = vscode.TreeItemCollapsibleState.Expanded;
        const None = vscode.TreeItemCollapsibleState.None;
        for (var [key, value] of Object.entries(curStatus)){
            var job = new Status(`${key}`, Collapsed, undefined, 'symbol-constructor');
            this.contents.push(job);
            job.children.push(new Status(`Status: ${value}`, None, undefined, 'dash'));
            if (value === 'SUCCESS'){
                var download = new Status(`Download`, Collapsed, undefined, 'cloud-download');
                job.children.push(download);
                download.children.push(new Status(`bitstream`, None, { command: 'ustc-fpgaol.download', title: 'Download', arguments: [COMPILE_URLS.FILE+key+'/results/top.bit'] }, 'file-binary'));
                download.children.push(new Status(`compiling log`, None, { command: 'ustc-fpgaol.download', title: 'Download', arguments: [COMPILE_URLS.FILE+key+'/compiling.log'] }, 'output'));
                download.children.push(new Status(`timing report`, None, { command: 'ustc-fpgaol.download', title: 'Download', arguments: [COMPILE_URLS.FILE+key+'/timing.rpt'] }, 'output'));
                download.children.push(new Status(`util report`, None, { command: 'ustc-fpgaol.download', title: 'Download', arguments: [COMPILE_URLS.FILE+key+'/results/util.rpt'] }, 'output'));
            }
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