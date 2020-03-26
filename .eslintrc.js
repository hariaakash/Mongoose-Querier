module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: 'airbnb-base',
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	rules: {
		'no-console': 0,
		'no-param-reassign': 0,
		indent: ['error', 'tab'],
		'no-tabs': 0,
		'max-len': ['error', { code: 120 }],
		'comma-dangle': ['error', 'always-multiline'],
		'arrow-parens': ['error', 'always'],
		'no-underscore-dangle': 0,
	},
};