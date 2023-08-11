import _ from 'lodash';
import { isAlpha, isAlphaNum, isNum, isWhiteSpace } from './regex';
import { Token, Type } from './types';

export function analyze(code : string) {
  let state=0
  let pos = 0

  let tokens : Token[] = []

  const keywords = ["_Packed","auto","break","case","char","const","continue","default","do","double","else","enum","extern","float","for","goto","if","int","long","register","return","short","signed","sizeof","static","struct","switch","typedef","union","unsigned","void","volatile","while"]

  while (pos < code.length) {
    switch (state) {
      case 0:
        console.log(code[pos], state)
        if(isAlpha(code[pos]) || code[pos] === '_'){
          if(keywords.map((keyword)=>keyword[0]).includes(code[pos]))
            state = 1
          else state = 2
        }
        else if(isNum(code[pos]))
          state = 3
        else if(/^[:!\.%\^+-/]/.test(code[pos])){
          tokens.push({type:Type.OPERATOR, value:code[pos]})
          pos++}
        else if(/^[<>=]/.test(code[pos]))
          state = 4
        else if(/^[&]/.test(code[pos]))
          state = 5
        else if(/^[\|]/.test(code[pos]))
          state = 6
        else if(/^[\*]/.test(code[pos]))
          state = 7
        else if(/^[\(\)\[\]\{\};,]/.test(code[pos])){
          tokens.push({type:Type.PUNCTUATION, value:code[pos]})
          pos++}
        else if(/^["]/.test(code[pos]))
          state = 8
        else if(/^[\']/.test(code[pos]))
          state = 9
        else if(isWhiteSpace(code[pos]))
          state = 0
        else
          throw new Error(`Karakter tidak valid ${code[pos]} pada posisi ${pos}`);

        break;

      case 1: // keyword
        console.log(code[pos], state)
        let pushed = false
        for(let keyword of keywords){
          if(code.slice(pos, pos+keyword.length) === keyword && !(/^[.]/.test(code[pos+keyword.length]))){
            tokens.push({type:Type.KEYWORD, value:keyword})
            pos+=keyword.length
            state = 0
            pushed = true
          }
        }
        if(!pushed)
          state = 2
        break;

      case 2: // identifier
        console.log(code[pos], state)

        let word = ''
        while(code[pos] && isAlphaNum(code[pos]) || code[pos] === '_' || code[pos] === '-' ){
          word += code[pos]
          pos++
        }
        tokens.push({type:Type.IDENTIFIER, value:word})
        state = 0
        break;

      case 3 : // num
        console.log(code[pos], state)

        let num = ''
        let dot = false
        while(code[pos] && (isNum(code[pos]) || (code[pos] === '.'))){
          num += code[pos]
          if(code[pos] === '.')
            if(dot)
              throw new Error(`Karakter tidak valid ${code[pos]} pada posisi ${pos}`);
            else dot = true
          
          pos++
        }
        tokens.push({type:Type.CONSTANT, value:num})
        state = 0
        break;
      
      case 4: // < > =
        console.log(code[pos], state)

        if(isWhiteSpace(code[pos+1]) || !/^[=]/.test(code[pos+1])){
          tokens.push({type:Type.OPERATOR, value:code[pos]})
          state = 0
        }else{
          state = 11
        }
        pos++
        break;
        
      case 5 : // &
        console.log(code[pos], state)

        if(isWhiteSpace(code[pos+1]) || !/^[&]/.test(code[pos+1])){
          tokens.push({type:Type.OPERATOR, value:code[pos]})
          state = 0
        }else{
          state = 12
        }
        pos++
        break;
      
      case 6 : // |
        console.log(code[pos], state)

        if(isWhiteSpace(code[pos+1]) || !/^[\|]/.test(code[pos+1])){
          tokens.push({type:Type.OPERATOR, value:code[pos]})
          state = 0
        }else{
          state = 13
        }
        pos++
        break;

      case 7 : // *
        console.log(code[pos], state)

        if(isWhiteSpace(code[pos+1]) || !/^[\*]/.test(code[pos+1])){
          tokens.push({type:Type.OPERATOR, value:code[pos]})
          state = 0
        }else{
          state = 14
        }
        pos++
        break;

      case 8 : // "
        console.log(code[pos], state)

        let str = ''
        pos++
        while(code[pos] && (code[pos] !== '"' || code[pos-1] === '\\')){
          if(code[pos] === '\\')
            str += code[pos+1]
          else
            str += code[pos]
          pos++
          if(code[pos-1] === '\\')
            pos++
        }
        pos++
        tokens.push({type:Type.LITERAL, value:`"${str}"`})
        state = 0
        break;

      case 9 : // '
        console.log(code[pos], state)

        let char = ''
        pos++
        while(code[pos] && (code[pos] !== "'" || code[pos-1] === '\\')){
          if(code[pos] === '\\')
            char += code[pos+1]
          else
            char += code[pos]
          pos++
          if(code[pos-1] === '\\')
            pos++
        }
        pos++
        tokens.push({type:Type.LITERAL, value:`"${char}"`})
        state = 0
        break;

      
      case 11 : // < > = cont
        console.log(code[pos], state)

        if(/^[=]/.test(code[pos]))
          tokens.push({type:Type.OPERATOR, value:code[pos] + code[pos-1]})
        else
          state = 0
        break;
      
      case 12 : // &
        console.log(code[pos], state)

        if(/^[&]/.test(code[pos]))
          tokens.push({type:Type.OPERATOR, value:code[pos] + code[pos-1]})
        else
          state = 0
        break;

      case 13 : // |
        console.log(code[pos], state)

        if(/^[\|]/.test(code[pos]))
          tokens.push({type:Type.OPERATOR, value:code[pos] + code[pos-1]})
        else
          state = 0
        break;

      case 14 : // *
        console.log(code[pos], state)

        if(/^[\*]/.test(code[pos]))
          tokens.push({type:Type.OPERATOR, value:code[pos] + code[pos-1]})
        else
          state = 0
        break;

      default:
        break;

    }
    if (isWhiteSpace(code[pos]) && state === 0) {
      pos++;
      continue;
    }
  }

  console.log(tokens)
  return tokens
}