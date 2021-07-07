<template>
  <div class="dashboard">
    <div class="h-14 pb-2 flex justify-start items-center">
      <span class="pl-2">学期：</span>
      <a-select v-model="term" style="width: 140px" @change="handleTermChange">
        <template v-for="option in termOptions">
          <a-select-option :value="option.value" :key="option.value">
            {{ option.label }}
          </a-select-option>
        </template>
      </a-select>
      <span class="pl-2">班级：</span>
      <a-select v-model="className" style="width: 140px" @change="handleClassChange">
        <template v-for="classItem in classList">
          <a-select-option :key="classItem.cea_class_id" :value="classItem.cea_class_name">
            {{ classItem.cea_class_name }}
          </a-select-option>
        </template>
      </a-select>
    </div>
    <div id="overview" class="w-full h-96"></div>
    <div class="w-full flex justify-start items-center">
      <div class="w-1/2">
        <div class="h-14 pb-2 flex justify-start items-center">
          <span class="pl-2">考试内容：</span>
          <a-select v-model="testName" style="width: 140px" @change="handleTestChange">
            <template v-for="test in testNameList">
              <a-select-option :key="test" :value="test">
                {{ test }}
              </a-select-option>
            </template>
          </a-select>
        </div>
        <div id="single-test" class="w-full h-96"></div>
      </div>
      <div class="w-1/2">
        <div class="h-14 pb-2 flex justify-start items-center">
          <span class="pl-2">学生：</span>
          <a-select v-model="studentName" style="width: 140px" @change="handleStudentChange">
            <template v-for="name in studentList">
              <a-select-option :key="name" :value="name">
                {{ name }}
              </a-select-option>
            </template>
          </a-select>
        </div>
        <div id="single-student-test" class="w-full h-96"></div>
      </div>
    </div>
    <div class="h-20"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'
import { overview, singleTest, singleStudentTest } from './dashboard.service'
import { getClassList } from '../term/term.service'

