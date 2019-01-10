// logical
export const or = {
  value: 'or',
  mongooseCode: '$or',
  label: 'Or',
  info:
    'Joins query clauses with a logical OR returns all documents that match the conditions of either clause.'
};
export const nor = {
  value: 'nor',
  mongooseCode: '$nor',
  label: 'Not match',
  info:
    'Joins query clauses with a logical NOR returns all documents that fail to match both clauses.'
};
export const not = {
  value: 'not',
  mongooseCode: '$not',
  label: 'Not',
  info:
    'Inverts the effect of a query expression and returns documents that do not match the query expression.'
};
export const and = {
  value: 'and',
  mongooseCode: '$and',
  label: 'And',
  info:
    'Joins query clauses with a logical AND returns all documents that match the conditions of both clauses.'
};
