import { fileURLToPath } from 'url';
import { dirname, resolve as _resolve } from 'path';
import { merge } from 'webpack-merge';
import commonConfig from './webpack.common.js';
import TerserPlugin from 'terser-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prodConfig = {
  mode: 'production',
  target: 'node',
  output: {
    filename: 'bundle.prod.js',
    path: _resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    chunkFormat: 'commonjs',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

export default merge(commonConfig, prodConfig);
