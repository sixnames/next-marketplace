module.exports = {
  mode: 'development',
  // make sure the source maps work
  devtool: 'eval-source-map',
  // webpack will transpile TS and JS files
  resolve: {
    extensions: ['.ts', '.js', '.mjs', '.jsx', '.tsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        // every time webpack sees a TS file (except for node_modules)
        // webpack will use "ts-loader" to transpile it to JavaScript
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'ts-loader',
            options: {
              // skip typechecking for speed
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
};
