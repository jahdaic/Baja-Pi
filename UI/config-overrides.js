const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
	webpack: (config, env) => {
		const newConfig = {...config};
		
		newConfig.plugins = [
			...newConfig.plugins,
			new NodePolyfillPlugin({
				excludeAliases: ['console']
			})
		];

		return newConfig;
	}
}