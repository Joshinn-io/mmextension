/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import * as fs from 'fs';

enum LocationType {
    Items,
    Mobs,
    Skills
}

export class MythicLocation {
    public type: string | undefined; // What the file is
    public id: string | undefined; // Internal name of the object
    public key: string | undefined; // Last not indented key
    public option: string | undefined; // Last indented key
    public value: string | undefined; // Value of the key
    public skill: string | undefined; // Skill at the line
    public attribute: string | undefined; // Attribute at the cursor
    public line: string | undefined; // Line at the cursor
}

//TODO - Add support for multi line completion. Mob options are a great example.

export const getLocation = (document: vscode.TextDocument)  => {

    const mL = new MythicLocation();

    // Type
    for (const i of document.uri.path.split("/").reverse()) {
        if(LocationType[i as keyof typeof LocationType] !== undefined) {
            mL.type = i;
            break;
        }
    }

    let editor = vscode.window.activeTextEditor;

    let file;
    if(editor !== undefined){
        file = editor.document.getText();
    }
    // let file = fs.readFileSync(document.uri.fsPath, 'utf8');
    let fileLines;
    if(file !== undefined){
        fileLines = file.split(/\r?\n/);
    }

    if(editor) {
        let cursorLinePos = editor.selection.active.line;
        let line = document.lineAt(cursorLinePos);
        if(fileLines !== undefined) {
            fileLines = fileLines.slice(0, cursorLinePos+1);
        }

        // Line, Skill, Attributes
        tryGetLineData(mL, line.text, editor.selection.active.character);

        // Value, Option, Key, ID
        tryGetSectionData(mL, fileLines);
    } else{
        console.log("No editor");
    }
    return mL;

};

function tryGetLineData(mythicLoc: MythicLocation, line: string, cursorChar: number) {
    if(mythicLoc.skill===undefined && line.split("-").length-1>0) {
        mythicLoc.skill = line.replace("-", "").split("{")[0].trim();
        mythicLoc.line = line;

        if(line.split("{").length-1>0) {
            let preCursorLine = line.slice(0, cursorChar);
            let attributesLine = preCursorLine.split("{")[1];
            if(attributesLine.split(";").length-1>0) {
                attributesLine = attributesLine.split(";")[1];
            }
            mythicLoc.attribute = attributesLine.split("=")[0];
        }
    }
}

function tryGetSectionData(mythicLoc: MythicLocation, fileLines: string[] | undefined) {
    if(fileLines !== undefined){
        for(let fileLine in fileLines.reverse()) {
            
            fileLine = fileLines[fileLine].trimEnd();
            console.log("File Line: " + fileLine);
            const lineDivs = fileLine.split("-").length-1;
            const lineColons = fileLine.split(":").length-1;
            const lineEndChar = fileLine.charAt(fileLine.length-1);

            const keySpaces = fileLine.split(":")[0].split(" ").length-1;
            const keyValue = fileLine.split(":")[1];

            console.log("keySpaces: " + keySpaces);
            console.log("lineDivs: " + lineDivs);

            if(mythicLoc.key===undefined && mythicLoc.option===undefined && keySpaces>=4 && lineDivs===0 && lineColons>0) {
                console.log("Hitting first IF statement");
                mythicLoc.option = fileLine.split(":")[0].trim();
                mythicLoc.value = keyValue.trim();
            }
            if(mythicLoc.key===undefined && keySpaces===2 && lineDivs===0) {
                mythicLoc.key = fileLine.split(":")[0].trim();
                console.log("Hitting second IF statement");
                if(mythicLoc.value===undefined && keyValue) {
                    console.log("Hitting third IF statement");
                    mythicLoc.value = keyValue.trim();
                }
            }
            if(mythicLoc.id===undefined && keySpaces===0 && lineEndChar===":") {
                console.log("Hitting fourth IF statement");
                mythicLoc.id = fileLine.slice(0, fileLine.length-1);
                break;
            }
        }
        console.log("Key at end: " + mythicLoc.key);
        console.log(mythicLoc);
    }
}