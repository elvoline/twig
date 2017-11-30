import babel from 'rollup-plugin-babel';

export default {
	'input': 'index.js',
	'output': {
		'file': 'dist/index.js',
		'format': 'cjs',
	},
	'external': [
		'twig',
		'jquery',
	],
	'plugins': [
		babel({
			'exclude': 'node_modules/**',
			'babelrc': false,
			'presets': [
				[
					'env',
					{
						'modules': false,
					},
				],
			],
		}),
	],
};
