import modifiable from '../src/modifiable';

describe('modifiable', () => {
	it('should return the internal value during string concatenation', () => {
		var value = 'moo';
		var mod = new modifiable(value);
		
		return expect('' + mod).to.equal(value);
	});
	
	it('should default the internal value to an empty string', () => {
		var mod = new modifiable();
		
		return expect('' + mod).to.equal('');
	});
});
