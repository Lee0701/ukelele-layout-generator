
File "file"
  = Table

Table "table"
  = _ block:Block { return block }

Block "block"
  = _ "{" list:List _ "}" { return list }

List "list"
  = _ head:Value _ tail:(_ "," _ (Value))* { return [head, ...tail.map((t) => t[3])] } 

Value "value"
  = Symbol
  / String
  / Block
  / ""

String "string"
  = _ "\"" text:([^\s"]+) "\"" { return text.join('') }

Symbol "symbol"
  = _ "@" [A-Za-z!]+ { return text() }

Comment "comment"
  = _ ";;" [^\n]* _

Define "define"
  = _ "#define " [^\n]* _

_ "whitespace"
  = [ \t\n\r]*
