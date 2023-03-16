const {WebpackPlugin} =require("./webpack")
module.exports = {
    "entry": "./src/main.js",
    "output": {
        "path": "./dist",
        "filename": "bundle.js"
    },
    plugins: [
        new WebpackPlugin()
    ]
}