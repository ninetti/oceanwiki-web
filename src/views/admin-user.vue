<template>
  <div>
    <a-layout>
      <a-layout-content
        :style="{
          background: '#fff',
          padding: '24px',
          margin: 0,
          minHeight: '280px',
        }"
      >
        <p>
          <a-form layout="inline" :model="param">
            <a-form-item>
              <a-input v-model:value="param.name" placeholder="名称"></a-input>
            </a-form-item>
            <a-form-item>
              <a-button
                type="primary"
                @click="handleQuery({ page: 1, size: pagination.pageSize })"
              >
                查询
              </a-button>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" @click="showModal('add', [])">
                新增
              </a-button>
            </a-form-item>
          </a-form>
        </p>
        <a-table
          :columns="columns"
          :row-key="(record) => record.id"
          :data-source="users"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'action'">
              <a-button type="primary" @click="showModal('edit', record)">
                编辑
              </a-button>
              <a-button
                type="primary"
                @click="showchangepasswordModalok(record)"
                style="margin-left: 8px"
              >
                重置密码
              </a-button>
              <a-popconfirm
                title="删除之后不可修复，确认删除？"
                ok-text="是"
                cancel-text="否"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="danger"> 删除 </a-button>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
      </a-layout-content>
    </a-layout>
    <a-modal
      title="用户表单"
      v-model:visible="modalVisible"
      :confirm-loading="modalLoading"
      @ok="handleModalok"
    >
      <a-form
        :v-model="user"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="登录名">
          <a-input
            v-model:value="user.loginName"
            :disabled="!!user.id"
          ></a-input>
        </a-form-item>
        <a-form-item label="昵称">
          <a-input v-model:value="user.name"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      title="重置密码表单"
      v-model:visible="passwordModalVisible"
      :confirm-loading="passwordModalLoading"
      @ok="passwordchange"
    >
      <a-form
        :v-model="user"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="请输入密码">
          <a-input v-model:value="passwordone"></a-input>
        </a-form-item>
        <a-form-item label="请再次输入相同密码">
          <a-input v-model:value="passwordtow"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
import { Tool } from "@/utils/tool";
import { message } from "ant-design-vue";

const users = ref(); //定义查询书籍返回集合

// 定义分页参数
const pagination = ref({
  current: 1,
  pageSize: 5,
  total: 0,
});

const loading = ref(false);

const columns = [
  {
    title: "登录名",
    key: "loginName",
    dataIndex: "loginName",
  },
  {
    title: "昵称",
    dataIndex: "name",
  },
  {
    title: "密码",
    key: "password",
    dataIndex: "password",
  },
  {
    title: "Action",
    key: "action",
    dataIndex: "action",
  },
];

onMounted(() => {
  //默认查询页码1
  handleQuery({
    page: 1,
    size: pagination.value.pageSize,
  });
});

const param = ref();
param.value = {};

//数据查询
const handleQuery = (params: any) => {
  loading.value = true;

  axios
    .get("/user/list", {
      params: {
        page: params.page,
        size: params.size,
        name: param.value.name,
      },
    })
    .then((resp) => {
      loading.value = false;
      const data = resp.data;
      console.log(data.content);
      if (data.success) {
        //获取查询数据
        users.value = data.content.list;
        //重置分页
        pagination.value.current = params.page;
        //设置总条数
        pagination.value.total = data.content.total;
      }
    });
};

//编辑相关功能
const user = ref();
const modalVisible = ref(false);
const modalLoading = ref(false);
//编辑方法
const showModal = (action: any, record: any) => {
  modalVisible.value = true;
  if (action === "edit") {
    user.value = Tool.copy(record);
  } else {
    user.value = {};
  }
};

declare let hexMd5: any;
declare let KEY: any;

const handleModalok = () => {
  modalLoading.value = true;
  user.value.password = hexMd5(user.value.password + KEY);
  axios.post("/user/save", user.value).then((resp) => {
    const data = resp.data;
    if (data.success) {
      modalLoading.value = false;
      modalVisible.value = false; // 关闭对话框

      // 重新加载列表
      handleQuery({
        page: pagination.value.current,
        size: pagination.value.pageSize,
      });
    } else {
      message.error(data.message);
    }
  });
};

const showchangepasswordModalok = (record: any) => {
  passwordModalVisible.value = true;
  user.value = Tool.copy(record);
};

const passwordone = ref();
const passwordtow = ref();
const passwordModalLoading = ref();
const passwordModalVisible = ref();
const passwordchange = () => {
  passwordModalLoading.value = true;
  if (passwordone.value === passwordtow.value) {
    user.value.password = hexMd5(passwordone.value + KEY);
    axios.post("/user/save", user.value).then((resp) => {
      const data = resp.data;
      if (data.success) {
        passwordModalLoading.value = false;
        passwordModalVisible.value = false; // 关闭对话框

        message.success("修改成功");
        passwordone.value = "";
        passwordtow.value = "";
        // 重新加载列表
        handleQuery({
          page: pagination.value.current,
          size: pagination.value.pageSize,
        });
      } else {
        message.error(data.message);
      }
    });
  } else {
    message.error("密码一与密码二不一致，请重新修改");
    passwordtow.value = "";
  }
};

const handleDelete = (id: number) => {
  axios.delete("/user/remove/" + id).then((resp) => {
    const data = resp.data;
    if (data.success) {
      alert("删除成功");
      handleQuery({
        page: pagination.value.current,
        size: pagination.value.pageSize,
      });
    } else {
      alert("删除失败");
    }
  });
};

//表格点击页面触发
const handleTableChange = (pagination: any) => {
  console.log(pagination);
  handleQuery({
    page: pagination.current,
    size: pagination.pageSize,
  });
};
</script>