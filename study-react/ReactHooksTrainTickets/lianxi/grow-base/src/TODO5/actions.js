//这文件里面是个actioncreator概念的文件，
//这版要加入的是reducer模块化概念
export function createSet(payload) {
    return {
        type:'set',
        payload
    }
}
let idSeq = Date.now();
export function createAdd(text) {
    console.log(text,'要改的state值')
    return  {
                    type: 'add',
                    payload:{
                        id: ++idSeq,
                        text,
                        compolete: false}
                }
}
export function createToggle(payload) {
    return {
        type:'toggle',
        payload
    }
}
export function createRemove(payload) {
    return {
        type:'remove',
        payload
    }
}