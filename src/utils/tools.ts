import * as path from "path";
import * as vscode from 'vscode';
import * as fs from "fs";

var context: vscode.ExtensionContext;

export function setContext(c: vscode.ExtensionContext) {
    context = c;
}

export function getExtensionPath() {
    return context ? context.extensionPath : path.join(__dirname, '../../') ;
}

export function getSubscriptions() {
    return context.subscriptions;
}

export function getGlobalState() {
    return context.globalState;
}

export function zipDirectory(sourceDir: string, outPath: string): Promise<void> {
    const archiver = require('archiver');
    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = fs.createWriteStream(outPath);
  
    return new Promise((resolve, reject) => {
      archive
        .directory(sourceDir, false)
        .on('error', (err: any) => reject(err))
        .pipe(stream)
      ;
  
      stream.on('close', () => resolve());
      archive.finalize();
    });
  }