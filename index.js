//简易版实现，实现require函数
(function (list) {
  function require(file) {
    let module = {};
    eval(list[file]);
    return module.exports;
  }
  require("./entry");
})({
  "./entry": `const add=require('./add');console.log(add(1,2))`,
  "./add": `module.exports=function(a,b){return a+b}`,
});
