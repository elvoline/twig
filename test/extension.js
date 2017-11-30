import twig, {
	extendFunction,
	extendFilter,
} from '../index';

describe('extension', () => {
	it('should be extendable with functions', () => {
		var template = twig({
			'data': `extend {{ reverseFunction('function') }}`,
		});
		
		extendFunction('reverseFunction', (value) => value.split('').reverse().join(''));
		var promise = template
			.render()
			.then((dom) => dom.text());
		
		return expect(promise).to.eventually.equal('extend noitcnuf');
	});
	
	it('should be extendable with filters', () => {
		var template = twig({
			'data': `extend {{ 'filter'|reverseFilter }}`,
		});
		
		extendFilter('reverseFilter', (value) => value.split('').reverse().join(''));
		var promise = template
			.render()
			.then((dom) => dom.text());
		
		return expect(promise).to.eventually.equal('extend retlif');
	});
});
