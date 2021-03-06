var fs = require('fs');
var path = require("path");
import * as vscode from 'vscode';
import { ExtensionContext, Uri, Webview } from 'vscode';

export let items: Array<string> = [];
export let entities: Array<string> = [];

export let itemOptions: Array<string> = [];
export let entityOptions: Array<string> = [];

let context: vscode.ExtensionContext;

export function generateData(ctx: vscode.ExtensionContext) {
    context = ctx;
    items = readIntoArray('items.txt');
    entities = readIntoArray('entities.txt');

    itemOptions = readIntoArray('item_options.txt');
    entityOptions = readIntoArray('entity_options.txt');
}

/**
* Returns the absolute path to a file located in our misc folder.
*
* @param file The base file name.
* @param context The context of this extension to get its path regardless where it is installed.
*/
function getDataPath(file: string, context: ExtensionContext): string {
    return context.asAbsolutePath(path.join('data', file));
}


function readIntoArray(file: string) {
    const dir = getDataPath(file, context);
    return fs.readFileSync(dir, 'utf8').split(/\r?\n/);
}