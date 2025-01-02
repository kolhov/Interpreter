import {Token, TokenType, varSemantic} from "../type";

export class Generator {
  private currentIndex = 0;

  // Naive JavaScript code generator
  generateJS(tokens: Token[], varTable: varSemantic[]) {
    let code = '';
    let index = this.currentIndex;

    while (tokens.length > index) {
      if (tokens[index].type == TokenType.NUMBER) {
        code += `${tokens[index].value}`;
        index++;
      }
      if (tokens[index].type == TokenType.ASSIGN) {
        code += ` ${tokens[index].value} `;
        index++;
      }
      if (tokens[index].type == TokenType.EQ) {
        code += ` ${tokens[index].value} `;
        index++;
      }
      if (tokens[index].type == TokenType.GT) {
        code += ` ${tokens[index].value} `;
        index++;
      }
      if (tokens[index].type == TokenType.GT_EQ) {
        code += ` ${tokens[index].value} `;
        index++;
      }
      if (tokens[index].type == TokenType.LESS) {
        code += ` ${tokens[index].value} `;
        index++;
      }
      if (tokens[index].type == TokenType.LESS_EQ) {
        code += ` ${tokens[index].value} `;
        index++;
      }
      if (tokens[index].type == TokenType.PLUS) {
        code += ` ${tokens[index].value} `;
        index++;
      }
      if (tokens[index].type == TokenType.MINUS) {
        code += ` ${tokens[index].value} `;
        index++;
      }
      if (tokens[index].type == TokenType.MULTIPLY) {
        code += ` ${tokens[index].value} `;
        index++;
      }
      if (tokens[index].type == TokenType.DIV) {
        code += ` ${tokens[index].value} `;
        index++;
      }
      if (tokens[index].type == TokenType.IF) {
        code += `if (`;
        index++;
      }
      if (tokens[index].type == TokenType.ELSEIF) {
        code += `} else if (`;
        index++;
      }
      if (tokens[index].type == TokenType.ELSE) {
        code += `} else {`;
        index++;
      }
      if (tokens[index].type == TokenType.THEN) {
        code += `) {`;
        index++;
      }
      if (tokens[index].type == TokenType.ID) {
        // @ts-ignore
        let varSemantic = varTable[tokens[index].idIndex];
        if (varSemantic.initIndex == index) {
          if (varSemantic.isModified) {
            code += 'let ';
          } else {
            code += 'const ';
          }
        }

        code += `${tokens[index].value}`;
        index++;
      }
      if (tokens[index].type == TokenType.STRING) {
        code += `"${tokens[index].value}"`;
        index++;
      }
      if (tokens[index].type == TokenType.END) {
        code += `}`;
        index++;
      }
      if (tokens[index].type == TokenType.OP) {
        code += `${tokens[index].value}`;
        index++;
      }
      if (tokens[index].type == TokenType.CP) {
        code += `${tokens[index].value}`;
        index++;
      }
      if (tokens[index].type == TokenType.NOT) {
        code += ` ${tokens[index].value}`;
        index++;
      }
      if (tokens[index].type == TokenType.PRINT) {
        code += `console.log`;
        index++;
      }
      if (tokens[index].type == TokenType.READ) {
        code += `prompt`;
        index++;
      }
      if (tokens[index].type == TokenType.NOT_EQ) {
        code += ` ${tokens[index].value} `;
        index++;
      }
      if (tokens[index].type == TokenType.END) {
        code += `}`;
        index++;
      }
      if (tokens[index].type == TokenType.ENDL) {
        code += `\n`;
        index++;
      }
      if (tokens[index].type == TokenType.EXIT) {
        break;
      }
    }
    return code;
  }

}