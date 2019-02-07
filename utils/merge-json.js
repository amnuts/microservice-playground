/*
 * Jacob Fricke
 * https://github.com/jacob418/node_json-merge
 */

var jsonC = {}.constructor;

var isJSON = function(json) {
  return json && json.constructor === jsonC;
};

exports.isJSON = isJSON;

var cloneJSON = function(data) {
  return mergeJSON({}, data);
};

exports.cloneJSON = cloneJSON;

var mergeJSON = function(json1, json2) {
  var result = null;
  if (isJSON(json2)) {
    result = {};
    if (isJSON(json1)) {
      for (var key in json1) {
        if (isJSON(json1[key]) || Array.isArray(json1[key])) {
          result[key] = cloneJSON(json1[key]);
        } else {
          result[key] = json1[key];
        }
      }
    }

    for (var key in json2) {
      if (isJSON(json2[key]) || Array.isArray(json2[key])) {
        result[key] = mergeJSON(result[key], json2[key]);
      } else {
        result[key] = json2[key];
      }
    }
  } else if (Array.isArray(json1) && Array.isArray(json2)) {
    result = json1;

    for (var i = 0; i < json2.length; i++) {
      if (result.indexOf(json2[i]) === -1) {
        result[result.length] = json2[i];
      }
    }
  } else {
    result = json2;
  }

  return result;
};

exports.mergeJSON = mergeJSON;
