/**
 * Twig renderer.
 * @module
 */

import Twig from 'twig';
import $ from 'jquery';
import {
	assign,
} from 'lodash';
import { getGlobals } from './globals';
import { getTranslations, extendTwig } from './translations';

Twig.extend((Twig) => extendTwig(Twig));

export { extendFunction, extendFilter } from 'twig';

/**
 * Array containing hooks to be called with the rendered nodes.
 * @type {Array.<Function>}
 */

var hooks = [];

/**
 * Adds a new render hook.
 * @param {Function} - hook function
 * @return {Array.<Function>} The array containing hooks.
 */

export function addHook (hook) {
	return hooks = hooks.concat(hook);
}

/**
 * Rendering function.
 * @callback renderFunction
 * @param {Object=} data - plain object containing data to pass to the template while rendering
 * @return {external:Promise.<external:jQuery>} A promise resolving to the rendered jQuery nodes.
 */

/**
 * Twig renderer.
 * @typedef {Object} twigRenderer
 * @property {renderFunction} render - template rendering function
 */

/**
 * Creates a new twig renderer.
 * @param {Object} - options to pass to twig
 * @return {twigRenderer} Twig renderer.
 */

export default function (options) {
	var promise;
	function deferParse (resolve) {
		var template = Twig.twig(assign({}, options, {
			'load': resolve,
		}));
		
		if (template.render) {
			resolve(template);
		}
	}
	
	return {
		'render': (data = {}) => {
			if (!promise) {
				promise = new Promise(deferParse);
			}
			
			return Promise
				.all([
					promise,
					getTranslations(),
				])
				.then(([template]) => template.render(assign({}, getGlobals(), data), {}, true))
				.then((data) => {
					var nodes = $($.parseHTML(data));
					hooks.forEach((hook) => hook(nodes));
					return nodes;
				});
		},
	};
}
