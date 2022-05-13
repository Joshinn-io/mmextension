import * as vscode from 'vscode';
import * as fs from 'fs';
import { SnippetString } from 'vscode';
import { getLocation, MythicLocation } from './location';
import { entities, entityOptions, itemOptions, items } from './manager';

export const getCompletions = (document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) => {
    const snippet = new SnippetString("test");
    const completions: Array<vscode.CompletionItem> = [];
    const location: MythicLocation = getLocation(document);


    switch(location.type) {

        case "Items":
            
            switch(location.key) {
                case "Id":
                    items.forEach(element => {
                        completions.push(new vscode.CompletionItem(element, vscode.CompletionItemKind.Text));
                    });
                    break;
                case "Options":
                    itemOptions.forEach(element => {
                        completions.push(new vscode.CompletionItem(element, vscode.CompletionItemKind.Text));
                    });
                    break;
            }

            break;

        case "Mobs":

            switch(location.key) {
                case "Type":
                    entities.forEach(element => {
                        completions.push(new vscode.CompletionItem(element, vscode.CompletionItemKind.Text));
                    });
                    break;
                case "Options":
                    entityOptions.forEach(element => {
                        completions.push(new vscode.CompletionItem(element, vscode.CompletionItemKind.Text));
                    });
                    break;
            }

            break;

        case "Skills":
            break;
    }

    const completion = new vscode.CompletionItem("Zombie", vscode.CompletionItemKind.Text);
    completion.insertText = snippet;
    return completions;
  };