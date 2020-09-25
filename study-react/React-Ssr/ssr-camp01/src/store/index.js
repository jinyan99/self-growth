// 首页的逻辑
import axios from 'axios'
// actionType

const GET_LIST = 'INDEX/GET_LIST'

// actinCreator
const changeList = list=>({
  type:GET_LIST,
  list
})

export const getIndexList = server=>{
  return (dispatch, getState, axiosInstance)=>{
    return axios.get('http://localhost:9090/api/course/list')
      .then(res=>{
        const {list} = res.data
        console.log('list',list)
        dispatch(changeList(list))
      })
  }
}
/* export const getIndexList = server=>{
  return (dispatch, getState, $axios)=>{
    return $axios.get('/api/course/list')
      .then(res=>{
        const {list} = res.data
        console.log('list',list)
        dispatch(changeList(list))
      })
  }
} */
const defaultState = {
  list:[]
}


//这样index的reducer就写好也报漏出去了，后面由store引入模块化reducer就ok
export default (state=defaultState, action)=>{
  switch(action.type){
    case GET_LIST:
      const newState={
        ...state,
        list:action.list
      }
      return newState
    default:
      return state
  }
}
