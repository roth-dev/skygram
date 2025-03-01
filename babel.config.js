module.exports = function (api) {
  api.cache(true);
  // const isTestEnv = process.env.NODE_ENV === 'test';

  return {
    presets: [
      [
        "babel-preset-expo",
        { 
          jsxImportSource: "nativewind",
          lazyImports: true,
          // native: {
          //   disableImportExportTransform: !isTestEnv,
          // },
        }
      ],
      "nativewind/babel"
    ],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@": "./src",
            lib: "./src/lib",
            platform: "./src/platform",
            state: "./src/state",
            crypto: "./src/platform/crypto.ts",
          },
        },
      ]
    ],
  };
};
