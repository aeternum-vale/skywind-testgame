const path = require("path");

module.exports = {
  entry: "./src/main.ts",

  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "bundle.js"
  },

  devtool: "source-map",
  resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /(node_modules)/
      },
      { 
        test: /\.tsx?$/, 
        loader: "awesome-typescript-loader" },
      { 
        enforce: "pre", 
        test: /\.js$/, loader: "source-map-loader" 
      }
    ]
  }
};