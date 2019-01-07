const path = require("path");
const ManifestPlugin = require("webpack-manifest-plugin");

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  devtool: process.env.NODE_ENV === "production" ? "source-map" : "inline-source-map",
  entry: ["@babel/polyfill", "./static/js/index.js", "./static/sass/app.scss"],
  output: {
    path: path.resolve(__dirname, "static/build"),
    filename: process.env.NODE_ENV === "production" ? "js/[name].[contenthash].js" : "js/[name].js",
    publicPath: "/static/build/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: process.env.NODE_ENV === "production" ? "css/[name].[hash].css" : "css/[name].css",
            },
          },
          {
            loader: "extract-loader",
          },
          {
            loader: "css-loader?-url",
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
  plugins: [new ManifestPlugin()],
};
