import React,{useReducer,useState,useMemo} from 'react';
//https://www.jianshu.com/p/9138e63fd1a9     参考他的项目
//这是第一种版本：useState的改造
function App2() {
    const [price, setPrice] = useState(0);
    const [num, setNum] = useState(0);
    const [money, setMoney] = useState(0);

    function changePrice() {
      console.log('改变价格')
      const newPrice = 8; // 设置价格变量
      setPrice(newPrice);
      console.log(price,'看是否第二行能直接看到最新值吗')
      //结果是setPrice也和常规class组件里一样，都是异步的，都取不到最新值
      //由于获取不到最新值，所以下面更新价格的话就不能用setMoney(price*num)
      //必须取newPrice才能正常工作。但是这样又不太优雅：
        /* 1 代码不够直观，比较复杂
           2 上面代码，一个事件只是在一个函数体里执行，可以这么定义变量。这在真实业务中是不可能的，多层函数调用，想按这思路解决，就得当参数一层层传过去。
           3 逻辑无法从组件拆分出来 */
      setMoney(newPrice * num);
    }

    function changeNum() {
        console.log('改变数量')
      const newNum = 2;  // 设置数量变量
      setNum(newNum);
      setMoney(price * newNum);
    }

    function changePriceAndNum() {
        console.log('同时改变价格和数量')
     /*  const newPrice = 6.6, newNum = 3;  // 设置价格和数量变量
      setPrice(newPrice);
      setNum(newNum);
      setMoney(newPrice * newNum); */
    }
    return (
      <div id="App" className="App">
        <p>Price: {price}<button onClick={changePrice}>change price</button></p>
        <p>Num: {num}<button onClick={changeNum}>change num</button></p>
        <p>Money: {money}</p>
        <button onClick={changePriceAndNum}>change price and num</button>
      </div>
    );
  }
export default App2