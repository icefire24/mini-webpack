const { WebpackPlugin } = require("./webpack")
const loader1 = (source) => {
    return source + "//给你的代码加点注释：loader1";
};

const loader2 = (source) => {
    return source + "//给你的代码加点注释：loader2";
};

module.exports = {
    "entry": "./src/main.js",
    "output": {
        "path": "./dist",
        "filename": "bundle.js"
    },
    modules: {
        rules: [
            {
                test: /\.js$/,
                use: [loader1, loader2]
            }
        
        ]
    },
    plugins: [
        new WebpackPlugin()
    ]
}