/**
   * createPointer- return pointer
   */
export const createPointer = function (schemaName, objectId) {
  return {
    className: schemaName,
    objectId,
    __type: 'Pointer',
  };
};
