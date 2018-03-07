/**
 * Translation module.
 * @module
 */

import {
	assign,
	keys,
	reduce,
} from 'lodash';
import modifiable from './modifiable';

/**
 * Variable containing translation data.
 * @type {Object}
 */

var data = setTranslations();

/**
 * Parses and sets translation data.
 * @param {external:Promise.<Object>} - promise resolving to raw translation data
 * @return {external:Promise.<Object>} Translation data in a ready to use format.
 */

export function setTranslations (promise = {}) {
	return data = Promise
		.resolve(promise)
		.then((trans) => ({
			'plural': {
				'forms': trans.plural && trans.plural.forms ? trans.plural.forms : 1,
				'expression': trans.plural && trans.plural.expression ? expressionToFunction(trans.plural.expression) : expressionToFunction(),
			},
			'translations': {
				'map': reduce(trans.translations && trans.translations.map ? trans.translations.map : {}, (accumulator, value, key) => assign(accumulator, {
					[key]: JSON.parse(value),
				}), {}),
			},
		}));
}

/**
 * Resolves translation promise into a sync object.
 * @return {Object} Translation data in a ready to use format.
 */

export function getTranslations () {
	return Promise
		.resolve(data)
		.then((sync) => data = sync);
}

/**
 * Hashes string into a number using a basic algorithm.
 * @param {string} - input value
 * @return {number} Hashed numeric value.
 */

export function hashCode (value) {
	return value.split('').reduce((a, b) => {
		a = ((a << 5) - a) + b.charCodeAt(0);
		return a & a;
	}, 0);
}

/**
 * Turns a gettext expression into a callable function.
 * @param {string} - gettext expression
 * @return {Function} Function that returns an index.
 */

export function expressionToFunction (expression = 0) {
	return new Function('n', `"use strict"; return +(${expression})`);
}

/**
 * Extends Twig with translation capabilities.
 * @param {Object} - twig object
 * @return {Object} Twig object.
 */

export function extendTwig (Twig) {
	Twig.exports.extendFilter('trans', (raw) => data.translations.map[hashCode(JSON.stringify(raw))] || raw);
	
	Twig.exports.extendTag({
		'type': 'endtrans',
		'open': false,
		'regex': /^endtrans$/,
		'next': [],
	});
	
	Twig.exports.extendTag({
		'type': 'plural',
		'open': false,
		'regex': /^plural (.+)$/,
		'next': [
			'endtrans',
		],
		'compile': function (token) {
			var expression = token.match[1];
			
			token.stack = Twig.expression.compile.apply(this, [{
				'type': Twig.expression.type.expression,
				'value': expression,
			}]).stack;
			
			delete token.match;
			return token;
		},
		'parse': function (token, context, chain) {
			var value = +Twig.expression.parse.apply(this, [token.stack, context]);
			var form = data.plural.expression(value);
			
			var translation = chain.getData('translation');
			if (translation[form]) {
				var raw_tokens = Twig.tokenize.apply(this, [translation[form]]);
				var tokens = Twig.compile.apply(this, [raw_tokens]);
				
				chain.setValue(Twig.parse.apply(this, [tokens, context]));
			}
			else if (form !== 0) {
				chain.setValue(Twig.parse.apply(this, [token.output, context]));
			}
			
			return {
				'chain': false,
				'output': '',
			};
		},
	});
	
	Twig.exports.extendTag({
		'type': 'trans',
		'open': true,
		'regex': /^trans$/,
		'next': [
			'plural',
			'endtrans',
		],
		'compile': function (token) {
			token.stack = [];
			delete token.match;
			
			return token;
		},
		'parse': function (token, context) {
			var shim = keys(context).reduce((accumulator, key) => assign(accumulator, {
				[key]: `{{ ${key} }}`,
			}), {});
			
			var key = Twig.parse.apply(this, [token.output, shim]);
			var code = hashCode(JSON.stringify(key));
			
			var output = new modifiable();
			var translation = data.translations.map[code];
			if (translation) {
				var raw_tokens = Twig.tokenize.apply(this, [translation]);
				var tokens = Twig.compile.apply(this, [raw_tokens]);
				
				output.setValue(Twig.parse.apply(this, [tokens, context]));
				output.setData('translation', translation);
			}
			else {
				output.setValue(Twig.parse.apply(this, [token.output, context]));
				output.setData('translation', []);
			}
			
			return {
				'chain': output,
				'output': output,
			};
		},
	});
	
	return Twig;
}
