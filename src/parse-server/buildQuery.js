const buildQuery = function (defaultParams = {}, searchFields = [], parameters) {
  const { searchValue, limit, sort, skip } = parameters;
  const text = searchValue && searchValue.trim();
  let query;
  if (defaultParams || text || limit || sort || skip) {
    query = { ...defaultParams, count: 1 };
  }
  if (searchFields.length && text && text.length) {
    query = {
      $or: searchFields.map((field) => ({ [field.key]: { $regex: text, $options: 'i' } })),
    };
  }
  if (limit) query.limit = limit;
  if (sort) query.order = sort;
  if (skip) query.skip = skip;

  return query || { count: 1 };
};

export default buildQuery;
