[![npm version](https://img.shields.io/npm/v/@elvoline/twig.svg?logo=npm)](https://www.npmjs.com/package/@elvoline/twig)
[![build status](https://github.com/elvoline/twig/workflows/build/badge.svg)](https://github.com/elvoline/twig/actions)
[![codecov](https://codecov.io/gh/elvoline/twig/branch/master/graph/badge.svg)](https://codecov.io/gh/elvoline/twig)

# About

This is a Twig.js renderer customized for use on Elvoline.

Added features are:

* always-on promise support
* deferred template parsing
* render hooks
* global variables
* automatic DOM creation
* i18n

# Docs

Documentation for Twig features is available in the [twig.js repo](https://github.com/twigjs/twig.js) on Github.

# Usage

## Install using npm:

```
$ npm install --save-dev @elvoline/twig 
```

jQuery and Twig are required peer dependencies:

```
$ npm install --save-dev jquery twig
```

## Rendering a twig template:

```
import renderer from '@elvoline/twig';

const template = renderer({
	'data': '<p>it renders {{ text }}</p>',
});

const promise = template.render({
	'text': 'twig'
});
```

`promise` is going to be fulfilled with a jQuery collection of DOM elements.

```
promise.then((elements) => $('body').append(elements));
```

## Adding hooks

```
import { addHook } from '@elvoline/twig';

addHook((elements) => {
	// do any jQuery operation on elements
});
```

Hooks are run before the promise is fulfilled.

## Adding globals

```
import { addGlobal } from '@elvoline/twig';

addGlobal('varName', 'value');
addGlobal('params', {
	'foo': 'bar'
});
```

You can also check the previously added globals using the getGlobals() export.

## Translations

The system is based on gettext to maintain compatibility with the PHP renderer.
Keys for the translations are hashed to keep the front-end bundle small.

Our extraction and conversion scripts are not published but you can easily convert your .po files into a .json format using `gettext-parser`.

Singular translations are a JSON stringified string, plural translations are a JSON stringified array of two (or the number of plural forms the target language has) strings.
Keys are always hashed from the singular form.

Here is an example of how to set the translations:

```
import { hashCode, setTranslations } from '@elvoline/twig';

setTranslations({
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
```

You can also pass a promise to setTranslations(), rendering will be deferred globally until the promise fulfills with the translations.
