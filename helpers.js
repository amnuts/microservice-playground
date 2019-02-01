const hasAllProps = function(list, within) {
  list.forEach(function(e) {
    if (!within.hasOwnProperty(e) || within[e] == "") {
      return false;
    }
  });
  return true;
};

const hasAnyProps = function(list, within) {
  let found = false;
  list.forEach(function(e) {
    if (within.hasOwnProperty(e) && within[e]) {
      found = true;
    }
  });
  return found;
};

module.exports = {
  hasAllProps,
  hasAnyProps
};
