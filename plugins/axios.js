import {Message} from "element-ui"
export default ({$axios,redirect})=>{
    $axios.onError((err)=>{
        const {statusCode, message}=err.response.data

        if(statusCode===400){
            Message.warning({message});
        }
        if(statusCode==="401" || statusCode==="403"){
            redirect("air/login") //如果没有登录，则直接跳转到登录页面
        }
    })
}