import parser from "@babel/parser";
import traverse from "@babel/traverse";
import babel from "@babel/core";
import path from "path";
import fs from "fs";

/**获取入口文件内容*/
function readFile(entry) {
  return fs.readFileSync(entry, "utf-8");
}
/**js->ast*/
function parserCode(content) {
  const ast = parser.parse(content, {
    sourceType: "module",
  });
  return ast;
}

/**es6->es5*/
function convert(ast) {
  let { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });
  return code;
}
/**依赖收集*/
function getDeps(ast, file, deps) {
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file);
      const abspath = "./" + path.join(dirname, node.source.value);
      deps[node.source.value] = abspath;
    },
  });
}
/**获取文件依赖信息*/
function getModuleInfo(filepath) {
  let dep = {};
  let content = readFile(filepath);
  let ast = parserCode(content);
  getDeps(ast, filepath, dep);
  let code = convert(ast);
  const moduleInfo = { entry: filepath, dep, code };
  return moduleInfo;
}
/**递归获取import依然信息*/
function getDeepDep(module, deps) {
  Object.keys(module.dep).forEach((val) => {
    let dep = getModuleInfo(module.dep[val]);
    deps.push(dep);
    getDeepDep(dep, deps);
  });
}
/**生成依赖图*/
function getGraf(file) {
  let moduleInfo = getModuleInfo(file);
  let deps = [moduleInfo];
  getDeepDep(moduleInfo, deps);
  let graph = {};
  deps.forEach((dep) => {
    graph[dep.entry] = {
      dep: dep.dep,
      code: dep.code,
    };
  });
  return graph;
}
/**传入require函数*/
function bundle(file) {
  const depsGraph = JSON.stringify(getGraf(file));
 return `(function (graph) {
    function require(file) {
      function absRequire(relPath) {
        return require(graph[file].dep[relPath]);
      }
      var exports = {};
      (function (require, exports, code) {
        eval(code);
      })(absRequire, exports, graph[file].code);
      return exports;
    }
    require('${file}');
  })(${depsGraph});`
}
const content = bundle("./src/index.js");

// console.log(content);
/**生成dist/bundle.js*/
!fs.existsSync("./dist") && fs.mkdirSync("./dist");
fs.writeFileSync("./dist/bundle.js", content);

