import {Token, TokenType} from "../type";

export class Syntax {

  private tokens: Token[] = [];

  analysis(tokens: Token | Token[]){
    // S → P S    |  ε
    // P → read ( )          |  id = V    |  print ( V )   |  if M then P E end
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
      this.throwError('Expected "("');
    }
    this.tokens.shift();
  }

  private exceptCloseParenthesis(){
    if (this.tokens[0].type != TokenType.CP){
      this.throwError('Expected ")"');
    }
    this.tokens.shift();
  }

  private exceptThen(){
    if (this.tokens[0].type != TokenType.THEN){
      this.throwError('Expected "then"');
    }
    this.tokens.shift();
  }

  private exceptElse(){
    if (this.tokens[0].type != TokenType.ELSE){
      this.throwError('Expected "else"');
    }
    this.tokens.shift();
  }

  private exceptElseIf(){
    if (this.tokens[0].type != TokenType.ELSEIF){
      this.throwError('Expected "else if"');
    }
    this.tokens.shift();
  }

  private exceptEnd(){
    if (this.tokens[0].type != TokenType.END){
      this.throwError('Expected "end"');
    }
    this.tokens.shift();
  }

  private throwError(error: string) {
    throw new Error(error + ` [${ this.tokens[0].lineNumber }]:[${ this.tokens[0].columnNumber + this.tokens[0].value.toString().length }]`);
  }

  // S → P S    |  ε
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
      default:
        this.throwError('')
    }
  }

  // P → read ( )     |  id = V    |  print ( V )   |  if M then P E end
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
        this.throwError('Unexpected command');
    }
  }

  private V() {
    this.A();
    this.B();
  }

  private M() {
    this.V();
    this.N();
  }

  // E → elseif M then P E |  else P    |  ε
  private E() {
    let tokens = this.tokens;
    switch (tokens[0].type){
      case TokenType.ELSEIF:
        this.exceptElseIf();
        this.M();
        this.exceptThen();
        this.P();
        this.E();
        break;
      case TokenType.ELSE:
        this.exceptElse();
        this.P();
        break;
      case TokenType.END:
        this.exceptEnd();
        break;
      default:
        this.throwError('Excepted else or end');
    }
  }

  private A() {
    this.C();
    this.K();
  }

  // B → + A B  | - A B    | ε
  private B() {
    let tokens = this.tokens;
    switch (tokens[0].type){
      case TokenType.PLUS:
      case TokenType.MINUS:
        tokens.shift();
        this.A();
        this.B();
    }
  }

  private C() {
    let tokens = this.tokens;
    switch (tokens[0].type){
      case TokenType.ID:
      case TokenType.STRING:
      case TokenType.NUMBER:
        tokens.shift();
        break;
      case TokenType.OP:
        this.exceptOpenParenthesis();
        this.V();
        this.exceptCloseParenthesis();
        break;
      default:
        this.throwError('Unexpected value')
    }
  }

  // K → * C K  |  / C K   |  ε
  private K() {
    let tokens = this.tokens;
    switch (tokens[0].type){
      case TokenType.MULTIPLY:
      case TokenType.DIV:
        tokens.shift();
        this.C();
        this.K();
    }
  }

  // N → == V   |  > V     |  >= V  |  <= V  |  < V
  private N() {
    let tokens = this.tokens;
    switch (tokens[0].type){
      case TokenType.EQ:
      case TokenType.GT:
      case TokenType.GT_EQ:
      case TokenType.LESS_EQ:
      case TokenType.LESS:
        tokens.shift();
        this.V();
        break;
      default:
        this.throwError('Expected comparison operators')
    }
  }
}