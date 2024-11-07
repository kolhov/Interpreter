enum TTypSymbolu {
  S_NOTHING,
  S_ENDOFFILE,
  S_SEM,
  S_LPAR,
  S_RPAR,
  S_BEGIN,
  S_END,
  S_CONST,
  S_VAR,
  S_IF,
  S_THEN,
  S_ELSE,
  S_PRINT,
  S_ID,
  S_NUM,
  S_IS,
  S_PLUS,
  S_MINUS,
  S_MUL,
  S_DIV,
  S_EQ,
  S_NEQ,
  S_LESS,
  S_GRT,
  S_LQ,
  S_GQ
}

type TSymbol = {
  typ: TTypSymbolu,
  attrib: string
}

type TVstup = {
  znak: string,          // zpracovávaný °ádek
  cisloRad: number,      // £íslo °ádku ve vstupním souboru
  pozice: number,        // pozice posledního na£teného znaku na °ádku
  konec: boolean         // zde lexikální analyzátor indikuje , ºe celý vstup byl na£ten
}


let symbol: TSymbol;                // práv¥ zpracovávaný symbol na£ítaný lex. analyzátorem
let nazevsouboru: string;           // název zdrojového ( vstupního ) souboru
let soubor: string;                 // otev°ený zdrojový ( vstupní ) soubor
let vstup: TVstup;                  // prom¥nná pro práv¥ na£tený znak ze vstupního souboru
// inicializace , otev°ení vstupního souboru , atd.
// Následující funkci zavoláme vºdy , kdyº p°i lexikální analýze pot°ebujeme dal²í
let znak: string

function dejZnak() {
  while (1) {
    if (feof(soubor)) { // konec souboru
      vstup.konec = true;
      vstup.znak = ' \0 ';
      break;
    }
    vstup.znak = fgetc(soubor);
    if (vstup.znak == '\ n ') {     // konec °ádku
      vstup.cisloRad++;
      vstup.pozice = 0;
      break;
    } else {                        // ani konec souboru , ani konec °ádku
      vstup.znak = vstup.znak;      // p°evod na velké písmeno
      vstup.pozice++;
      break;
    }
  }
  return vstup.znak;
}

while (!vstup.konec && vstup.znak == ' '))
{
  dejZnak(); // posun na vstupu , znak do vstup . znak
}
switch (vstup.znak) {
  ...
  case ' < ':
    dejZnak(); // pot°ebujeme v¥d¥t , co následuje
    switch (vstup.znak) {
      case ' > ':
        symbol.typ = S_NEQ;
        dejZnak();
        break;
      case '= ':
        symbol.typ = S_LQ;
        dejZnak();
        break;
      default :
        symbol.typ = S_LESS;
    }
  ...
  default :
    vypis_chybu(...); // znak , který zde nemá být
}


const
  k_chyba = 9, // chybový stav a koncové stavy :
  k_if = 10,
  k_then = 11,
  k_else = 12,
  k_this = 13,
  pocetStavu = 9, // stavy 0..8
  pocetZnaku = 8; // znaky 0..7
let
  tab
[pocetStavu][pocetZnaku]; // 2D pole pro tabulku p°echod·

dejZnakCislo(); // funkce vrací £ísla podle znak· v záhlaví tabulky

function nactiTabulkuPrechodu() {
  for (let i = 0; i < pocetStavu; i++) {
    for (let j = 0; j < pocetZnaku; j++) {
      tab [i][j] = k_chyba;
      tab [0][0] = 1;
      tab [0][2] = 2;
      tab [0][4] = 5;
      tab [1][1] = k_if;
      tab [2][3] = 3;
      tab [3][0] = 8;
      tab [3][4] = 4;
      tab [4][5] = k_then;
      tab [5][6] = 6;
      tab [6][7] = 7;
      tab [7][4] = k_else;
      tab [8][7] = k_this;
    }
  }
}

