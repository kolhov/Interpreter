import {Token, TokenType} from "../type";

export class Lex {
  private columnNumber = 1;
  private lineNumber = 1;
  private currentIndex = 0;
  private fileData: string = '';

  private getChar() {
    let char = this.fileData[this.currentIndex];

    // New line
    if (char == '\n') {
      this.lineNumber++;
      this.columnNumber = 1;
      this.currentIndex++;
      char = this.getChar()
    }

    // Skip spaces
    if (char === ' ') {
      this.currentIndex++;
      this.columnNumber++;
      char = this.getChar()
    }

    // Tabulation
    if (char === '\t') {
      this.currentIndex++;
      this.columnNumber += 4;  // Hacky solution
      char = this.getChar()
    }

    return char;
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isAlpha(char: string): boolean {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_';
  }

  private isAlphanumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }

  private throwError(error: string) {
    console.error(error, ` [${this.lineNumber}]:[${this.columnNumber}]`);
  }

  lexer(fileData: string) {
    this.fileData = fileData;
    let code = fileData;
    let tokens: Token[] = [];
    let fileDataLength = code.length;

    while (this.currentIndex < fileDataLength) {
      let char = this.getChar();
      if (char == undefined) {
        continue;
      }

      if (this.isDigit(char)) {
        let numStr = "";
        while (this.currentIndex < code.length && this.isDigit(code[this.currentIndex])) {
          numStr += code[this.currentIndex];
          this.currentIndex++;
          this.columnNumber++;
        }
        if (this.isAlpha(code[this.currentIndex])) {
          this.throwError('Number can\'t contain alpha symbols');
          tokens.push({type: TokenType.ERROR, value: numStr + code[this.currentIndex], columnNumber: this.columnNumber, lineNumber: this.lineNumber})
          continue;
        }
        tokens.push({type: TokenType.NUMBER, value: parseInt(numStr), columnNumber: this.columnNumber, lineNumber: this.lineNumber});
        continue;
      }

      if (this.isAlpha(char)) {
        let idStr = "";
        while (this.currentIndex < code.length && this.isAlphanumeric(code[this.currentIndex])) {
          idStr += code[this.currentIndex];
          this.currentIndex++;
          this.columnNumber++;
        }

        tokens.push(this.getWordToken(idStr));
        continue;
      }

      // Strings
      if (char === '"') {
        this.currentIndex++; // Skip open "
        this.columnNumber++;
        let str = "";
        while (this.currentIndex < code.length && code[this.currentIndex] !== '"') {
          str += code[this.currentIndex];
          this.currentIndex++;
          this.columnNumber++;
        }
        this.currentIndex++; // Skip closing "
        this.columnNumber++;
        tokens.push({type: TokenType.STRING, value: str, columnNumber: this.columnNumber, lineNumber: this.lineNumber});
        continue;
      }

      // Operators
      if (char === '>') {
        if (this.currentIndex + 1 < code.length && code[this.currentIndex + 1] === '=') {
          tokens.push({type: TokenType.GT_EQ, value: ">=", columnNumber: this.columnNumber, lineNumber: this.lineNumber});
          this.currentIndex += 2;
          this.columnNumber += 2;
        } else {
          tokens.push({type: TokenType.GT, value: char, columnNumber: this.columnNumber, lineNumber: this.lineNumber});
          this.currentIndex++;
          this.columnNumber++;
        }
        continue;
      }

      if (char === '<') {
        if (this.currentIndex + 1 < code.length && code[this.currentIndex + 1] === '=') {
          tokens.push({type: TokenType.LESS_EQ, value: "<=", columnNumber: this.columnNumber, lineNumber: this.lineNumber});
          this.currentIndex += 2;
          this.columnNumber += 2;
        } else {
          tokens.push({type: TokenType.LESS, value: char, columnNumber: this.columnNumber, lineNumber: this.lineNumber});
          this.currentIndex++;
          this.columnNumber++;
        }
        continue;
      }

      if (char === '+') {
        tokens.push({type: TokenType.PLUS, value: char, columnNumber: this.columnNumber, lineNumber: this.lineNumber});
        this.currentIndex++;
        this.columnNumber++;
        continue;
      }

      if (char === '*') {
        tokens.push({type: TokenType.MULTIPLY, value: char, columnNumber: this.columnNumber, lineNumber: this.lineNumber});
        this.currentIndex++;
        this.columnNumber++;
        continue;
      }

      if (char === '/') {
        tokens.push({type: TokenType.DIV, value: char, columnNumber: this.columnNumber, lineNumber: this.lineNumber});
        this.currentIndex++;
        this.columnNumber++;
        continue;
      }

      if (char === '-') {
        // Test for comment
        if (this.currentIndex + 1 < code.length && code[this.currentIndex + 1] === '-') {
          this.currentIndex += 2;
          this.columnNumber += 2;
          let str = "";
          while (this.currentIndex < code.length) {
            if (code[this.currentIndex] == '\r\n' || code[this.currentIndex] == '\r' || code[this.currentIndex] == '\n'){
              break;
            }
            str += code[this.currentIndex];
            this.currentIndex++;
            this.columnNumber++;
          }
          // tokens.push({ type: TokenType.COMMENT, value: str });
        } else {
          tokens.push({type: TokenType.MINUS, value: char, columnNumber: this.columnNumber, lineNumber: this.lineNumber});
          this.currentIndex++;
          this.columnNumber++;
        }
        continue;
      }

      if (char === '(') {
        tokens.push({type: TokenType.OP, value: char, columnNumber: this.columnNumber, lineNumber: this.lineNumber});
        this.currentIndex++;
        this.columnNumber++;
        continue;
      }

      if (char === ')') {
        tokens.push({type: TokenType.CP, value: char, columnNumber: this.columnNumber, lineNumber: this.lineNumber});
        this.currentIndex++;
        this.columnNumber++;
        continue;
      }

      if (char === '!') {
        if (this.currentIndex + 1 < code.length && code[this.currentIndex + 1] === '=') {
          tokens.push({type: TokenType.NOT_EQ, value: "!=", columnNumber: this.columnNumber, lineNumber: this.lineNumber});
          this.currentIndex += 2;
          this.columnNumber += 2;
        } else {
          tokens.push({type: TokenType.NOT, value: char, columnNumber: this.columnNumber, lineNumber: this.lineNumber});
          this.currentIndex++;
          this.columnNumber++;
        }
        continue;
      }

      if (char === '=') {
        // Test for equal '=='
        if (this.currentIndex + 1 < code.length && code[this.currentIndex + 1] === '=') {
          tokens.push({type: TokenType.EQ, value: "==", columnNumber: this.columnNumber, lineNumber: this.lineNumber});
          this.currentIndex += 2;
          this.columnNumber += 2;
        } else {
          tokens.push({type: TokenType.ASSIGN, value: "=", columnNumber: this.columnNumber, lineNumber: this.lineNumber});
          this.currentIndex++;
          this.columnNumber++;
        }
        continue;
      }


      // Exception
      this.throwError(`Unknown symbol`);
      this.currentIndex++;
      this.columnNumber++;
    }
    tokens.push({type: TokenType.EXIT, value: '', columnNumber: this.columnNumber, lineNumber: this.lineNumber})
    return tokens;
  }

