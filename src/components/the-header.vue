<template>
  <a-layout-header class="header">
    <div class="logo" />
    <a-menu
      v-model:selectedKeys="selectedKeys1"
      theme="dark"
      mode="horizontal"
      :style="{ lineHeight: '64px' }"
    >
      <a-menu-item key="/">
        <router-link to="/">首页</router-link>
      </a-menu-item>
      <a-menu-item key="/admin/user">
        <router-link to="/admin/user">用户管理</router-link>
      </a-menu-item>
      <a-menu-item key="/admin/ebook">
        <router-link to="/admin/ebook">海洋生物样本书籍</router-link>
      </a-menu-item>

      <a-menu-item key="/admin/category">
        <router-link to="/admin/category">样本分类</router-link>
      </a-menu-item>

      <a-menu-item key="/about">
        <router-link to="/about">关于我们</router-link>
      </a-menu-item>

      <a-menu-item key="user" :style="{ float: 'right' }">
        <span v-show="user.id">你好：{{ user.name }}</span>
      </a-menu-item>

      <a-menu-item key="login" :style="{ float: 'right' }">
        <a v-show="!user.id" @click="showLoginModal">登录</a>
      </a-menu-item>
      
      <a-menu-item key="loginOut" :style="{ float: 'right' }">
        <a v-show="user.id" @click="loginOut">退出</a>
      </a-menu-item>
    </a-menu>

    <a-modal
      title="登录"
      v-model:visible="loginModalVisible"
      :confirm-loading="loginModalLoading"
      @ok="login"
    >
      <a-form
        :model="loginUser"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="登录名">
          <a-input v-model:value="loginUser.loginName"></a-input>
        </a-form-item>
        <a-form-item label="密码">
          <a-input v-model:value="loginUser.password" type="password"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-layout-header>
</template>

<script lang="ts" setup>
import { message } from "ant-design-vue";
import { computed, ref } from "vue";
import axios from "axios";
import store from "@/store";

declare let hexMd5: any;
declare let KEY: any;

const user = computed(()=>store.state.user);

//用作登录
const loginUser = ref({
  loginName: "",
  password: "",
});

const loginModalLoading = ref(false);
const loginModalVisible = ref(false);
const showLoginModal = () => {
  loginModalVisible.value = true;
};

const login = () => {
  console.log("开始登录");
  loginModalLoading.value = true;
  loginUser.value.password = hexMd5(loginUser.value.password + KEY);
  axios.post("/user/login", loginUser.value).then((resp) => {
    loginModalLoading.value = false;
    const data = resp.data;
    console.log("------------------------------",data);
    if (data.success) {
      loginModalVisible.value = false;
      console.log("登录成功返回数据:", data);
      store.commit("setUser",data.content);
      message.success("登录成功");
    } else {
      message.error(data.message);
      loginModalLoading.value = false;
    }
  });
};

const loginOut=()=>{
  store.commit("setUser",{});
  loginUser.value.password="";
  message.success("已退出")
}

</script>