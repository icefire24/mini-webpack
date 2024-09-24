const { SyncHook } = require("tapable")
const path = require("path")
const fs = require("fs")
//每次编辑产生compiler实例
class Compiler {
    constructor(options) {
        this.options = options//webpack.config.js配置信息
        this.hooks = {
            beforeRun: new SyncHook(),
            run: new SyncHook(),
            beforeCompile: new SyncHook(),
            compile: new SyncHook(),
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
        this.hooks.beforeRun.call()
        this.hooks.beforeCompile.call()
        //编译完成后执行回调函数
        let onCompile = () => {
            this.hooks.run.call()
            this.hooks.compile.call()
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
    //解析模块,filename是模块名，basedir是模块所在的目录绝对路径
    buildModule(name, path) {
        //读取文件内容
        let sourceCode = fs.readFileSync(path, "utf8")
        //得到模块相对于根文件路径
        let moduleId = "./" + path.posix.relative(basedir, path)

        //处理loader对源代码进行翻译和替换
        let loaders = []
        let { rules = [] } = this.options.module
        rules.forEach(rule => {
            let { test } = rule
            if (path.match(test)) {
                loaders.push(...rule.use)
            }
        });
        //从右向左对模块进行转译
        sourceCode = loaders.reduceRight(function (code, loader) {
            loader(code)
        }, sourceCode)
        //创建一个模块对象
        let module = {
            id: moduleId,
            names: [name],
            dependencies: [],
            _source: sourceCode
        }
        return module
    }
    build(callback) {
        //entry可以是字符串或者对象
        let entry = {}
        if (typeof this.options.entry === "string") {
            entry.main = this.options.entry
        } else if (typeof this.options.entry === "object") {
            entry = this.options.entry
        }
        //遍历entry对象，创建模块
        for (let filename in entry) {
            let basedir = path.join(process.cwd(), entry)
            this.fileDependencies.push(basedir)
            //解析模块得到模块对象
            let entryModule = this.buildModule(filename, basedir)
            this.modules.push(entryModule)
        }
        //编译成功后执行回调函数
        callback()
    }
}
const webpack = function (options) {
    //创建compiler实例
    let compiler = new Compiler(options)
    //注册插件初始化,传入compiler实例
    if (options.plugins && Array.isArray(options.plugins)) {
        for (const plugin of options.plugins) {
            if (typeof plugin === "function") {
                plugin.apply(compiler);
            } else {
                plugin.apply(compiler);
            }
        }
    }

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