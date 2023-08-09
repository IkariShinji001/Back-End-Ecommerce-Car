const convertArrayObjectToArrayColorsCar = (ArrayObjectColors) => {
  const result = ArrayObjectColors.map((object) => {
    return object.color;
  });
  console.log(result);
  return result;
};

module.exports = {
  convertArrayObjectToArrayColorsCar,
};
