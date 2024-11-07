import * as fs from 'fs';
import {Token} from "./type";

const filePath = '../input/test.notlua';

let charNumberInLine = 0;
let lineNumber = 1;
let currentIndex = 0;

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

      keyWord(idStr);
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

    // Operators
    if (char === '>') {
      if (currentIndex + 1 < code.length && code[currentIndex + 1] === '=') {
        tokens.push({ type: "GT_EQ", value: ">=" });
        currentIndex += 2;
        charNumberInLine += 2;
      } else {
        tokens.push({ type: "GT", value: char });
        currentIndex++;
        charNumberInLine++;
        continue;
      }
    }

    if (char === '<') {
      if (currentIndex + 1 < code.length && code[currentIndex + 1] === '=') {
        tokens.push({ type: "LESS_EQ", value: "<=" });
        currentIndex += 2;
        charNumberInLine += 2;
      } else {
        tokens.push({ type: "LESS", value: char });
        currentIndex++;
        charNumberInLine++;
        continue;
      }
    }

    if (char === '+') {
      tokens.push({ type: "PLUS", value: char });
      currentIndex++;
      charNumberInLine++;
      continue;
    }

    if (char === '*') {
      tokens.push({ type: "MULTIPLY", value: char });
      currentIndex++;
      charNumberInLine++;
      continue;
    }

    if (char === '/') {
      tokens.push({ type: "DIV", value: char });
      currentIndex++;
      charNumberInLine++;
      continue;
    }

    if (char === '-') {
      tokens.push({ type: "MINUS", value: char });
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

function keyWord(idStr: string) {
  // 0 -> i1 | e2 | t8 | p11 | r15
  // 1 -> f
  // 2 -> l3 | n7
  // 3 -> s4
  // 4 -> e k_else
  // <- k_else -> i6
  // 6 -> f
  // 7 -> d
  // 8 -> h9
  // 9 -> e10
  // 10 -> n
  // 11 -> r12
  // 12 -> i13
  // 13 -> n14
  // 14 -> t
  // 15 -> e16
  // 16 -> a17
  // 17 -> d18

  let state = 0;
  const k_error = 23, k_if = 24, k_else = 25, k_elseif = 26, k_end = 27, k_then = 28, k_print = 29, k_read = 30;

  for (let i = 0; i < idStr.length; i++) {
    if (state >= k_error) break;
    switch (state) {
      case 0:
        switch (idStr[i]) {
          case 'i': state = 1; break;
          case 'e': state = 2; break;
          case 't': state = 8; break;
          case 'p': state = 11; break;
          case 'r': state = 15; break;
          default: state = k_error;
        }
        break;
      case 1:
        if (idStr[i] == 'f') state = k_if; else state = k_error;
        break;
      case 2:
        switch (idStr[i]) {
          case 'l': state = 3; break;
          case 'n': state = 7; break;
          default: state = k_error;
        }
        break;
      case 3:
        if (idStr[i] == 's') state = 4; else state = k_error;
        break;
      case 4:
        if (idStr[i] == 'e') state = k_else; else state = k_error;
        break;
      case k_else:
        if (idStr[i] == 'i') state = 6; else state = k_error;
        break;
      case 6:
        if (idStr[i] == 'f') state = k_elseif; else state = k_error;
        break;
      case 7:
        if (idStr[i] == 'd') state = k_end; else state = k_error;
        break;
      case 8:
        if (idStr[i] == 'h') state = 9; else state = k_error;
        break;
      case 9:
        if (idStr[i] == 'e') state = 10; else state = k_error;
        break;
      case 10:
        if (idStr[i] == 'n') state = k_then; else state = k_error;
        break;
      case 11:
        if (idStr[i] == 'r') state = 12; else state = k_error;
        break;
      case 12:
        if (idStr[i] == 'i') state = 13; else state = k_error;
        break;
      case 13:
        if (idStr[i] == 'n') state = 14; else state = k_error;
        break;
      case 14:
        if (idStr[i] == 't') state = k_print; else state = k_error;
        break;
      case 15:
        if (idStr[i] == 'e') state = 16; else state = k_error;
        break;
      case 16:
        if (idStr[i] == 'a') state = 17; else state = k_error;
        break;
      case 17:
        if (idStr[i] == 'd') state = k_read; else state = k_error;
        break;
      default: state = k_error;
    }
  }

  switch (state) {
    case k_if:
      tokens.push({ type: "IF", value: idStr }); break;
    case k_else:
      tokens.push({ type: "ELSE", value: idStr }); break;
    case k_elseif:
      tokens.push({ type: "ELSEIF", value: idStr }); break;
    case k_end:
      tokens.push({ type: "END", value: idStr }); break;
    case k_then:
      tokens.push({ type: "THEN", value: idStr }); break;
    case k_print:
      tokens.push({ type: "PRINT", value: idStr }); break;
    case k_read:
      tokens.push({ type: "READ", value: idStr }); break;
    default:
      tokens.push({ type: "ID", value: idStr });
  }
}

