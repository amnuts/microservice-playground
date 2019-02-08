/*
 * Some of this from Jacob Fricke
 * https://github.com/jacob418/node_json-merge
 */

let jsonC = {}.constructor;

let isJSON = function(json) {
  return json && json.constructor === jsonC;
};

let cloneJSON = function(data) {
  return mergeJSON({}, data);
};

let mergeJSON = function(json1, json2) {
  let result = null;
  if (isJSON(json2)) {
    result = {};
    if (isJSON(json1)) {
      for (let key in json1) {
        if (isJSON(json1[key]) || Array.isArray(json1[key])) {
          result[key] = cloneJSON(json1[key]);
        } else {
          result[key] = json1[key];
        }
      }
    }
    for (let key in json2) {
      if (isJSON(json2[key]) || Array.isArray(json2[key])) {
        result[key] = mergeJSON(result[key], json2[key]);
      } else {
        result[key] = json2[key];
      }
    }
  } else if (Array.isArray(json1) && Array.isArray(json2)) {
    result = json1;
    for (let i = 0; i < json2.length; i++) {
      if (result.indexOf(json2[i]) === -1) {
        result[result.length] = json2[i];
      }
    }
  } else {
    result = json2;
  }

  return result;
};

let mergeSpecifications = function() {
  let merged = {};
  for (let s = 0; s < arguments.length; s++) {
    let spec = arguments[s];
    if (spec.hasOwnProperty("servers")) {
      let servers = arguments[s].servers;
      Object.keys(spec.paths).forEach(p => {
        Object.keys(spec.paths[p]).forEach(v => {
          if (!spec.paths[p][v].hasOwnProperty("servers")) {
            spec.paths[p][v].servers = servers;
          }
        });
      });
    }
    merged = mergeJSON(merged, spec);
  }
  return merged;
};

module.exports = {
  isJSON,
  cloneJSON,
  mergeJSON,
  mergeSpecifications
};
