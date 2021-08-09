const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = (env) => {
  const { NODE_ENV, MODE } = env;
  console.log(
    `[App]: Processing '${NODE_ENV}' environment for '${MODE}' mode.`
  );

  const watch = MODE === "ext" && NODE_ENV === "development";
  const outputFolder = MODE === "app" ? "build" : "app/build";

  const plugins = [
    new webpack.DefinePlugin({
      __TYPE__: JSON.stringify(MODE),
      __ENV__: JSON.stringify(NODE_ENV),
    }),
  ];

  if (MODE === "app")
    plugins.push(new HtmlWebpackPlugin({ template: "./src/index.app.html" }));

  return {
    entry: "./src/index.app.js",
    mode: "development",
    watch,
    devtool:
      NODE_ENV === "development" ? "source-map" : "cheap-module-source-map",
    output: {
      path: path.resolve(__dirname, outputFolder),
      filename: "script.js",
    },
    devServer: {
      contentBase: path.join(__dirname, "build"),
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
    plugins,
  };
};
