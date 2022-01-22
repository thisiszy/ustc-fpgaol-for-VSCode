// inspired by https://github.com/James-Yu/LaTeX-Workshop/blob/master/src/components/commander.ts
import * as vscode from 'vscode';
import { DOWNLOAD_FILE_URL, FPGAOL_URL } from '../utils/const';

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
        const deviceFolder = new Command('Device Commands', Expanded, undefined, 'notebook-kernel-select');
        this.commands.push(deviceFolder);
        const fpgaol1Commands = new Command('FPGAOL 1.0', Collapsed, undefined, 'circuit-board');
        const fpgaol2Commands = new Command('FPGAOL 2.0', Collapsed, undefined, 'circuit-board');
        const fpgaolzyboCommands = new Command('ZYBO Linaro', Collapsed, undefined, 'circuit-board');
        const downloadCommands = new Command('Download Center', Collapsed, undefined, 'cloud-download');
        deviceFolder.children.push(fpgaol1Commands);
        deviceFolder.children.push(fpgaol2Commands);
        deviceFolder.children.push(fpgaolzyboCommands);
        this.commands.push(downloadCommands);
        this.commands.push(new Command('Visit our HomePage', None, {command: 'ustc-fpgaol.visit', title: 'FPGAOL homapage', arguments: [FPGAOL_URL]}, 'home'));
        fpgaol1Commands.children.push(new Command('Acquire', None, {command: 'ustc-fpgaol.acquire', title: '', arguments: ['FPGAOL1']}, 'debug-start'));
        fpgaol1Commands.children.push(new Command('Release', None, {command: 'ustc-fpgaol.release', title: '', arguments: ['FPGAOL1']}, 'debug-stop'));

        fpgaol2Commands.children.push(new Command('Acquire', None, {command: 'ustc-fpgaol.acquire', title: '', arguments: ['FPGAOL2']}, 'debug-start'));
        fpgaol2Commands.children.push(new Command('Release', None, {command: 'ustc-fpgaol.release', title: '', arguments: ['FPGAOL2']}, 'debug-stop'));

        fpgaolzyboCommands.children.push(new Command('Acquire', None, {command: 'ustc-fpgaol.acquire', title: '', arguments: ['ZYBO']}, 'debug-start'));
        fpgaolzyboCommands.children.push(new Command('Release', None, {command: 'ustc-fpgaol.release', title: '', arguments: ['ZYBO']}, 'debug-stop'));

        const downloadVivadoCommands = new Command('Vivado', Collapsed, undefined, undefined);
        const downloadExampleCommands = new Command('Example Projects', Collapsed, undefined, undefined);
        const downloadXDCCommands = new Command('Constraint File', Collapsed, undefined, undefined);
        downloadCommands.children.push(downloadVivadoCommands);
        downloadCommands.children.push(downloadExampleCommands);
        downloadCommands.children.push(downloadXDCCommands);

        // 下载区选项
        downloadXDCCommands.children.push(new Command('FPGAOL 1(xdc)', None, {command: 'ustc-fpgaol.download', title: '', arguments: [DOWNLOAD_FILE_URL.CONSTRAINT.XDCFPGAOL1]}, 'output'));
        downloadXDCCommands.children.push(new Command('FPGAOL 2(ucf)', None, {command: 'ustc-fpgaol.download', title: '', arguments: [DOWNLOAD_FILE_URL.CONSTRAINT.XDCFPGAOL2]}, 'output'));
        downloadExampleCommands.children.push(new Command('Example Bitstream Files(zip)', None, {command: 'ustc-fpgaol.download', title: '', arguments: [DOWNLOAD_FILE_URL.EXAMPLE.BIT]}, 'output'));
        downloadExampleCommands.children.push(new Command('Example Vivado Projects(zip)', None, {command: 'ustc-fpgaol.download', title: '', arguments: [DOWNLOAD_FILE_URL.EXAMPLE.VIVADO]}, 'output'));
        downloadExampleCommands.children.push(new Command('Example ISE Projects(zip)', None, {command: 'ustc-fpgaol.download', title: '', arguments: [DOWNLOAD_FILE_URL.EXAMPLE.ISE]}, 'output'));
        downloadVivadoCommands.children.push(new Command('Vivado win-linux(tgz)', None, {command: 'ustc-fpgaol.download', title: '', arguments: [DOWNLOAD_FILE_URL.VIVADO.VIVADO]}, 'output'));
        downloadVivadoCommands.children.push(new Command('ISE linux(tar)', None, {command: 'ustc-fpgaol.download', title: '', arguments: [DOWNLOAD_FILE_URL.VIVADO.ISE_LINUX]}, 'output'));
        downloadVivadoCommands.children.push(new Command('ISE win(iso)', None, {command: 'ustc-fpgaol.download', title: '', arguments: [DOWNLOAD_FILE_URL.VIVADO.ISE_WIN]}, 'output'));
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