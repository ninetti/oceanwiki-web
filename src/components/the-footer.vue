<template>
    <a-layout-footer style="text-align: center">
        海洋科普网
    </a-layout-footer>
</template>

<!-- <script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
 name: 'the-footer'
});
</script> -->
<!-- <script lang="ts" setup>
import store from '@/store';
import { computed, onMounted } from 'vue';
import { Tool } from '@/utils/tool';
import { notification } from 'ant-design-vue';
const user = computed(()=>store.state.user)

let websocket:any;
let token:any;

onMounted(()=>{
    if('WebSocket' in window){
        token = Tool.uuid(10)//生成当i去哪客户端token
        //连接
        websocket = new WebSocket(process.env.VUE_APP_WS_SERVER+'/ws/'+token);
        initWebSocket();
    }else{
        alert('当前浏览器不支持')
    }
})

const onOpen=()=>{
    console.log('webSocket连接成功,状态码:',websocket.readyState);
}
const onMessage=(event:any)=>{
    console.log('收到消息',event.data);
    notification['info']({
        message:'收到消息',
        description:event.data
    })
}
const onError=()=>{
    console.log('连接错误',websocket.readyState);
}
const onClose=()=>{
    console.log('连接关闭',websocket.readyState);
}

const initWebSocket=()=>{
    websocket.onopen=onOpen;
    websocket.onmessage = onMessage;
    websocket.onerror = onError;
    websocket.onclose = onClose;
}

</script> -->

<script lang="ts" setup>
import store from '@/store';
import { Tool } from '@/utils/tool';
import { notification } from 'ant-design-vue';
import { computed, onMounted } from 'vue';
const user = computed(()=>store.state.user);
let websoket:any;
let token:any;
onMounted(()=>{
  if('WebSocket' in window){
    token = Tool.uuid(10);//生成当前客户端token点赞方法处添加
    //链接
    websoket = new WebSocket(process.env.VUE_APP_WS_SERVER+'/ws/'+token);
    initWebSocket();//初始化
 }else{
    alert('当前浏览器不支持');
 }
})
const onOpen=()=>{
  console.log('webSoket链接成功,状态码：',websoket.readyState);
}
const onMessage=(event:any)=>{
  console.log('收到消息',event.data);
  notification['info']({
    message: '收到消息',
    description: event.data
 })
};
const onError=()=>{
  console.log('链接错误',websoket.readyState);
};
const onClose=()=>{
  console.log('链接关闭',websoket.readyState);
};
const initWebSocket=()=>{
  websoket.onopen = onOpen;
  websoket.onmessage = onMessage;
  websoket.onerror = onError;
  websoket.onclose = onClose;
}
</script>