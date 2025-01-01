import fs from "fs";
import {Lex} from "./transpiler/lexer";
import {Transpiler} from "./transpiler/transpiler";

const filePath = './input/test.notlua';
const fileData = fs.readFileSync(filePath, 'utf8');

let transpiler = new Transpiler();
transpiler.transpile(fileData);

