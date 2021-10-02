module.exports = {
  publicPath: process.env.PUBLIC_PATH || "/",
  devServer: {
    host: "localhost",
    port: 8080,
    public: "localhost:8080",
  },
  pwa: {
    name: "q4",
    themeColor: "#DAD6F1",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    iconPaths: {
      maskIcon: "favicon.svg", // would be img/icons/safari-pinned-tab.svg by default
    },
    workboxOptions: {
      skipWaiting: true,
    },
  },
};
