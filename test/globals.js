import twig, {
	addGlobal,
} from '../index';

describe('globals', () => {
	it('should be able to set global variable and use it in the template', () => {
		var template = twig({
			'data': `global {{ globalVariable }}`,
		});
		
		addGlobal('globalVariable', 'foobar');
		var promise = template
			.render()
			.then((dom) => dom.text());
		
		return expect(promise).to.eventually.equal('global foobar');
	});
});
