// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ALL } from 'dns';
import { start } from 'repl';
import * as vscode from 'vscode';
import * as YAML from 'yaml';
import { CancellationToken, CompletionContext, CompletionItem, CompletionItemProvider, Hover, HoverProvider, Position, ProviderResult, Range, TextDocument } from 'vscode';
import { getCompletions } from './completion';
import { findDefinition } from './definition';
import { getLocation } from './location';
import { generateData } from './manager';
import { Option } from './types/Option';
const fs = require('fs');
const path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	generateData(context);

	const completionProvider = vscode.languages.registerCompletionItemProvider({ scheme: 'file', pattern: '**' }, {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			return getCompletions(document, position, token, context);
		}
	  });

	const hoverProvider = vscode.languages.registerHoverProvider({scheme: '*', language: '*'}, {
        provideHover(document, position, token) {
            const mdText = new vscode.MarkdownString();
            mdText.appendMarkdown("Hi" + '\n');
            return new vscode.Hover(mdText);
        }
    });

	const definitionProvider = vscode.languages.registerDefinitionProvider({ scheme: 'file', pattern: '**' }, {
		provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
			console.log(keys(document));
			getLocation(document);
			return findDefinition(document, position, token);
		}
	  });

    context.subscriptions.push(completionProvider, hoverProvider, definitionProvider);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function keys(document: vscode.TextDocument) {
	const file = fs.readFileSync(document.uri.fsPath, 'utf8');
	console.log(YAML.parse(file));
	return YAML.parse(file);
}

