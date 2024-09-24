<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-card>
          <a-col :span="8">
            <a-statistic title="总阅读数" :value="statistic.viewCount">
              <template #suffix>
                <UserOutlied />
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="8">
            <a-statistic title="总点赞数" :value="statistic.voteCount">
              <template #suffix>
                <like-outlined />
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="8">
            <a-statistic
              title="点赞率"
              :value="(statistic.voteCount / statistic.viewCount) * 100"
              :precision="2"
              suffix="%"
              :value-style="{ color: '#cf1322' }"
            >
              <template #suffix>
                <like-outlined />
              </template>
            </a-statistic>
          </a-col>
        </a-card>
      </a-col>
    </a-row>
    <br />
    <a-row :gutter="16">
      <a-col :span="12">
        <a-card>
          <a-row>
            <a-col :span="12">
              <a-statistic
                title="今日阅读"
                :value="statistic.todayViewCount"
                style="margin-right: 50px"
              >
                <template #suffix>
                  <UserOutlined />
                </template>
              </a-statistic>
            </a-col>
            <a-col :span="12">
              <a-statistic
                title="今日点赞"
                :value="statistic.todayVoteCount"
                style="margin-right: 50px"
              >
                <template #suffix>
                  <like-outlined />
                </template>
              </a-statistic>
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <a-col :span="12">
        <a-card>
          <a-row>
            <a-col :span="12">
              <a-statistic
                title="预计今日阅读"
                :value="statistic.todayViewIncrease"
                :value-style="{ color: '#0000ff' }"
              >
                <template #suffix>
                  <UserOutlined />
                </template>
              </a-statistic>
            </a-col>

            <a-col :span="12">
              <a-statistic
                title="预计今日阅读增长"
                :value="statistic.todayViewIncreaseRateAbs"
                :precision="2"
                suffix="%"
                class="demo-class"
                :value-style="
                  statistic.todayViewIncreaseRateAbs < 0
                    ? { color: '#3f860' }
                    : { color: '#cf1322' }
                "
              >
                <template>
                  <arrow-down-outlined
                    v-if="statistic.todayViewIncreaseRateAbs < 0"
                  />
                  <arrow-down-outlined
                    v-if="statistic.todayViewIncreaseRateAbs >= 0"
                  />
                </template>
              </a-statistic>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>

    <br />

    <a-row>
      <a-col :span="24" id="main-col">
        <div id="main" style="width: 100%; height: 300px"></div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { UserOutlined } from "@ant-design/icons-vue";
import axios from "axios";
import { onMounted, ref } from "vue";
import * as echarts from 'echarts'

const statistic = ref();
statistic.value = {};
const getStatistic = () => {
  axios.get("/ebookSnapshot/getStatistic").then((resp) => {
    const data = resp.data;
    if (data.success) {
      const statisticResp = data.content;
      //设置今日数
      statistic.value.viewCount = statisticResp[1].viewCount;
      statistic.value.voteCount = statisticResp[1].voteCount;
      statistic.value.todayViewCount = statisticResp[1].viewIncrease;
      statistic.value.todayVoteCount = statisticResp[1].voteIncrease;

      const now = new Date();
      const nowRate = (now.getHours() * 60 + now.getMinutes()) / (60 * 24);

      //今日预计总阅读数
      statistic.value.todayViewIncrease = parseInt(
        String(statisticResp[0].viewIncrease / nowRate)
      );
      if (statisticResp[0].viewIncrease === 0) {
        statistic.value.todayViewIncreaseRate = 100;
      } else {
        statistic.value.todayViewIncreaseRateAbs =
          ((statistic.value.todayViewIncrease - statisticResp[0].viewIncrease) /statisticResp[0].viewIncrease) *100;
      }
      //绝对值显示
      statistic.value.todayViewIncreaseRateAbs = Math.abs(
        statistic.value.todayViewIncreaseRateAbs
      );
    }
  });
};


// const testEcharts=()=>{
//   const myChart = echarts.init(document.getElementById('main'))
//   const option = {
//     xAxis:{
//       type:'category',
//       data:['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
//     },
//     yAxis:{
//       type:'value'
//     },
//     series:[
//       {
//         data:[100,400,200,250,666,42,410],
//         type:'line'
//       }
//     ]
//   };
//   //使用指定的配置项和数据
//   myChart.setOption(option);
// }

//获得30天数据图表
//获得30天数据图标
const init30DayEcharts = (list:any)=>{
   const myChart = echarts.init(document.getElementById("main"));
   const xAxis = [];
   const seriesView = [];
   const seriesVote = [];
   for(let i=0;i<list.length;i++){
        const record = list[i];
        xAxis.push(record.date);
        seriesView.push(record.viewCount);
        seriesVote.push(record.voteCount);
    }
    //指定图标配置和数据
    const option = {
        title:{
            text: '海洋科普网30天访问趋势图'
        },
        Tooltip:{
            trigger: 'axis'
        },
        legend:{
            data: ['总阅读数','总点赞数']
        },
        grid:{
            left: '1%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        toolbox:{
            feature:{
                saveAsImage:{}
            }
        },
        xAxis:{
            type: 'category',
            boundaryGap: false,
            data: xAxis
        },
        yAxis:{
            type:'value'
        },
        series:[ 
            {
                name: '总阅读数',
                type: 'line',
                data: seriesView,
                smooth: true
            },
              {
                name: '总点赞数',
                type: 'line',
                data: seriesVote,
                smooth: true
            }
        ]
    };
    myChart.setOption(option);
}
//获取后台30天数据
const get30DayStatistic = ()=>{
   axios.get('/ebookSnapshot/get30Statistic').then((resp)=>{
       const data = resp.data;
       if(data.success){
           const statisticList = data.content;
           console.log("slist",statisticList);
           init30DayEcharts(statisticList);
       }
   })
}
onMounted(()=>{
   getStatistic();
   //testEcharts();
   get30DayStatistic();
})

</script>