  getWordToken(idStr: string) {
    //    0 -> i1 | e2 | t8 | p11 | r15
    //    1 -> f
    //    2 -> l3 | n7
    //    3 -> s4
    //    4 -> e k_else
    // <- k_else -> i6
    //    6 -> f
    //    7 -> d
    //    8 -> h9
    //    9 -> e10
    //    10 -> n
    //    11 -> r12
    //    12 -> i13
    //    13 -> n14
    //    14 -> t
    //    15 -> e16
    //    16 -> a17
    //    17 -> d

    let state = 0;
    const k_else = 22, k_error = 23, k_if = 24, k_elseif = 26, k_end = 27, k_then = 28, k_print = 29, k_read = 30;

    for (let i = 0; i < idStr.length; i++) {
      if (state >= k_error) break;
      switch (state) {
        case 0:
          switch (idStr[i]) {
            case 'i':
              state = 1;
              break;
            case 'e':
              state = 2;
              break;
            case 't':
              state = 8;
              break;
            case 'p':
              state = 11;
              break;
            case 'r':
              state = 15;
              break;
            default:
              state = k_error;
          }
          break;
        case 1:
          if (idStr[i] == 'f') state = k_if; else state = k_error;
          break;
        case 2:
          switch (idStr[i]) {
            case 'l':
              state = 3;
              break;
            case 'n':
              state = 7;
              break;
            default:
              state = k_error;
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
        default:
          state = k_error;
      }
    }

    let token: Token;
    switch (state) {
      case k_if:
        token = {type: TokenType.IF, value: idStr, columnNumber: this.columnNumber, lineNumber: this.lineNumber};
        break;
      case k_else:
        token = {type: TokenType.ELSE, value: idStr, columnNumber: this.columnNumber, lineNumber: this.lineNumber};
        break;
      case k_elseif:
        token = {type: TokenType.ELSEIF, value: idStr, columnNumber: this.columnNumber, lineNumber: this.lineNumber};
        break;
      case k_end:
        token = {type: TokenType.END, value: idStr, columnNumber: this.columnNumber, lineNumber: this.lineNumber};
        break;
      case k_then:
        token = {type: TokenType.THEN, value: idStr, columnNumber: this.columnNumber, lineNumber: this.lineNumber};
        break;
      case k_print:
        token = {type: TokenType.PRINT, value: idStr, columnNumber: this.columnNumber, lineNumber: this.lineNumber};
        break;
      case k_read:
        token = {type: TokenType.READ, value: idStr, columnNumber: this.columnNumber, lineNumber: this.lineNumber};
        break;
      default:
        token = {type: TokenType.ID, value: idStr, columnNumber: this.columnNumber, lineNumber: this.lineNumber};
    }
    return token;
  }
}

