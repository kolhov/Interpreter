import { Lex } from './lexer'
import { Syntax } from "./SyntaxSemantics";
import {Generator} from "./jsFactory";
import fs from "fs";

export class Transpiler {
  private lexer: Lex = new Lex();
  private syntaxer: Syntax = new Syntax();
  private generator: Generator = new Generator();

  transpile(fileData: string){
    let tokens = this.lexer.lexer(fileData);
    console.log(`Lexical analysis : OK \n`)
    fs.writeFileSync('./output/test-tokens.json', JSON.stringify(tokens, null, 2));

    const result = this.syntaxer.analysis(tokens);
    tokens = result.tokens;
    const varTable = result.varTable;
    fs.writeFileSync('./output/test-tokens-with-ids.json', JSON.stringify(tokens, null, 2));
    fs.writeFileSync('./output/test-variable-table.json', JSON.stringify(varTable, null, 2));

    let code = this.generator.generateJS(tokens, varTable);

    fs.writeFileSync('./output/outJs.js', code);
  }
}