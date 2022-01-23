import * as vscode from "vscode";
import { LOG_LEVEL } from "../utils/const";
import { GlobalVars } from "../utils/global";
import { Logger } from "../utils/tools";

export function configure(){
    const config  = vscode.workspace.getConfiguration("ustc-fpgaol");
    const logLevel = config.get('logLevel');
    if (!logLevel){
      Logger.level = LOG_LEVEL.ERROR;
    }
    else if(logLevel === 'info'){
      Logger.level = LOG_LEVEL.INFO;
    }
    else if(logLevel === 'debug'){
      Logger.level = LOG_LEVEL.DEBUG;
    }
    else if(logLevel === 'warn'){
      Logger.level = LOG_LEVEL.WARN;
    }
    else if(logLevel === 'error'){
      Logger.level = LOG_LEVEL.ERROR;
    }
    else if(logLevel === 'silent'){
      Logger.level = LOG_LEVEL.SILENT;
    }
    const cookies: boolean | undefined = config.get('logginWithCookies');
    if (cookies === undefined){
      GlobalVars.logginWithCookies = true;
    }
    else {
      GlobalVars.logginWithCookies = cookies;
    }
}