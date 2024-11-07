import * as fs from 'fs';
import {Token} from "./type";

const filePath = '../input/test.lua';

let charNumberInLine = 0;
let lineNumber = 1;
let currentIndex = 0;
let currentStav = 0;

const fileData = fs.readFileSync(filePath, 'utf8');
const tokens = lexer(fileData);


/*
Definition block
*/
function getChar(){
  let char = fileData[currentIndex];

  // New line
  if (char == '\r\n' || char == '\r' || char == '\n') {
    lineNumber++;
    charNumberInLine = 0;
    char = getNextChar()
  }

  // Skip tab and spaces
  if (char === ' ') {
    char = getNextChar()
  }
  if ( char === '\t'){
    charNumberInLine += 4;  //
    char = getNextChar()
  }

  return char;
}

function getNextChar(){
  charNumberInLine++;
  currentIndex++;
  return getChar();
}

function isDigit(char: string): boolean {
  return char >= '0' && char <= '9';
}

function isAlpha(char: string): boolean {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_';
}

function isAlphanumeric(char: string): boolean {
  return isAlpha(char) || isDigit(char);
}

function lexer(code: string){
  let tokens: Token[] = [];
  let fileDataLength = code.length;

  while (currentIndex < fileDataLength) {
    let char = getChar();

    if (isDigit(char)) {
      let numStr = "";
      while (currentIndex < code.length && isDigit(code[currentIndex])) {
        numStr += code[currentIndex];
        currentIndex++;
        charNumberInLine++;
      }
      tokens.push({ type: "NUMBER", value: parseInt(numStr) });
      continue;
    }

    if (isAlpha(char)) {
      let idStr = "";
      while (currentIndex < code.length && isAlphanumeric(code[currentIndex])) {
        idStr += code[currentIndex];
        currentIndex++;
        charNumberInLine++;
      }

      // TODO klic slovo
      if (idStr === "if") {
        tokens.push({ type: "IF", value: idStr });
      } else if (idStr === "elseif") {
        tokens.push({ type: "ELSEIF", value: idStr });
      } else if (idStr === "else") {
        tokens.push({ type: "ELSE", value: idStr });
      } else if (idStr === "then") {
        tokens.push({ type: "THEN", value: idStr });
      } else if (idStr === "print") {
        tokens.push({ type: "PRINT", value: idStr });
      } else if (idStr === "end") {
        tokens.push({ type: "END", value: idStr });
      } else {
        tokens.push({ type: "ID", value: idStr });
      }
      continue;
    }

    // Strings
    if (char === '"') {
      currentIndex++; // Skip open "
      charNumberInLine++;
      let str = "";
      while (currentIndex < code.length && code[currentIndex] !== '"') {
        str += code[currentIndex];
        currentIndex++;
        charNumberInLine++;
      }
      currentIndex++; // Skip closing "
      charNumberInLine++;
      tokens.push({ type: "STRING", value: str });
      continue;
    }

    // Операторы
    if (char === '>') {
      tokens.push({ type: "GT", value: char });
      currentIndex++;
      charNumberInLine++;
      continue;
    }

    if (char === '(') {
      tokens.push({ type: "OP", value: char });
      currentIndex++;
      charNumberInLine++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: "CP", value: char });
      currentIndex++;
      charNumberInLine++;
      continue;
    }

    if (char === '=') {
      // Test for equal '=='
      if (currentIndex + 1 < code.length && code[currentIndex + 1] === '=') {
        tokens.push({ type: "EQ", value: "==" });
        currentIndex += 2;
        charNumberInLine += 2;
      } else {
        tokens.push({ type: "ASSIGN", value: "=" });
        currentIndex++;
        charNumberInLine++;
      }
      continue;
    }

    // Exception
    tokens.push({ type: "UNKNOWN", value: `Error on ${lineNumber}:${currentIndex + 1}, char: ${char}` });
    currentIndex++;
    charNumberInLine++;
  }


  return tokens;
}

