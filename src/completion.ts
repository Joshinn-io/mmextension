
import * as vscode from 'vscode';
import * as fs from 'fs';
import { SnippetString } from 'vscode';
import { getLocation, MythicLocation } from './location';
import { entities, entityOptions, itemOptions, items } from './manager';
import { Option } from './types/Option';

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
                    console.log("Case type");
                    entities.types.forEach((element: string) => {
                        completions.push(new vscode.CompletionItem(element, vscode.CompletionItemKind.Text));
                    });
                    break;
                case "Options":
                    if(location.option !== undefined){
                        entityOptions.options.forEach((element: Option) => {
                            if(element.option === location.option){
                                element.values.forEach((value: string) => {
                                    completions.push(new vscode.CompletionItem(value, vscode.CompletionItemKind.Text));
                                });
                            }
                        });
                        break;
                    }
                    entityOptions.options.forEach((element: Option) => {
                        completions.push(new vscode.CompletionItem(element.option, vscode.CompletionItemKind.Text));
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