import { Lex } from './lexer'
import { Syntax } from "./SyntaxSemantics";

export class Transpiler {
  private lexer: Lex = new Lex();
  private syntaxer: Syntax = new Syntax();

  transpile(fileData: string){
    const tokens = this.lexer.lexer(fileData);
    const isOk = this.syntaxer.analysis(tokens);
  }
}