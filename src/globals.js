var globals = {};

export function addGlobal (key, value) {
	return globals[key] = value;
}

export function getGlobals () {
	return globals;
}

export default globals;
