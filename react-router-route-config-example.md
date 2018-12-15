```jxs
import { setRouteConfig } from "redux-admin";
import { createBrowserHistory } from "history";


const history = createBrowserHistory();

const serialize = function(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

const getSerializePathnameAndParams = function(paramsToSet) {
  const pathname = window.location.pathname || "/";
  const query = Object.assign({}, getParams(), paramsToSet);
  const serializeQuery = serialize(query);
  if (serializeQuery.length) return `${pathname}?${serializeQuery}`;
  return pathname;
};

const getParams = function() {
  var pairs = window.location.search.substring(1).split("&"),
    obj = {},
    pair,
    i;

  for (i in pairs) {
    if (pairs[i] === "") continue;

    pair = pairs[i].split("=");
    obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }

  return obj;
};

setRouteConfig({
  onReplaceParams: paramsToSet => {
    debugger;
    const pathname = getSerializePathnameAndParams(paramsToSet);
    history.replace({ pathname });
  },
  onSetParams: paramsToSet => {
    debugger;
    const pathname = getSerializePathnameAndParams(paramsToSet);
    history.push({ pathname });
  },
  onBack: () => history.goBack(),
  goHome: () => history.replace({ pathname: "/" }),
  onGetParams: getParams
});
```