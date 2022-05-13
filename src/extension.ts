// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ALL } from 'dns';
import { start } from 'repl';
import * as vscode from 'vscode';
import { CancellationToken, CompletionContext, CompletionItem, CompletionItemProvider, Hover, HoverProvider, Position, ProviderResult, Range, TextDocument } from 'vscode';
import { Option } from './types/Option';
const fs = require('fs');
const path = require('path');

const mobTypes = require('./data/mobTypes.json');
const options = require('./data/options.json');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "mmextension" is now active!');

	context.subscriptions.push(vscode.languages.registerHoverProvider('yaml', new MMHoverProvider()));
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider('yaml', new MMMechanicCompletionItemProvider(), "{"));
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider('yaml', new MMCompletionItemProvider(), " ", ":"));


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('mmextension.createBoilerplate', () => {


	// 	if(!vscode.workspace.workspaceFolders){
	// 		return vscode.window.showErrorMessage("Please open a project first!");
	// 	}

	// 	// const folderPath = vscode.workspace.workspaceFolders[0].uri.toString().split(":")[1];
	// 	const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

	// 	const htmlContent = `<!DOCTYPE html>
	// 		<html lang="en">
	// 		<head>
 	// 		 <meta charset="UTF-8" />
 	// 		 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 	// 			 <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  	// 			<title>Document</title>
  	// 			<link rel="stylesheet" href="app.css" />
	// 				</head>
	// 				<body>
  	// 			<script src="app.js"></script>
	// 			</body>
	// 	</html>`;

	// 	fs.writeFile(path.join(folderPath, 'index.html'), htmlContent, (err: any) => {
	// 		if (err) {
	// 		  return vscode.window.showErrorMessage('Failed to create boilerplate file!');
	// 		}
	// 		vscode.window.showInformationMessage('Created boilerplate files');
	// 	  });

		
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from MMExtension!');
	// });

	// context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
class MMMechanicCompletionItemProvider implements CompletionItemProvider {
	public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {
		return null;
	}
}

class MMCompletionItemProvider implements CompletionItemProvider {
	public provideCompletionItems(document: TextDocument, position: Position, token: vscode.CancellationToken, context: CompletionContext): ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {
		//Flow needs to check if you're on an inline option like TYPE before running the getYamlKey to move back 2 spaces and up to check for your key.
		let spacedAlready = false;
		const returnArray: any[] = [];

		let range = document.getWordRangeAtPosition(new Position(position.line, position.character - 1));

		if(range === undefined){
			range = document.getWordRangeAtPosition(new Position(position.line, position.character - 2));
			spacedAlready = true;
		}

		let word = document.getText(range);

		if(word === "Type" || word === "type"){
			mobTypes.types.forEach((type: string) => {
				if(!spacedAlready){
					type = " " + type;
				}
				const item = new vscode.CompletionItem(type);
				returnArray.push(item);
			}, this);

			return returnArray;
		}

		while(range === undefined){
			console.log("Range going into undefined.");
			range = document.getWordRangeAtPosition(new Position(position.line - 1, position.character));
		}

		word = document.getText(range);

		if(word === "Options"){
			console.log("Autocompleting options");
			console.log(options.options);
			options.options.forEach((option: Option) => {
				const item = new vscode.CompletionItem(option.option);
				returnArray.push(item);
			});
			
			return returnArray;
		}

		let yamlKey = getYAMLKey(document, range, position);

		if(yamlKey === "Options"){
			console.log("Autocompleting options");
			console.log(options.options);
			options.options.forEach((option: Option) => {
				const item = new vscode.CompletionItem(option.option);
				returnArray.push(item);
			});
			
			return returnArray;	
		}
		
	}
}
class MMHoverProvider implements HoverProvider {
    public provideHover(
        document: TextDocument, position: Position, token: CancellationToken){

			const range = document.getWordRangeAtPosition(position);
			const word = document.getText(range);

			if(!word.startsWith('mm')){
				return;
			}

			console.log("Word is: " + word);
			console.log("Range is: " + range); 
			const markdown = new vscode.MarkdownString(`<span style="color:#fff;background-color:#666;">&nbsp;&nbsp;&nbsp;NASA code follows:&nbsp;&nbsp;&nbsp;</span>`);
			markdown.isTrusted = true;
			markdown.supportHtml = true;
			console.log("hovering");
			return new vscode.Hover(markdown);
    }
}

function getYAMLKey(document: TextDocument, range: Range, position: Position): string {
	console.log("Range going in ");

	const line = position.line;
	let startingChar = range.start.character;
	startingChar -= 2;

	let newPosition = new Position(line - 1, startingChar);

	while(document.getWordRangeAtPosition(newPosition) === undefined){
		newPosition = new Position(newPosition.line - 1, startingChar);
	}
	
	const newRange = document.getWordRangeAtPosition(newPosition);

	console.log(document.getText(newRange));

	return document.getText(newRange);

}