export default {
  name: 'dashboard',
  components: {},
  data() {
    return {
      term: '',
      className: '',
      classList: [],
      testName: '',
      testNameList: [],
      studentName: '',
      studentList: [],

      overviewChart: null,
      singleTestChart: null,
      singleStudentTestChart: null
    }
  },
  created() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    this.term = `${year}-${month < 9 ? '上' : '下'}半学期`
  },
  mounted() {
    this.$nextTick(async () => {
      this.overviewChart = echarts.init(document.getElementById('overview'))
      this.singleTestChart = echarts.init(document.getElementById('single-test'))
      this.singleStudentTestChart = echarts.init(document.getElementById('single-student-test'))
      this.overviewChart.showLoading({ text: '正在加载...' })
      this.singleTestChart.showLoading({ text: '正在加载...' })
      this.singleStudentTestChart.showLoading({ text: '正在加载...' })
      await this.loadClassList()

      const overviewData = await this.loadOverviewData()
      this.setOverviewOption(overviewData)

      const singleTestData = await this.loadSingleTestData()
      this.setSingleTestOption(singleTestData)

      const singleStudentTestData = await this.loadSingleStudentTestData()
      this.setSingleStudentTestOption(singleStudentTestData)
    })
  },
  methods: {
    async loadClassList() {
      const data = await getClassList(this.userInfo.ceaTeacherId, this.term)
      this.classList = data
      if (this.classList.length > 0) {
        this.className = this.classList[0].cea_class_name
      } else {
        this.className = '该学期暂无班级'
      }
    },
    async handleTermChange() {
      await this.loadClassList()

      const overviewData = await this.loadOverviewData()
      this.setOverviewOption(overviewData)
    },
    async handleClassChange() {
      const overviewData = await this.loadOverviewData()
      this.setOverviewOption(overviewData)
    },
    async loadOverviewData() {
      const payload = { term: this.term, className: this.className, kind: '数学' }
      return await overview(payload, this.userInfo.ceaTeacherId)
    },
    async loadSingleTestData() {
      const payload = {
        term: this.term,
        className: this.className,
        kind: '数学',
        testName: this.testName
      }
      return await singleTest(payload, this.userInfo.ceaTeacherId)
    },
    async loadSingleStudentTestData() {
      const payload = {
        term: this.term,
        className: this.className,
        kind: '数学',
        name: this.studentName
      }
      return await singleStudentTest(payload, this.userInfo.ceaTeacherId)
    },
    setOverviewOption(overviewData) {
      this.testNameList = overviewData.testNames
      if (this.testNameList.length > 0) {
        this.testName = this.testNameList[0]
      } else {
        this.testName = '暂无考试内容'
      }
      this.studentList = overviewData.studentNames
      if (this.studentList.length > 0) {
        this.studentName = this.studentList[0]
      } else {
        this.studentName = '暂无学生'
      }

      this.overviewChart.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15
      }
      const labelOption = {
        show: true,
        position: 'insideBottom',
        distance: 15,
        align: 'left',
        verticalAlign: 'middle',
        rotate: 90,
        formatter: '{c}  {name|{a}}',
        fontSize: 16,
        rich: {
          name: {}
        }
      }
      const option = {
        title: {
          text: '总览'
        },
        tooltip: {
          trigger: 'axis',
          position: function (point, params, dom, rect, size) {
            return { left: point[0] + 50, top: '10%' }
          },
          axisPointer: {
            type: 'shadow'
          }
        },
        dataZoom: [
          // {
          //   type: 'inside',
          //   zoomLock: true,
          //   start: 0,
          //   end: 10
          // },
          {
            type: 'slider',
            zoomLock: true,
            start: 0,
            end: 12,
            xAxisIndex: 0
          }
        ],
        legend: {
          data: []
        },
        toolbox: {
          show: true,
          showTitle: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            // dataView: {show: true, readOnly: false},
            // magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: overviewData.studentNames
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: []
      }
      if (overviewData.testNames.length <= 0) {
        option.legend.data = ['暂无数据']
      } else {
        option.legend.data = overviewData.testNames
      }
      if (overviewData.studentNames.length <= 0) {
        option.xAxis[0].data = ['暂无数据']
      } else {
        option.xAxis[0].data = overviewData.studentNames
      }
      const series = []
      for (let i = 0; i < overviewData.testNames.length; i++) {
        const testName = overviewData.testNames[i]

        series.push({
          name: testName,
          type: 'bar',
          barGap: 0,
          label: labelOption,
          emphasis: {
            focus: 'series'
          },
          data: overviewData[testName]
        })
      }
      series.push({
        name: '平均分',
        type: 'line',
        label: {
          show: true,
          position: 'insideBottom',
          distance: 15,
          align: 'left',
          verticalAlign: 'middle',
          formatter: '{c}  {name|{a}}',
          color: 'red',
          fontWeight: 'bold',
          fontSize: 20,
          rich: {
            name: {}
          }
        },
        lineStyle: { color: 'red' },
        emphasis: {
          focus: 'series'
        },
        data: overviewData['平均分']
      })

      option.series = series
      this.overviewChart.hideLoading()
      this.overviewChart.setOption(option, true)
    },
    async handleTestChange() {
      const singleTestData = await this.loadSingleTestData()
      this.setSingleTestOption(singleTestData)
    },
    setSingleTestOption(singleTestData) {
      this.singleTestChart.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15
      }
      const option = {
        title: {},
        tooltip: {
          trigger: 'axis',
          position: function (point, params, dom, rect, size) {
            return { left: point[0] + 50, top: '10%' }
          },
          axisPointer: {
            type: 'shadow'
          }
        },
        dataZoom: [
          {
            type: 'slider',
            zoomLock: true,
            start: 0,
            end: 40,
            xAxisIndex: 0
          }
        ],
        legend: {
          data: []
        },
        toolbox: {
          show: true,
          showTitle: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: singleTestData.studentList
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: this.testName,
            type: 'bar',
            barGap: 0,
            label: {
              show: true,
              position: 'insideBottom',
              distance: 15,
              verticalAlign: 'middle',
              fontWeight: 'bold',
              fontSize: 16
            },
            emphasis: {
              focus: 'series'
            },
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },
            data: singleTestData.scoreList,
            markLine: {
              label: {
                show: true,
                position: 'middle',
                formatter: '{b}: {c}'
              },
              lineStyle: {
                color: 'red'
              },
              data: [
                { name: '最低分', yAxis: singleTestData.min },
                { name: '平均分', yAxis: singleTestData.avg },
                { name: '最高分', yAxis: singleTestData.max }
              ]
            }
          }
        ]
      }
      this.singleTestChart.hideLoading()
      this.singleTestChart.setOption(option, true)
    },
    async handleStudentChange() {
      const singleStudentTestData = await this.loadSingleStudentTestData()
      this.setSingleStudentTestOption(singleStudentTestData)
    },
    setSingleStudentTestOption(studentData) {
      this.singleTestChart.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15
      }
      const option = {
        title: {},
        tooltip: {
          trigger: 'axis',
          position: function (point, params, dom, rect, size) {
            return { left: point[0] + 50, top: '10%' }
          },
          axisPointer: {
            type: 'shadow'
          }
        },
        // dataZoom: [
        //   {
        //     type: 'slider',
        //     zoomLock: true,
        //     start: 0,
        //     end: 40,
        //     xAxisIndex: 0
        //   }
        // ],
        legend: {
          data: []
        },
        toolbox: {
          show: true,
          showTitle: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            axisLabel: { rotate: 90 },
            data: studentData.testNames
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: this.studentName,
            type: 'bar',
            barGap: 0,
            label: {
              show: true,
              position: 'insideBottom',
              distance: 15,
              verticalAlign: 'middle',
              fontWeight: 'bold',
              fontSize: 16
            },
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },
            emphasis: {
              focus: 'series'
            },
            data: studentData.scoreList,
            markLine: {
              label: {
                show: true,
                position: 'middle',
                formatter: '{b}: {c}'
              },
              lineStyle: {
                color: 'red'
              },
              data: [
                { name: '最低分', yAxis: studentData.min },
                { name: '平均分', yAxis: studentData.avg },
                { name: '最高分', yAxis: studentData.max }
              ]
            }
          }
        ]
      }
      this.singleStudentTestChart.hideLoading()
      this.singleStudentTestChart.setOption(option, true)
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'termOptions'])
  }
}
</script>

<style lang="scss" scoped>
</style>
