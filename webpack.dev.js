import { fileURLToPath } from 'url';
import { dirname, resolve as _resolve } from 'path';
import { merge } from 'webpack-merge';
import commonConfig from './webpack.common.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const devConfig = {
  entry: './src/index.ts',
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'node',
  output: {
    filename: 'bundle.dev.js',
    path: _resolve(__dirname, 'dist'),
    clean: true,
    chunkFormat: 'commonjs',
  },
  devServer: {
    static: {
      directory: _resolve(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true,
    open: true,
    open: '/api',
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:4000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    ],
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
  resolve: {
    extensions: ['.ts', '.js'],
  },
};

export default merge(commonConfig, devConfig);
