const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
require("dotenv").config();

module.exports = (env) => {
  const { NODE_ENV, MODE } = env;
  console.log(
    `[App]: Processing '${NODE_ENV}' environment for '${MODE}' mode.`
  );

  const watch = MODE === "ext" && NODE_ENV === "development";
  const outputFolder = MODE === "app" ? "build" : "ext/build";

  const plugins = [
    new webpack.DefinePlugin({
      __TYPE__: JSON.stringify(MODE),
      __ENV__: JSON.stringify(NODE_ENV),
      "process.env": JSON.stringify(process.env),
    }),
    // new BundleAnalyzerPlugin(),
  ];

  if (MODE === "app")
    plugins.push(
      new HtmlWebpackPlugin({ template: "./src/entry/web/index.web.html" })
    );

  if (NODE_ENV === "production")
    plugins.push(
      ...[
        new CopyPlugin({
          patterns: [{ from: "./public", to: "." }],
        }),
        new SentryWebpackPlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: "mehul-lakhanpals-projects",
          project: "fireboard",
          release: process.env.SENTRY_RELEASE,
          include: ".",
          url: "https://sentry.io/",
          ignore: ["node_modules", "webpack.config.js"],
        }),
      ]
    );

  return {
    entry:
      MODE === "app"
        ? "./src/entry/web/index.web.js"
        : "./src/entry/ext/index.ext.js",
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
      historyApiFallback: true,
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
