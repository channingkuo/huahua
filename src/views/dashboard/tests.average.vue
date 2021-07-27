<template>
  <div class="w-full">
    <div class="h-14 pb-2 flex justify-start items-center">
      <span class="pl-2">学期：</span>
      <a-select v-model="term" style="width: 140px" @change="termChange">
        <template v-for="option in termOptions">
          <a-select-option :value="option.value" :key="option.value">
            {{ option.label }}
          </a-select-option>
        </template>
      </a-select>
      <span class="pl-2">班级：</span>
      <a-select v-model="className" style="width: 140px" @change="classChange">
        <template v-for="classItem in classList">
          <a-select-option :key="classItem.cea_class_id" :value="classItem.cea_class_name">
            {{ classItem.cea_class_name }}
          </a-select-option>
        </template>
      </a-select>
      <span class="pl-2">测试：</span>
      <a-select
        v-model="testName"
        style="width: calc(100% - 600px)"
        mode="multiple"
        placeholder="请选择测试内容"
        @change="testNameChange"
      >
        <template v-for="test in testNames">
          <a-select-option :key="test" :value="test">
            {{ test }}
          </a-select-option>
        </template>
      </a-select>
      <a-tooltip placement="top" title="由高到低排序">
        <a-icon class="size-change m-5" type="sort-ascending" @click="onSort" />
      </a-tooltip>
    </div>

    <div id="tests-average" class="w-full h-96"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { overview, testsAverageStudent } from './dashboard.service'
import { getClassList } from '../term/term.service'
import * as echarts from 'echarts'

export default {
  name: 'tests-average',
  components: {},
  data() {
    return {
      term: '',
      className: '',
      classList: [],
      testNames: [],
      testName: [],

      chart: null
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
      this.chart = echarts.init(document.getElementById('tests-average'))
      this.chart.showLoading({ text: '正在加载...' })

      const classList = await this.loadClassList(this.term)
      this.classList = classList
      if (classList.length > 0) {
        this.className = classList[0].cea_class_name
      } else {
        this.className = '该学期暂无班级'
      }

      const overviewData = await this.loadOverviewData(this.term, this.className)
      this.testNames = overviewData.testNames
      if (this.testNames.length > 0) {
        this.testName = [this.testNames[0]]
      } else {
        this.testName = ['暂无考试内容']
      }

      const data = await this.loadTestsAverageStudent(this.term, this.className, this.testName)
      this.setChartOption(data)
    })
  },
  methods: {
    async loadClassList(term) {
      const data = await getClassList(this.userInfo.ceaTeacherId, term)
      return data
    },
    async loadOverviewData(term, className) {
      const payload = { term: term, className: className, kind: '数学' }
      const data = await overview(payload, this.userInfo.ceaTeacherId)
      return data
    },
    async loadTestsAverageStudent(term, className, testNames) {
      const payload = { term, className, kind: '数学', testNames }
      const data = await testsAverageStudent(payload, this.userInfo.ceaTeacherId)
      for (let i = 0; i < data.avgList.length; i++) {
        const avg = data.avgList[i]
        data.avgList[i] = avg.toFixed(2)
      }
      return data
    },
    async termChange() {
      this.chart.showLoading({ text: '正在加载...' })

      const classList = await this.loadClassList(this.term)
      this.classList = classList
      if (classList.length > 0) {
        this.className = classList[0].cea_class_name
      } else {
        this.className = '该学期暂无班级'
      }

      const overviewData = await this.loadOverviewData(this.term, this.className)
      this.testNames = overviewData.testNames
      if (this.testNames.length > 0) {
        this.testName = [this.testNames[0]]
      } else {
        this.testName = ['暂无考试内容']
      }

      const data = await this.loadTestsAverageStudent(this.term, this.className, this.testName)
      const option = this.chart.getOption()
      option.series[0].data = data.avgList
      option.xAxis[0].data = data.studentList
      this.chart.hideLoading()
      this.chart.setOption(option)
    },
    async classChange() {
      this.chart.showLoading({ text: '正在加载...' })

      const overviewData = await this.loadOverviewData(this.term, this.className)
      this.testNames = overviewData.testNames
      if (this.testNames.length > 0) {
        this.testName = [this.testNames[0]]
      } else {
        this.testName = ['暂无考试内容']
      }

      const data = await this.loadTestsAverageStudent(this.term, this.className, this.testName)
      const option = this.chart.getOption()
      option.series[0].data = data.avgList
      option.xAxis[0].data = data.studentList
      this.chart.hideLoading()
      this.chart.setOption(option)
    },
    async testNameChange() {
      this.chart.showLoading({ text: '正在加载...' })
      const data = await this.loadTestsAverageStudent(this.term, this.className, this.testName)
      const option = this.chart.getOption()
      option.series[0].data = data.avgList
      option.xAxis[0].data = data.studentList
      this.chart.hideLoading()
      this.chart.setOption(option)
    },
    setChartOption(data) {
      this.chart.config = {
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
        formatter: '{c}',
        fontSize: 16,
        rich: {
          name: {}
        }
      }
      const option = {
        title: {
          text: '平均成绩'
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
          {
            type: 'slider',
            zoomLock: false,
            orient: 'vertical',
            right: 60,
            start: 0,
            end: 100,
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
            axisLabel: {
              formatter: function (value, index) {
                return value.split('').join('\n')
              }
            },
            data: data.studentList
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '平均成绩',
            type: 'bar',
            barGap: 0,
            label: labelOption,
            emphasis: {
              focus: 'series'
            },
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },
            data: data.avgList
          }
        ]
      }
      this.chart.hideLoading()
      this.chart.setOption(option, true)
    },
    onSort() {
      const option = this.chart.getOption()
      option.series[0].realtimeSort = true
      this.chart.setOption(option)
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'termOptions'])
  }
}
</script>

<style lang="scss" scoped>
</style>
