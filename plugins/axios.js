import {Message} from "element-ui"
export default ({$axios})=>{
    $axios.onError((err)=>{
        const {statusCode, message}=err.response.data

        if(statusCode===400){
            Message.warning({message});
        }
    })
}