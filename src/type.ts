export type TokenType =
  | "NUMBER"
  | "ASSIGN"
  | "EQ"
  | "GT"
  | "LESS"
  | "PLUS"
  | "MINUS"
  | "MULTIPLY"
  | "DIV"
  | "IF"
  | "ELSEIF"
  | "ELSE"
  | "THEN"
  | "PRINT"
  | "READ"
  | "ID"
  | "STRING"
  | "END"
  | "UNKNOWN"
  | "OP"
  | "CP";

export interface Token {
  type: TokenType;
  value: string | number;
}