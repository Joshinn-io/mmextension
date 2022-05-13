import * as vscode from 'vscode';
import * as fs from 'fs';
import * as YAML from 'yaml';

import {getLocation} from './location';
import { findDefinition } from './definition';
import { getCompletions } from './completion';
import { generateData } from './manager';

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

export function deactivate() {
}

function keys(document: vscode.TextDocument) {
	const file = fs.readFileSync(document.uri.fsPath, 'utf8');
	console.log(YAML.parse(file));
	return YAML.parse(file);
}