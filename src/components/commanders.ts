// inspired by https://github.com/James-Yu/LaTeX-Workshop/blob/master/src/components/commander.ts
import * as vscode from 'vscode';

export class ExplorerCommanders implements vscode.TreeDataProvider<Command> {
    
    private readonly commands: Command[] = [];

    constructor() {
        this.buildCommander();
    }

    private buildCommander() {
        const Collapsed = vscode.TreeItemCollapsibleState.Collapsed;
        const None = vscode.TreeItemCollapsibleState.None;
        const viewCommand = new Command('Acquire Device', Collapsed, undefined, 'notebook-kernel-select');
        this.commands.push(viewCommand);
        viewCommand.children.push(new Command('FPGAOL 1.0', None, {command: 'ustc-fpgaol.acquire', title: '', arguments: ['type1']}, 'circuit-board'));
        viewCommand.children.push(new Command('FPGAOL 2.0', None, {command: 'ustc-fpgaol.acquire', title: '', arguments: ['type2']}, 'circuit-board'));
        viewCommand.children.push(new Command('ZYBO Linaro', None, {command: 'ustc-fpgaol.acquire', title: '', arguments: ['ZYBO']}, 'circuit-board'));
    }

    getTreeItem(element: Command): vscode.TreeItem {

        const treeItem: vscode.TreeItem = new vscode.TreeItem(element.label, element.collapsibleState);
        treeItem.command = element.command;
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

export class Command {

    public children: Command[] = [];

    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command,
        public readonly codicon?: string
    ) {

    }
}