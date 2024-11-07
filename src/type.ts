export type TokenType =
  | "NUMBER"
  | "ASSIGN"
  | "EQ"
  | "GT"
  | "IF"
  | "ELSEIF"
  | "ELSE"
  | "THEN"
  | "PRINT"
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