function lex_klic_slova(slovo) {
  let stav = 0;
  let delka = slovo.length();
  let poz = 0;

  while ((poz < delka) && (stav != k_chyba)) {
    switch (stav) {
      case 0:
        switch (znak) {
          case 'I ':
            stav = 1;
            break;
          case 'T ':
            stav = 2;
            break;
          case 'E ':
            stav = 5;
            break;
          default :
            stav = k_chyba;
        }
      case 1:
        if (znak == 'F ') stav = k_if; else stav = k_chyba;
        break;
      case 2:
        if (znak == 'H ') stav = 3; else stav = k_chyba;
        break;
      case 3:
        switch (znak) {
          case 'I ':
            stav = 8;
            break;
          case 'E ':
            stav = 4;
            break;
          default :
            stav = k_chyba;
        }
      case 4:
        if (znak == 'N ') stav = k_then; else stav = k_chyba;
        break;
      case 5:
        if (znak == 'L ') stav = 6; else stav = k_chyba;
        break;
      case 6:
        if (znak == 'S ') stav = 7; else stav = k_chyba;
        break;
      case 7:
        if (znak == 'E ') stav = k_else; else stav = k_chyba;
        break;
      case 8:
        if (znak == 'S ') stav = k_this; else stav = k_chyba;
        break;
      default :
        stav = k_chyba;
    } // switch ( stav )
    poz++;
  } // while
  switch (stav) {
    case k_if :
      symbol.typ = S_IF;
      break;
    case k_then :
      symbol.typ = S_THEN;
      break;
    case k_else :
      symbol.typ = S_ELSE;
      break;
    case k_this :
      symbol.typ = S_THIS;
      break;
    default :
      symbol.typ = S_ID; // chyba , tedy p°esn¥ji prom¥nná
  }
  return symbol.typ;
}

// na£te jeden symbol do globální prom¥nné symbol :
function lex() {
  // funkce dejZnak () byla uº volána , v prom¥nné vstup máme p°edna£tený znak
  symbol.attrib = " ";
  while (!vstup.konec && vstup.znak == ' ') // p°esko£íme prázdné znaky
    dejZnak();
  if (vstup.znak >= 'A' && vstup.znak <= 'Z') { // za£íná písmenem ?
    do {
      symbol.attrib += vstup.znak;
      dejZnak();
    } while (vstup.znak >= 'A ' && vstup.znak <= 'Z ') ; // p°íp . p°idejte podtrºítko
    symbol.typ = S_ID;
    lex_klic_slova(symbol.attrib);
  } else if (vstup.znak >= '0 ' && vstup.znak <= '9 ') { // za£íná £íslicí ?
    do {
      symbol.attrib += vstup.znak;
      dejZnak();
    } while (vstup.znak >= '0 ' && vstup.znak <= '9 ') ;
    symbol.typ = S_NUM;
  } else
    switch (vstup.znak) {
      case ' < ': // symbol '<' nebo ' <= ' nebo '<>'
        dejZnak();
        switch (vstup.znak) {
          case' > ':
            dejZnak();
            symbol.typ = S_NEQ; // <>
            break;
          case'= '           :
            dejZnak();
            symbol.typ = S_LQ; // <=
            break;
          default :
            symbol.typ = S_LESS; // <
        }

      ... // podobn¥ v²echny ostatní symboly
      default : ... // o²et°ení chyby
    }
}


const
  k_chyba = 23, k_begin = 25, k_if = 27, k_else = 29,
  k_const = 24, k_end = 26, k_then = 28, k_var = 30, k_print = 31;

const PocetZnaku = 17; // Po£et znak· , ze kterých se skládají klí£ová slova

let tab
[22][PocetZnaku];

function NactiTabulku() {
  for (let i = 0; i < 22; i++) {
    for (let j = 0; j < PocetZnaku; j++) {
      tab [i][j] = k_chybovy;
      tab [0][0] = 1;
      tab [0][1] = 5;
      tab [0][3] = 13;
      tab [0][6] = 7;
      tab [0][9] = 14;
      tab [0][10] = 11;
      tab [0][16] = 19;
      tab [1][1] = 2;
      tab [2][2] = 3;
      tab [3][5] = 4;
      tab [4][4] = 24;
      tab [5][4] = 6;
      tab [5][15] = 17;
      tab [6][5] = 25;
      tab [7][7] = 8;
      tab [8][4] = 9;
      tab [9][8] = 10;
      tab [10][9] = 26;

      tab [11][11] = 12;
      tab [12][12] = 27;
      tab [13][13] = 28;
      tab [14][14] = 15;
      tab [15][1] = 16;
      tab [16][4] = 29;
      tab [17][8] = 18;
      tab [18][1] = 30;
      tab [19][12] = 20;
      tab [20][5] = 21;
      tab [21][4] = 22;
      tab [22][9] = 31;
    }
  }
}

// pokud zn nepat°í do abecedy klí£ových slov , vrátí -1 , jinak vrací index znaku :
function DejCisloZnaku(zn) {
  let Index = " BEGINDCOSTVARFHLP ";
  for (let i = 0; i < PocetZnaku; i++) {
    if (Index [i] == zn) return i;
  }
  return -1;
}

function InitLex() {               // Tato funkce je volána pouze jednou za celý p°eklad
                          // otev°ení vstupního souboru ...
  NactiTabulku();                       // na£teme tabulku p°echod· do prom¥nné tab
  dejZnak();                            // p°edna£teme první znak souboru
}