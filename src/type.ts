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
  EXIT,        // end of the file
  ENDL
}

export interface Token {
  type: TokenType;
  value: string | number;
  lineNumber: number;
  columnNumber: number;
  idIndex?: number;
}

export interface varSemantic {
  value: string;
  isInitialized: boolean;
  initIndex: number;            // index of first initialization
  isModified: boolean;
  varType?: string;
}
