const express = require('express');
const app = express();
const puppeteer = require('puppeteer')

async function test() {
    console.log('截图')
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://kaikeba.com/')
    await page.screenshot({path: 'kaikeba.png'})
    await browser.close() //这样就会运行后就会截个该网站图片存到本地
}
//test()


const urlCache={};
app.get('*', async function (req,res) {
    console.log(req.url)
    //遍历所有传过来的路由，都写成html文件，或者都缓存上，就不用33行临时发起网络请求了--这种叫预渲染叫prerender
    //加缓存--如果你缓存过多的话可以考虑使用lru缓存算法
    if(urlCache[url]) {
        await res.send(urlCache[url])
    }
    //每次访问都会访问到favicon请求，给它过滤掉
    if(req.url=='/favicon.ico') {
       //这操作对seo无影响
        return res.send({code:0})
    }
    const url = 'http://localhost:9093'+ req.url
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
   //因为里面可能有异步的请求，我们需要做2参的配置，即下面的waituntil，等待网络请求空闲的时候
    await page.goto(url,{
        waitUntil:['networkidle0']//等网络的空闲的时候再去执行下面的代码
    })
    const html = await page.content()
    console.log(html)
    //这样就稍微另类的方式实现了ssr的功能，但这样比较慢，慢可以加些缓存的逻辑
    res.send(html)
    //这样做的话，会很慢，因为用户访问之后，我们还得去抓取csr应用，所以访问会很慢
})
app.listen(8081,()=>{
    console.log('ssr server start')
})