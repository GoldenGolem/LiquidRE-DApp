export const isNaN = (value) => {
  var n = Number(value);
  return n !== n;
};

export const safeNumber = (claimedToBeNumber) => {
  if (isNaN(claimedToBeNumber)) {
    return 0;
  } else {
    //other checks for -Infinity/+Infinity ?
    return claimedToBeNumber;
  }
}