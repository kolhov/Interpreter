import {Token, TokenType, varSemantic} from "../type";

export class Syntax {

  private tokens: Token[] = [];
  private varTable: varSemantic[] = [];
  private currentIndex: number = 0;

  analysis(tokens: Token | Token[]){
    // S → P S    |  ε
    // P → id = V            |  print ( V )   |  if M then P E end
    // E → elseif M then P E |  else P    |  ε
    // V → A B
    // A → C K
    // B → + A B  | - A B    | ε
    // C → id     | number   | string | ( V )  | read ( )
    // K → * C K  |  / C K   |  ε
    // M → V N
    // N → == V   |  > V     |  >= V  |  <= V  |  < V
    if (!Array.isArray(tokens)){
      tokens = [tokens];
    }
    this.tokens = tokens;
    this.currentIndex = 0;
    this.S();
    return { tokens: this.tokens, varTable: this.varTable};
  }

  private exceptOpenParenthesis(){
    if (this.tokens[this.currentIndex].type != TokenType.OP){
      this.throwError('Expected "("');
    }
    this.currentIndex++;
  }

  private exceptCloseParenthesis(){
    if (this.tokens[this.currentIndex].type != TokenType.CP){
      this.throwError('Expected ")"');
    }
    this.currentIndex++;
  }

  private exceptThen(){
    if (this.tokens[this.currentIndex].type != TokenType.THEN){
      this.throwError('Expected "then"');
    }
    this.currentIndex++;
  }

  private exceptElse(){
    if (this.tokens[this.currentIndex].type != TokenType.ELSE){
      this.throwError('Expected "else"');
    }
    this.currentIndex++;
  }

  private exceptElseIf(){
    if (this.tokens[this.currentIndex].type != TokenType.ELSEIF){
      this.throwError('Expected "else if"');
    }
    this.currentIndex++;
  }

  private exceptEnd(){
    if (this.tokens[this.currentIndex].type != TokenType.END){
      this.throwError('Expected "end"');
    }
    this.currentIndex++;
  }

  private exceptEqual(){
    if (this.tokens[this.currentIndex].type != TokenType.ASSIGN){
      this.throwError('Expected "="');
    }
    this.currentIndex++;
  }

  private throwError(error: string) {
    throw new Error(error + ` [${ this.tokens[this.currentIndex].lineNumber }]:[${
      this.tokens[this.currentIndex].columnNumber + this.tokens[this.currentIndex].value.toString().length }] Token index: ${this.currentIndex}`);
  }

  // S → P S    |  ε
  private S(){
    let tokens = this.tokens;
    switch(tokens[this.currentIndex].type){
      case TokenType.READ:
      case TokenType.ID:
      case TokenType.PRINT:
      case TokenType.IF:
        this.P();
        this.S();
        break;
      case TokenType.EXIT:
        break;
      default:
        this.throwError('Unexpected symbol')
    }
  }

  // P → read ( )     |  id = V    |  print ( V )   |  if M then P E end
  private P(){
    let tokens = this.tokens;
    switch (tokens[this.currentIndex].type){
      case TokenType.READ:
        this.currentIndex++;
        this.exceptOpenParenthesis();
        this.exceptCloseParenthesis();
        break;
      case TokenType.ID:
        let idIndex = this.resolveIdIndex(tokens[this.currentIndex]);
        if (this.varTable[idIndex].isInitialized){
          this.varTable[idIndex].isModified = true;
        } else {
          this.varTable[idIndex].isInitialized = true;
          this.varTable[idIndex].initIndex = this.currentIndex;
        }
        this.currentIndex++;
        this.exceptEqual();
        this.V();
        break;
      case TokenType.PRINT:
        this.currentIndex++;
        this.exceptOpenParenthesis()
        this.V();
        this.exceptCloseParenthesis()
        break;
      case TokenType.IF:
        this.currentIndex++;
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
    switch (tokens[this.currentIndex].type){
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
        this.throwError('Excepted else, else if or end');
    }
  }

  private A() {
    this.C();
    this.K();
  }

  // B → + A B  | - A B    | ε
  private B() {
    let tokens = this.tokens;
    switch (tokens[this.currentIndex].type){
      case TokenType.PLUS:
      case TokenType.MINUS:
        this.currentIndex++;
        this.A();
        this.B();
    }
  }

  private C() {
    let tokens = this.tokens;
    switch (tokens[this.currentIndex].type){
      case TokenType.ID:
        if (!this.varTable[this.resolveIdIndex(tokens[this.currentIndex])].isInitialized){
          this.throwError('Variable have to be initialized')
        }
      case TokenType.STRING:
      case TokenType.NUMBER:
        this.currentIndex++;
        break;
      case TokenType.READ:
        this.currentIndex++;
        this.exceptOpenParenthesis();
        this.exceptCloseParenthesis();
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
    switch (tokens[this.currentIndex].type){
      case TokenType.MULTIPLY:
      case TokenType.DIV:
        this.currentIndex++;
        this.C();
        this.K();
    }
  }

  // N → == V   |  > V     |  >= V  |  <= V  |  < V
  private N() {
    let tokens = this.tokens;
    switch (tokens[this.currentIndex].type){
      case TokenType.EQ:
      case TokenType.GT:
      case TokenType.GT_EQ:
      case TokenType.LESS_EQ:
      case TokenType.LESS:
        this.currentIndex++;
        this.V();
        break;
      default:
        this.throwError('Expected comparison operators')
    }
  }

  private resolveIdIndex(token: Token) {
    let id = this.varTable.findIndex(x => x.value == token.value);
    if (id === -1){
      // If variable is not in variable table. create one
      id = this.varTable.push({
        value: token.value,
        isInitialized: false,
        initIndex: -1,
        isModified: false
      } as varSemantic) - 1;
    }

    this.tokens[this.currentIndex].idIndex = id;
    return id;
  }
}