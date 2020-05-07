import { Slider,Button,Message,Loading,Input,Form, FormItem } from 'element-ui';

 let arr=[Slider,Button,Loading,Input,Form,FormItem]
export default function (Vue) {
  arr.forEach(Component=>{
    return  Vue.use(Component)
  })
  
  Vue.prototype.$message = Message
}