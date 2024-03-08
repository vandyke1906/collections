module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            "nativewind/babel",
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
            "react-native-reanimated/plugin",
            [
                "module-resolver",
                {
                    root: ["."],
                    extensions: [
                        '.ios.ts',
                        '.android.ts',
                        '.ts',
                        '.ios.tsx',
                        '.android.tsx',
                        '.tsx',
                        '.jsx',
                        '.js',
                        '.json',
                    ],
                    alias: {
                        "@app": "./src/app",
                        "@common": "./src/common",
                        "@components": "./src/components",
                        "@model": "./src/model",
                        "@store": "./src/store",
                    },
                },
            ],
            "react-native-paper/babel"
        ],
    };
};
