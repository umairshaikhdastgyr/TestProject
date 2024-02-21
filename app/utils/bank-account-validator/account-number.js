"use strict";

module.exports = function(value) {
  const isNumber = Number.isInteger(parseInt(value));
  return {
    isValid: isNumber && value.length >= 4 && value.length <= 17,
    isPotentiallyValid: isNumber && value.length > 0 && value.length <= 17
  };
};
