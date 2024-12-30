import {Token, TokenType} from "../type";

export class Syntax {

  private tokens: Token[] = [];

  analysis(tokens: Token | Token[]){
    // S → P S    |  ε
    // P → read ( )          |  id = V   |  print ( V )   |  if M then P E end
    // E → elseif M then P E |  else P    |  ε
    // V → A B
    // A → C K
    // B → + A B  | - A B    | ε
    // C → id     | number   | string | ( V )
    // K → * C K  |  / C K   |  ε
    // M → V N
    // N → == V   |  > V     |  >= V  |  <= V  |  < V
    if (!Array.isArray(tokens)){
      tokens = [tokens];
    }
    this.tokens = tokens;
    return this.S();
  }

  private exceptOpenParenthesis(){
    if (this.tokens[0].type != TokenType.OP){
      this.throwError('Expected "("', this.tokens[0]);
    }
    this.tokens.shift();
  }

  private exceptCloseParenthesis(){
    if (this.tokens[0].type != TokenType.CP){
      this.throwError('Expected ")"', this.tokens[0]);
    }
    this.tokens.shift();
  }

  private exceptThen(){
    if (this.tokens[0].type != TokenType.THEN){
      this.throwError('Expected "then"', this.tokens[0]);
    }
    this.tokens.shift();
  }

  private exceptElse(){
    if (this.tokens[0].type != TokenType.ELSE){
      this.throwError('Expected "else"', this.tokens[0]);
    }
    this.tokens.shift();
  }

  private exceptElseIf(){
    if (this.tokens[0].type != TokenType.ELSEIF){
      this.throwError('Expected "else if"', this.tokens[0]);
    }
    this.tokens.shift();
  }

  private exceptEnd(){
    if (this.tokens[0].type != TokenType.END){
      this.throwError('Expected "end"', this.tokens[0]);
    }
    this.tokens.shift();
  }

  private throwError(error: string, token: Token) {
    throw new Error(error + ` [${ token.lineNumber }]:[${ token.columnNumber + token.value.toString().length }]`);
  }

  private S(){
    let tokens = this.tokens;
    switch(tokens[0].type){
      case TokenType.READ:
      case TokenType.ID:
      case TokenType.PRINT:
      case TokenType.IF:
        this.P();
        this.S();
        break;
      case TokenType.EXIT:
        return 1
    }
  }

  private P(){
    let tokens = this.tokens;
    switch (tokens[0].type){
      case TokenType.READ:
        tokens.shift();
        this.exceptOpenParenthesis()
        this.exceptCloseParenthesis()
        break;
      case TokenType.ID:
        tokens.shift();
        //TODO


        break;
      case TokenType.PRINT:
        tokens.shift();
        this.exceptOpenParenthesis()
        this.V();
        this.exceptCloseParenthesis()
        break;
      case TokenType.IF:
        tokens.shift();
        this.M();
        this.exceptThen();
        this.P();
        this.E();
        this.exceptEnd();
        break;
      default:
        this.throwError('Unexpected command', tokens[0]);
    }
  }



  private V() {

  }

  private M() {

  }

  private E() {

  }
}