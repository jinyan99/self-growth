//下面利用读取xml文件演示回掉嵌套和promise两种形式。
//1.promsie出现之前处理异步逻辑是用的回掉callback解决，但这种有问题，
//若层层嵌套回掉的化，最外层的一旦抛出异常的化，里面嵌套的所有逻辑都执行不了啦。
// 这就是回掉解决的缺点-----也会导致经典的回掉地狱问题层层嵌套不可维护。
readFile(filename, (err,content)=> {
    parseXML(content,(err,xml)=> {
        //回掉方式解决异步，可维护性差
    })
})

//promsie诞生完美的替代了callback方式，只不过它把嵌套中的异步代码组装成了链式结构。
//这种线性的控制流就比callback那种洋葱式控制流，在可读性可维护性上就好太多了
readFile(filename).then(content => parseXML(content))
                  .then(xml => {}, error => {})
//这两种写法并不是等价的，第一种在xml那里抛出了异常，它的error并不能捕获到异常
//第二种抛出异常，在它的catch里的error能捕获到所有异常，---我们强烈建议使用第二种写法
readFile(filename).then(content => parseXML(content))
                  .then(xml => {}).catch(error => {})
//open是假设的一个控制流方法，返回的无论打开或者失败都执行close逻辑
open().then(handle).then(close,close)
open().then(handle).finally(close) //与trycatch的finally差不多
//上面都是promsie的实例上的属性和方法，
//下面介绍些Promsie上的静态属性方法啥的。
Promise.resolve(1)//这是resolve的快捷方式
Promise.reject(error)//这是reject拒绝的快捷方式
//等价于new Promise((resolve,reject) => resolve(1)或reject(error))

//等所有的promise都完成后，返回的这个promise才会完成，前面所有的promsie只要有一个拒绝，则返回的promise就会立刻触发拒绝
//promise传入的参数可以不是数组，也可以传字符串等,传数值不行会报错，字符串能当成数组，一次遍历字符串每个字符，返回的res是个数组['a','b','c']
Promise.all('abc').then(res => {console.log(res)})//['a','b','c']
Promise.race() //和all的参数一样，但是赛跑的。只要其中一项有成功或拒绝的，就立刻返回的promise是成功或拒绝状态，其他的promise就不管了
//race也可以传字符串不能传数值

//其实这种链式控制流还是不满意的，仍然有很多callback函数，只不过他们是线性排比关系
//我们还是希望能避免这些callback函数----这时候async await就派上用场了
//用await关键字可以把链式的promsie改写成类似同步语句的样子

//改写如下
async function readXML(filename) {
    const content = await readFile(filename)
const xml = await parseXML(content)
return xml
}

//思考题：用promie同时加载100张图片，怎样最多允许有10个promsie在同时运行