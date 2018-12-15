```jxs
 import  Router  from  'next/router';
 import { setRouteConfig } from  "redux-admin";
 const  serialize  =  function(obj) {
		var  str  = [];
		for (var  p  in  obj)
		if (obj.hasOwnProperty(p)) {
		str.push(encodeURIComponent(p) +  "="  +  encodeURIComponent(obj[p]));
		}
		return  str.join("&");
}

const  getSerializePathnameAndParams  =  function(paramsToSet){
	const  pathname  =  Router.pathname  ||  '/';
	const  query  =  Object.assign({}, Router.query, paramsToSet)
	const  serializeQuery  =  serialize(query)
	if(serializeQuery.length) return  `${pathname}?${serializeQuery}`
	return  pathname
}

setRouteConfig({
	onReplaceParams: (paramsToSet) => {
		const  href  =  getSerializePathnameAndParams(paramsToSet)
		const  as  =  href
		Router.replace(href, as, { shallow:  true })
	},
	onSetParams: (paramsToSet) => {
		const  href  =  getSerializePathnameAndParams(paramsToSet)
		const  as  =  href
		Router.push(href, as, { shallow:  true })
	},
	onBack: () =>  Router.back(),
	goHome: () =>  Router.replace({pathname:  '/'}, { shallow:  true }),
	onGetParams: () =>  Router.query  || {}})
```