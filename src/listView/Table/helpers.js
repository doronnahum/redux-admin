export const buildColumnFilterFromData = function (data, key) {
  if (data) {
    return data.map((item) => ({ text: item[key], value: item[key] }));
  }
};

export const getMinTableWidth = function (columns) {
  let value = 0;
  if (columns) {
    columns.forEach((item) => {
      if (item.width) {
        value += (item.width || 100);
      }
    });
  }
  return value;
};
