module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      ['react-native-worklets/plugin', {}, 'worklets-plugin'], // Add this line
      ['react-native-reanimated/plugin', {}, 'reanimated-plugin'], // Usually required if using Reanimated
    ],
  };
};