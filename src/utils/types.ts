export enum Type {
  LITERAL = 'LITERAL',
  OPERATOR = 'OPERATOR',
  PUNCTUATION = 'PUNCTUATION',
  IDENTIFIER = 'IDENTIFIER',
  CONSTANT = 'CONSTANT',
  KEYWORD = 'KEYWORD',
}

export interface Token {
  type: string;
  value: string;
}