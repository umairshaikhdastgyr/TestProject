
module.exports = function (n) {
  const isNumber = Number.isInteger(parseInt(n));

  let c = 0;
  let isValid = false;
  if (!isNumber) {
    return {
      // return an object telling whether its valid and if not, why.
      isValid,
      errorMsg: 'Invalid bank routing number.',
    };
  }
  n = n ? n.match(/\d/g).join('') : 0; // get just digits
  if (n && n.length == 9) {
    // don't waste energy totalling if its not 9 digits
    for (let i = 0; i < n.length; i += 3) {
      // total the sums
      c
        += parseInt(n.charAt(i), 10) * 3
        + parseInt(n.charAt(i + 1), 10) * 7
        + parseInt(n.charAt(i + 2), 10);
    }
    isValid = c != 0 && c % 10 == 0; // check if multiple of 10
  }

  return {
    // return an object telling whether its valid and if not, why.
    isValid,
    errorMsg:
      n.length != 9
        ? 'Rounting number must be 9 digits'
        : !isValid
          ? 'Invalid bank routing number.'
          : '', // determine the error message
  };
};
