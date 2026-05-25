import mourner from 'eslint-config-mourner';

export default [
	{ignores: ['spec/e2e/**']},
	...mourner,
	{
		rules: {
			'@stylistic/indent': [1, 'tab', {
				VariableDeclarator: 0,
				flatTernaryExpressions: true
			}]
		}
	}
];
