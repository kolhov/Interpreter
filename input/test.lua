
-- testovani global var + function read
start = io.read();

-- testovani local var + mat vyraz
number = 3 + start + 4 - 2 * (start / 1);

-- testovani klic. slov { if, then, end, elseif, else } + operatory { >, == }
-- a funcke print()
if 1 - number  > 10 then
    print("cislo > 10")
elseif number == 10 then
    print("cislo = 10")
else
    print("cislo < 10")
end
