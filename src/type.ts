export enum TokenType {
  NUMBER,
  ASSIGN,
  EQ,
  GT,
  GT_EQ,
  LESS,
  LESS_EQ,
  PLUS,
  MINUS,
  MULTIPLY,
  DIV,
  IF,
  ELSEIF,
  ELSE,
  THEN,
  PRINT,
  READ,
  ID,
  STRING,
  END,
  UNKNOWN,
  OP,
  CP,
  NOT,
  NOT_EQ,
  ERROR
}

export interface Token {
  type: TokenType;
  value: string | number;
}