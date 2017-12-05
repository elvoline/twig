import babel from 'rollup-plugin-babel';

function getConfig (output) {
	return {
		'input': 'index.js',
		'output': output,
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
				'plugins': ['external-helpers'],
			}),
		],
	};
}

export default [
	getConfig({
		'file': 'dist/index.js',
		'format': 'cjs',
	}),
	getConfig({
		'file': 'dist/es.js',
		'format': 'es',
	}),
];
