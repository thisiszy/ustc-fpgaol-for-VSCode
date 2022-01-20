// inspired by https://github.com/James-Yu/LaTeX-Workshop/blob/master/src/components/commander.ts
import * as vscode from 'vscode';

export class ExplorerCommanders implements vscode.TreeDataProvider<Command> {
    
    private readonly commands: Command[] = [];
    private _onDidChangeTreeData: vscode.EventEmitter<Command | undefined | null | void> = new vscode.EventEmitter<Command | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Command | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor() {
        this.buildCommander();
    }

    private buildCommander() {
        const Collapsed = vscode.TreeItemCollapsibleState.Collapsed;
        const Expanded = vscode.TreeItemCollapsibleState.Expanded;
        const None = vscode.TreeItemCollapsibleState.None;
        const deviceFolder = new Command('Device Commands', Collapsed, undefined, 'notebook-kernel-select');
        this.commands.push(deviceFolder);
        const fpgaol1Commands = new Command('FPGAOL 1.0', Expanded, undefined, 'circuit-board');
        const fpgaol2Commands = new Command('FPGAOL 2.0', Expanded, undefined, 'circuit-board');
        const fpgaolzyboCommands = new Command('ZYBO Linaro', Expanded, undefined, 'circuit-board');
        deviceFolder.children.push(fpgaol1Commands);
        deviceFolder.children.push(fpgaol2Commands);
        deviceFolder.children.push(fpgaolzyboCommands);
        fpgaol1Commands.children.push(new Command('Acquire', None, {command: 'ustc-fpgaol.acquire', title: '', arguments: ['FPGAOL1']}, 'circuit-board'));
        fpgaol1Commands.children.push(new Command('Release', None, {command: 'ustc-fpgaol.release', title: '', arguments: ['FPGAOL1']}, 'circuit-board'));

        fpgaol2Commands.children.push(new Command('Acquire', None, {command: 'ustc-fpgaol.acquire', title: '', arguments: ['FPGAOL2']}, 'circuit-board'));
        fpgaol2Commands.children.push(new Command('Release', None, {command: 'ustc-fpgaol.release', title: '', arguments: ['FPGAOL2']}, 'circuit-board'));

        fpgaolzyboCommands.children.push(new Command('Acquire', None, {command: 'ustc-fpgaol.acquire', title: '', arguments: ['ZYBO']}, 'circuit-board'));
        fpgaolzyboCommands.children.push(new Command('Release', None, {command: 'ustc-fpgaol.release', title: '', arguments: ['ZYBO']}, 'circuit-board'));
    }

    getTreeItem(element: Command): vscode.TreeItem {

        const treeItem: vscode.TreeItem = new vscode.TreeItem(element.label, element.collapsibleState);
        treeItem.command = element.command;
        treeItem.contextValue = element.label;
        treeItem.iconPath = element.codicon && new vscode.ThemeIcon(element.codicon);

        return treeItem;
    }

    getChildren(element?: Command): Command[] {
        if (!element) {
            return this.commands;
        }

        return element.children;
    }
}

class Command {

    public children: Command[] = [];

    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command,
        public readonly codicon?: string
    ) {

    }
}