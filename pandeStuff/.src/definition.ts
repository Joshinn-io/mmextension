import {
    Position,
    CancellationToken,
    TextDocument,
    Location,
    Range,
    Uri,
    window,
    workspace
  } from 'vscode';
  
  export const findDefinition = (document: TextDocument, position: Position, token: CancellationToken) => {
    try {
      const selectWord = document.getText(document.getWordRangeAtPosition(position));
      const range = new Range(new Position(1, 0), new Position(1, 0));
      const location = new Location(Uri.file(document.uri.path), range);
      return location;
    } catch (err) {
      console.log(`Ooops, fail to provide definitions, now you have chance to contribute https://github.com/kazuooooo/yaml-X 😁`);
      console.error("err", err);
    }
  };