import babel from 'rollup-plugin-babel';

function getConfig (output) {
	return {
		'input': 'index.js',
		'output': output,
		'external': [
			'jquery',
			'lodash',
			'twig',
		],
		'plugins': [
			babel({
				'exclude': 'node_modules/**',
			}),
		],
	};
}

export default [
	getConfig({
		'file': 'dist/index.js',
		'format': 'cjs',
		'exports': 'named',
	}),
	getConfig({
		'file': 'dist/es.js',
		'format': 'es',
	}),
];
