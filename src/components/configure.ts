import * as vscode from "vscode";
import { LOG_LEVEL } from "../utils/const";
import { Logger } from "../utils/tools";

export function configure(){
    const config  = vscode.workspace.getConfiguration("ustc-fpgaol");
    const level = config.get('logLevel');
    if (!level){
      Logger.level = LOG_LEVEL.ERROR;
    }
    else if(level === 'info'){
      Logger.level = LOG_LEVEL.INFO;
    }
    else if(level === 'debug'){
      Logger.level = LOG_LEVEL.DEBUG;
    }
    else if(level === 'warn'){
      Logger.level = LOG_LEVEL.WARN;
    }
    else if(level === 'error'){
      Logger.level = LOG_LEVEL.ERROR;
    }
    else if(level === 'silent'){
      Logger.level = LOG_LEVEL.SILENT;
    }
}