import Twig from 'twig';
import $ from 'jquery';
import { getGlobals } from './globals';
import { getTranslations, extendTwig } from './translations';

Twig.extend((Twig) => extendTwig(Twig));

export { extendFunction, extendFilter } from 'twig';

var hooks = [];

export function addHook (hook) {
	return hooks = hooks.concat(hook);
}

export default function (options) {
	var promise = new Promise((resolve) => {
		var template = Twig.twig(Object.assign({}, options, {
			'load': resolve,
		}));
		
		if (template.render) {
			resolve(template);
		}
	});
	
	return {
		'promise': promise,
		'render': (data) => {
			return Promise
				.all([
					promise,
					getTranslations(),
				])
				.then(([template]) => template.render(Object.assign({}, getGlobals(), data), {}, true))
				.then((data) => {
					var nodes = $($.parseHTML(data));
					hooks.forEach((hook) => hook(nodes));
					return nodes;
				});
		},
	};
}
