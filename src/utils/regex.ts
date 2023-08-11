export function isAlphaNum(char : string) {
  let alphaReg = new RegExp(/^[a-z]/i);
  let numReg = new RegExp(/^[0-9]/);
  if(alphaReg.test(char) || numReg.test(char)){
    return true
  }else return false
}

export function isAlpha(char : string) {
  let alphaReg = new RegExp(/^[a-z]/i);
  if(alphaReg.test(char)){
    return true
  }else return false
}

export function isNum(char : string) {
  let numReg = new RegExp(/^[0-9]/);
  if(numReg.test(char)){
    return true
  }else return false
}

export function isWhiteSpace(char:string){
  return char === ' ' || char === '\n' || char === '\t'
}