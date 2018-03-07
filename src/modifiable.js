/**
 * Modifiable string module.
 * @module
 */

export default class modifiable {
	/**
	 * Creates a modifiable pseudo-string.
	 * @param {string=} - the initial value of the string
	 * @constructor
	 */
	
	constructor (value = '') {
		return this.setValue(value);
	}
	
	/**
	 * Data setter function.
	 * @param {string} - key name
	 * @param {*} - data value
	 * @return {this}
	 */
	
	setData (key, value) {
		this[key] = value;
		
		return this;
	}
	
	/**
	 * Data getter function.
	 * @param {string} - key name
	 * @return {*} The previously set data value.
	 */
	
	getData (key) {
		return this[key];
	}
	
	/**
	 * Sets the value of the string.
	 * @param {string} - value of the string
	 * @return {this}
	 */
	
	setValue (value) {
		return this.setData('value', value);
	}
	
	/**
	 * Function called during string concatenation.
	 * @return {string} The value of the string.
	 */
	
	toString () {
		return this.getData('value');
	}
}
