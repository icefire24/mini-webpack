const { SyncHook } = require("tapable")

//每次编辑产生compiler实例
class Compiler {
    constructor(options) {
        this.options = options//webpack.config.js配置信息
        this.hooks = {
            run: new SyncHook(),
            done: new SyncHook(),
            after: new SyncHook(),
        }
    }
    //编译函数
    compile(callback) {
        let compilation = new Compilation(this.options)
        compilation.build(callback)
    }
    //开始编译
    run() {
        this.hooks.run.call()
        //编译完成后执行回调函数
        let onCompile = () => {
            this.hooks.done.call()
            this.hooks.after.call()
        }
        this.compile(onCompile)
    }
}
class Compilation {
    constructor(webpackOptions) {
        this.options = webpackOptions
        this.modules = []//存放所有模块
        this.chunks = []//存放所有代码块
        this.assets = {}//存放所有资源
        this.fileDependencies = []//本次打包涉及到的文件，这里主要是为了实现watch模式下监听文件的变化，文件发生变化后会重新编译
    }
    build(callback) {
       callback() 
    }
}
const webpack = function (options) {
    //创建compiler实例
    let compiler = new Compiler(options)
    //注册插件初始化,传入compiler实例
    options.plugins.forEach(plugin => {
        plugin.apply(compiler)
    })
    return compiler

}
//webpack插件必须要有apply方法,apply方法接收compiler实例
class WebpackPlugin {
    apply(compiler) {
        compiler.hooks.run.tap("webpackPlugin", () => {
            console.log("run")
        })
    }
}
module.exports = { webpack, WebpackPlugin }