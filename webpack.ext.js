const path = require("path");
const webpack = require("webpack");
// const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
  console.log(`%c[Ext]: ${env}`, "color:red");

  return {
    entry: "./app/popup/index.ext.js",
    watch: true,
    mode: "development",
    devtool: "cheap-module-source-map",
    output: {
      path: path.resolve(__dirname, "app/build/ext"),
      filename: "script.js",
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
    plugins: [
      new webpack.DefinePlugin({
        __TYPE__: JSON.stringify("EXT"),
        __ENV__: JSON.stringify(env.toUpperCase()),
      }),
    ],
  };
};
