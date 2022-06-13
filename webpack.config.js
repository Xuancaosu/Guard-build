const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackConfig = {
  mode: 'production',
  entry: './src/index.ts',
  // externals: ['react', 'react-dom', 'prop-types'],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
  },
  output: {
    filename: 'index.min.js',
    path: path.resolve(__dirname, './dist'),
    library: {
      type: 'umd',
      name: 'authing',
    },
    // clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { modules: 'commonjs' }], '@babel/preset-react'],
              plugins: ['@babel/plugin-proposal-class-properties'],
            },
          },
          // {
          //   loader: 'ts-loader',
          //   options: {
          //     configFile: 'tsconfig.json',
          //   },
          // },
        ],
      },
    ],
  },
};

module.exports = webpackConfig;