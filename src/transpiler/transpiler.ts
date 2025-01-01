import { Lex } from './lexer'
import { Syntax } from "./SyntaxSemantics";

export class Transpiler {
  private lexer: Lex = new Lex();
  private syntaxer: Syntax = new Syntax();

  transpile(fileData: string){
    let tokens = this.lexer.lexer(fileData);
    tokens = this.syntaxer.analysis(tokens);
  }
}