import { LOCALS } from '../local';

// logical
export const or = {
  value: 'or',
  mongooseCode: '$or',
  label: LOCALS.FILTERS.LOGICAL.OR.LABEL,
  info: LOCALS.FILTERS.LOGICAL.OR.INFO
};
export const nor = {
  value: 'nor',
  mongooseCode: '$nor',
  label: LOCALS.FILTERS.LOGICAL.NOR.LABEL,
  info: LOCALS.FILTERS.LOGICAL.NOR.INFO
};
export const not = {
  value: 'not',
  mongooseCode: '$not',
  label: LOCALS.FILTERS.LOGICAL.NOT.LABEL,
  info: LOCALS.FILTERS.LOGICAL.NOT.INFO
};
export const and = {
  value: 'and',
  mongooseCode: '$and',
  label: LOCALS.FILTERS.LOGICAL.AND.LABEL,
  info: LOCALS.FILTERS.LOGICAL.AND.INFO
};
