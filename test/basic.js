import $ from 'jquery';
import twig, {
	renderer,
	addHook,
} from '../index';

describe('basic functionality', () => {
	it('should render the template', () => {
		var template = twig({
			'data': `it renders`,
		});
		
		var promise = template
			.render({})
			.then((dom) => dom.text());
		
		return expect(promise).to.eventually.equal('it renders');
	});
	
	it('should have renderer as a named export', () => {
		var template = renderer({
			'data': `it renders`,
		});
		
		var promise = template
			.render({})
			.then((dom) => dom.text());
		
		return expect(promise).to.eventually.equal('it renders');
	});
	
	it('should substitute the variable', () => {
		var template = twig({
			'data': `it renders {{ foo }}`,
		});
		
		var promise = template
			.render({
				'foo': 'bar',
			})
			.then((dom) => dom.text());
		
		return expect(promise).to.eventually.equal('it renders bar');
	});
	
	it('should run added hooks with the generated DOM', () => {
		var template = twig({
			'data': `it renders`,
		});
		
		var spy = sinon.spy();
		addHook(spy);
		
		var promise = template
			.render()
			.catch()
			.then((dom) => dom.text());
		
		return promise.then(() => expect(spy).to.have.been.calledWith(sinon.match.instanceOf($)));
	});
	
	it('should not crash if translations are not set yet', () => {
		var template = twig({
			'data': `it renders {% trans %}even without translations{% endtrans %}`,
		});
		
		var promise = template
			.render()
			.catch()
			.then((dom) => dom.text());
		
		return expect(promise).to.eventually.equal('it renders even without translations');
	});
});
