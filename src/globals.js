/**
 * Global variables module.
 * @module
 */

/**
 * Global variables to be added to render data.
 * @type {Object}
 */

var globals = {};
export default globals;

/**
 * Adds a new global variable.
 * @param {string} - variable name
 * @param {*} - variable value
 * @return {*} The given variable value.
 */

export function addGlobal (key, value) {
	return globals[key] = value;
}

/**
 * Getter for the globals object.
 * @return {Object} The globals object.
 */

export function getGlobals () {
	return globals;
}
