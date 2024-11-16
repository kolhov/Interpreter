import fs from "fs";
import {Lex} from "./lexer";

const filePath = './input/test.notlua';
const fileData = fs.readFileSync(filePath, 'utf8');

let lexer = new Lex(fileData);
let tokens = lexer.lexer()

fs.writeFileSync('./output/test-res.json', JSON.stringify(tokens, null, 2));
console.log(tokens);