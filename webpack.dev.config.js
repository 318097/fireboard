const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./app/popup/index.dev.js",
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  output: {
    path: path.resolve(__dirname, "app/build/popup"),
    filename: "script.js",
  },
  devServer: {
    contentBase: path.join(__dirname, "app/build"),
    port: 9000,
    clientLogLevel: "silent",
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(ttf|otf)$/,
        use: ["file-loader"],
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: ["@svgr/webpack"],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./app/popup/index.html" })],
};
