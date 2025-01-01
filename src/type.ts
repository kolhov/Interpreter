export enum TokenType {
  NUMBER,
  ASSIGN,
  EQ,         // equal
  GT,         // greater
  GT_EQ,
  LESS,
  LESS_EQ,
  PLUS,
  MINUS,
  MULTIPLY,
  DIV,        // divine
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
  OP,         // open parenthesis
  CP,         // close parenthesis
  NOT,
  NOT_EQ,
  ERROR,
  EXIT        // end of the file
}

export interface Token {
  type: TokenType;
  value: string | number;
  lineNumber: number;
  columnNumber: number;
  variable?: varSemantic;
}

export interface varSemantic {
  isInitialized: boolean;
  initIndex: number;
  isModified: boolean;
  varType?: string;
}