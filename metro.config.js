// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

let config = getDefaultConfig(__dirname);

/** withStorybook Adds the config that storybook uses */
config = withNativeWind(config, { input: "./global.css" });

module.exports = config;
