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

export default function (...args) {
	var template = Twig.twig(...args);
	var renderer = template.render;
	
	template.render = function (data) {
		return getTranslations()
			.then(() => renderer.call(template, Object.assign({}, getGlobals(), data), {}, true))
			.then((data) => {
				var nodes = $($.parseHTML(data));
				hooks.forEach((hook) => hook(nodes));
				return nodes;
			});
	};
	
	return template;
}
