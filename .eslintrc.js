const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'));

module.exports = {
	extends: ['react-app', 'prettier'],
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': ['error', prettierOptions],
		'prefer-const': [
			'error',
			{
				destructuring: 'all',
				ignoreReadBeforeAssign: true,
			},
		],
		// 'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
	},
	overrides: [
		{
			files: ['**/*.ts?(x)', '**/*.js?(x)'],
			rules: { 'prettier/prettier': ['warn', prettierOptions] },
		},
	],
};
