import { fileURLToPath } from 'url';
import { dirname, resolve as _resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  entry: './src/index.ts',
  target: 'node',
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
  output: {
    filename: 'bundle.js',
    path: _resolve(__dirname, 'dist'),
    libraryTarget: 'module',
    chunkFormat: 'commonjs',
  },
  experiments: {
    outputModule: true,
  },
  mode: 'production',
};
