import * as path from "path";
import * as vscode from 'vscode';
import * as fs from "fs";
import { LOG_LEVEL } from "./const";

var context: vscode.ExtensionContext;

export function setContext(c: vscode.ExtensionContext) {
  context = c;
}

export function getExtensionPath() {
  return context ? context.extensionPath : path.join(__dirname, '../../');
}

export function getSubscriptions() {
  return context.subscriptions;
}

export function getGlobalState() {
  return context.globalState;
}

export function zipDirectory(sourceDir: string, outPath: string): Promise<void> {
  const archiver = require('archiver');
  const archive = archiver('zip', { zlib: { level: 9 } });
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

const channel = vscode.window.createOutputChannel('FPGAOL');
channel.show(true);

export class Logger{
  public static level: number = LOG_LEVEL.ERROR;
  constructor(){}
  
  public static debug(str: string): void {
    if (Logger.level <= LOG_LEVEL.DEBUG){
      vscode.window.showInformationMessage('DEBUG: ' + str);
    }
    channel.appendLine(`[${new Date().toLocaleString()}] [debug] ${str}`);
  }

  public static info(str: string): void {
    if (Logger.level <= LOG_LEVEL.INFO){
      vscode.window.showInformationMessage(str);
    }
    channel.appendLine(`[${new Date().toLocaleString()}] [info] ${str}`);
  }
  
  public static warn(str: string): void {
    if (Logger.level <= LOG_LEVEL.WARN){
      vscode.window.showWarningMessage(str);
    }
    channel.appendLine(`[${new Date().toLocaleString()}] [warn] ${str}`);
  }
  
  public static error(str: string): void {
    if (Logger.level <= LOG_LEVEL.ERROR){
      vscode.window.showErrorMessage(str);
    }
    channel.appendLine(`[${new Date().toLocaleString()}] [error] ${str}`);
  }
}