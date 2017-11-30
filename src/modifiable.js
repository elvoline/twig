export default class modifiable {
	constructor (value) {
		return this.setValue(value);
	}
	setData (key, value) {
		this[key] = value;
		
		return this;
	}
	getData (key) {
		return this[key];
	}
	setValue (value) {
		this.value = value;
		
		return this;
	}
	toString () {
		return this.value;
	}
}
