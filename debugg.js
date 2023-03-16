const { webpack } =require("./webpack")
let webpackOptions=require("./webpack.config")
let compiler=webpack(webpackOptions)
compiler.run((err, stats) => {
    console.log(err, stats)
})
