const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

require("dotenv").config();

module.exports = (env) => {
  const { NODE_ENV, MODE } = env;
  console.log(
    `[App]: Processing '${NODE_ENV}' environment for '${MODE}' mode.`
  );
  const entry =
    MODE === "app"
      ? "./src/entry/web/index.web.js"
      : "./src/entry/ext/index.ext.js";
  const watch = MODE === "ext" && NODE_ENV === "development";
  const mode =
    MODE === "app" && NODE_ENV === "production" ? "production" : "development";
  const devtool =
    NODE_ENV === "development"
      ? "inline-source-map"
      : "cheap-module-source-map";

  const outputFolder = MODE === "app" ? "build" : "ext/build";

  const plugins = [
    {
      visible: true,
      plugin: new webpack.DefinePlugin({
        __TYPE__: JSON.stringify(MODE),
        __ENV__: JSON.stringify(NODE_ENV),
        "process.env": JSON.stringify(process.env),
      }),
    },
    {
      visible: false,
      plugin: new BundleAnalyzerPlugin(),
    },
    {
      visible: true,
      plugin: new HtmlWebpackPlugin({
        template:
          MODE === "app"
            ? "./src/entry/web/index.web.html"
            : "./src/entry/ext/index.ext.html",
      }),
    },
    {
      visible: NODE_ENV === "production",
      plugin: new CopyPlugin({
        patterns: [{ from: "./public", to: "." }],
      }),
    },
    {
      visible: NODE_ENV === "production" && MODE === "app",
      plugin: new SentryWebpackPlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "mehul-lakhanpals-projects",
        project: "fireboard",
        release: process.env.SENTRY_RELEASE,
        include: ".",
        url: "https://sentry.io/",
        ignore: ["node_modules", "webpack.config.js"],
      }),
    },
  ];

  return {
    entry,
    mode,
    watch,
    devtool,
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
    optimization: {
      minimizer: [new UglifyJsPlugin()],
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
    plugins: plugins
      .filter((plugin) => plugin.visible)
      .map(({ plugin }) => plugin),
  };
};
