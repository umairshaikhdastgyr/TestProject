module.exports = {
  presets: [ "module:metro-react-native-babel-preset" ],
  plugins: [
    [
      "babel-plugin-module-resolver",
      {
        root: ["./app"],
        alias: {
          "#components": "./app/components",
          "#styles": "./app/styles",
          "#themes": "./app/themes",
          "#assets": "./app/assets",
          "#modules": "./app/modules",
          "#utils": "./app/utils",
          "#services": "./app/services",
          "#config": "./app/config",
          "#constants": "./app/constants",
          "#screens": "./app/screens",
          "#common-views": "./app/common-views",
        },
      },
    ],
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
        allowlist: [
          "API_URL",
          "ApiKey",
          "googleApiKey",
          "googleWebCliendId",
          "googleIOSClientId",
          "stripePublishableKey"
        ]
      },
    ],
  ],
};
