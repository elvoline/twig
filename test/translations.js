import twig, {
	setTranslations,
	hashCode,
} from '../index';

describe('translations', () => {
	describe('setTranslations()', () => {
		it('should default to english plural settings', () => {
			var template = twig({
				'data': `translate {% trans %}single{% plural amountOf %}double{% endtrans %}`,
			});
			
			var promise = template
				.render({
					'amountOf': 2,
				})
				.then((dom) => dom.text());
			
			return expect(promise).to.eventually.equal('translate double');
		});
		
		it('should not crash on transforming blank translation data', () => {
			var promise = setTranslations();
			
			return promise
				.catch()
				.then((data) => {
					expect(data).to.have.property('plural').that.is.an('object');
					expect(data).to.have.property('translations').that.is.an('object');
					expect(data.plural).to.have.property('forms').that.is.a('number');
					expect(data.plural).to.have.property('expression').that.is.a('function');
					expect(data.translations).to.eql({
						'map': {},
					});
				});
		});
		
		it('should transform valid translation data', () => {
			var promise = setTranslations({
				'plural': {
					'forms': 2,
					'expression': 'n != 1',
				},
				'translations': {
					'map': {
						[hashCode(JSON.stringify('foo'))]: JSON.stringify('bar'),
						[hashCode(JSON.stringify('value and {{ var }}'))]: JSON.stringify('moo and {{ var }}'),
						[hashCode(JSON.stringify('single'))]: JSON.stringify(['singularized', 'pluralized']),
						[hashCode(JSON.stringify('single and {{ var }}'))]: JSON.stringify(['singularized and {{ var }}', 'pluralized and {{ var }}']),
					},
				},
			});
			
			return promise
				.catch()
				.then((data) => {
					expect(data).to.have.property('plural').that.is.an('object');
					expect(data).to.have.property('translations').that.is.an('object');
					expect(data.plural).to.have.property('forms').that.is.a('number');
					expect(data.plural).to.have.property('expression').that.is.a('function');
					expect(data.translations).to.eql({
						'map': {
							[hashCode(JSON.stringify('foo'))]: 'bar',
							[hashCode(JSON.stringify('value and {{ var }}'))]: 'moo and {{ var }}',
							[hashCode(JSON.stringify('single'))]: [
								'singularized',
								'pluralized',
							],
							[hashCode(JSON.stringify('single and {{ var }}'))]: [
								'singularized and {{ var }}',
								'pluralized and {{ var }}',
							],
						},
					});
				});
		});
	});
	
	describe('basic translation', () => {
		it('should render trans filter', () => {
			var template = twig({
				'data': `translate {{ 'foo'|trans }}`,
			});
			
			var promise = template
				.render()
				.then((dom) => dom.text());
			
			return expect(promise).to.eventually.equal('translate bar');
		});
		
		it('should render trans filter (n/a)', () => {
			var template = twig({
				'data': `translate {{ 'non-existent'|trans }}`,
			});
			
			var promise = template
				.render()
				.then((dom) => dom.text());
			
			return expect(promise).to.eventually.equal('translate non-existent');
		});
		
		it('should render trans tag', () => {
			var template = twig({
				'data': `translate {% trans %}foo{% endtrans %}`,
			});
			
			var promise = template
				.render()
				.then((dom) => dom.text());
			
			return expect(promise).to.eventually.equal('translate bar');
		});
		
		it('should render trans tag (n/a)', () => {
			var template = twig({
				'data': `translate {% trans %}non-existent{% endtrans %}`,
			});
			
			var promise = template
				.render()
				.then((dom) => dom.text());
			
			return expect(promise).to.eventually.equal('translate non-existent');
		});
	});
	
	describe('using a variable', () => {
		it('should render trans tag containing a variable', () => {
			var template = twig({
				'data': `translate {% trans %}value and {{ var }}{% endtrans %}`,
			});
			
			var promise = template
				.render({
					'var': 'value',
				})
				.then((dom) => dom.text());
			
			return expect(promise).to.eventually.equal('translate moo and value');
		});
		
		it('should render trans tag containing a variable (n/a)', () => {
			var template = twig({
				'data': `translate {% trans %}non-existent and {{ var }}{% endtrans %}`,
			});
			
			var promise = template
				.render({
					'var': 'value',
				})
				.then((dom) => dom.text());
			
			return expect(promise).to.eventually.equal('translate non-existent and value');
		});
	});
	
	describe('plural form', () => {
		it('should render plural trans tag (singular)', () => {
			var template = twig({
				'data': `translate {% trans %}single{% plural amountOf %}double{% endtrans %}`,
			});
			
			var promise = template
				.render({
					'amountOf': 1,
				})
				.then((dom) => dom.text());
			
			return expect(promise).to.eventually.equal('translate singularized');
		});
		
		it('should render plural trans tag (singular - n/a)', () => {
			var template = twig({
				'data': `translate {% trans %}singles{% plural amountOf %}doubles{% endtrans %}`,
			});
			
			var promise = template
				.render({
					'amountOf': 1,
				})
				.then((dom) => dom.text());
			
			return expect(promise).to.eventually.equal('translate singles');
		});
		
		it('should render plural trans tag (plural)', () => {
			var template = twig({
				'data': `translate {% trans %}single{% plural amountOf %}double{% endtrans %}`,
			});
			
			var promise = template
				.render({
					'amountOf': 2,
				})
				.then((dom) => dom.text());
			
			return expect(promise).to.eventually.equal('translate pluralized');
		});
		
		it('should render plural trans tag (plural - n/a)', () => {
			var template = twig({
				'data': `translate {% trans %}singles{% plural amountOf %}doubles{% endtrans %}`,
			});
			
			var promise = template
				.render({
					'amountOf': 2,
				})
				.then((dom) => dom.text());
			
			return expect(promise).to.eventually.equal('translate doubles');
		});
		
		it('should render non-plural trans tag with singular translation', () => {
			var template = twig({
				'data': `translate {%trans %}single{% endtrans %}`,
			});
			
			var promise = template
				.render()
				.then((dom) => dom.text());
			
			return expect(promise).to.eventually.equal('translate singularized');
		});
	});
	
	describe('plural form using a variable', () => {
		it('should render plural trans tag containing a variable (singular)', () => {
			var template = twig({
				'data': `translate {% trans %}single and {{ var }}{% plural amountOf %}double and {{ var }}{% endtrans %}`,
			});
			
			var promise = template
				.render({
					'amountOf': 1,
					'var': 'value',
				})
				.then((dom) => dom.text());
			
			return expect(promise).to.eventually.equal('translate singularized and value');
		});
		
		it('should render plural trans tag containing a variable (singular - n/a)', () => {
			var template = twig({
				'data': `translate {% trans %}singles and {{ var }}{% plural amountOf %}doubles and {{ var }}{% endtrans %}`,
			});
			
			var promise = template
				.render({
					'amountOf': 1,
					'var': 'value',
				})
				.then((dom) => dom.text());
			
			return expect(promise).to.eventually.equal('translate singles and value');
		});
		
		it('should render plural trans tag containing a variable (plural)', () => {
			var template = twig({
				'data': `translate {% trans %}single and {{ var }}{% plural amountOf %}double and {{ var }}{% endtrans %}`,
			});
			
			var promise = template
				.render({
					'amountOf': 2,
					'var': 'value',
				})
				.then((dom) => dom.text());
			
			return expect(promise).to.eventually.equal('translate pluralized and value');
		});
		
		it('should render plural trans tag containing a variable (plural - n/a)', () => {
			var template = twig({
				'data': `translate {% trans %}singles and {{ var }}{% plural amountOf %}doubles and {{ var }}{% endtrans %}`,
			});
			
			var promise = template
				.render({
					'amountOf': 2,
					'var': 'value',
				})
				.then((dom) => dom.text());
			
			return expect(promise).to.eventually.equal('translate doubles and value');
		});
	});
});
