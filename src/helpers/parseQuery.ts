// https://blog.stevenlevithan.com/archives/parseuri
// MIT License
// https://blog.stevenlevithan.com/
// https://github.com/slevithan

function parseQuery (str:string) {
	let	o:any   = parseQuery.options,
		m:any   = new RegExp(/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/).exec(str),
		uri:any = {},
		i:any   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri['search'] = {};
	uri[o.key[12]].replace(new RegExp(/(?:^|&)([^&=]*)=?([^&]*)/g), function ($0:any, $1:any, $2:any) {
		if ($1) uri['search'][$1] = $2;
	});

	return uri;
};

parseQuery.options = Object.freeze({
	strictMode: false,
	key: Object.freeze(["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"])
});

Object.freeze(parseQuery)

export default parseQuery