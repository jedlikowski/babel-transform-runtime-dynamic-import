const {
  adjustStyleLoaders,
  addBabelPlugin,
  addWebpackPlugin,
  // useEslintRc,
} = require("customize-cra");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (config, env) => {
  // change code splitting settings to reduce amount of files
  config.optimization = {
    ...config.optimization,
    splitChunks: {
      ...config.optimization.splitChunks,
      minSize: 1000000,
      maxInitialRequests: 1,
    },
    runtimeChunk: false, // produces around 2kb smaller bundle when using just one entry
  };

  config.plugins = config.plugins.map((plugin) => {
    // change naming of generated css files
    if (plugin instanceof MiniCssExtractPlugin) {
      return new MiniCssExtractPlugin({
        ...plugin.options,
        filename: `static/css/[name].[hash:4].css`,
        chunkFilename: `static/css/[name].[contenthash:4].c.css`,
      });
    }

    return plugin;
  });

  // automatically add polyfills without polluting global scope
  addBabelPlugin([
    "@babel/plugin-transform-runtime",
    {
      corejs: 3,
      version: "^7.7.4",
    },
  ])(config);

  return config;
};
