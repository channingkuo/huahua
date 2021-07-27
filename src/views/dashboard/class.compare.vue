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
      <a-select v-model="classNameLeft" style="width: 140px" @change="classChangeLeft">
        <template v-for="classItem in classList">
          <a-select-option :key="classItem.cea_class_id" :value="classItem.cea_class_name">
            {{ classItem.cea_class_name }}
          </a-select-option>
        </template>
      </a-select>
      <span class="pl-2">测试：</span>
      <a-select
        v-model="testNameLeft"
        style="width: 140px"
        placeholder="请选择测试内容"
        @change="testNameChangeLeft"
      >
        <template v-for="test in testNames">
          <a-select-option :key="test" :value="test">
            {{ test }}
          </a-select-option>
        </template>
      </a-select>
      <span class="pl-2 pr-2 font-bold">比较</span>
      <span class="pl-2">班级：</span>
      <a-select v-model="classNameRight" style="width: 140px" @change="classChangeRight">
        <template v-for="classItem in classList">
          <a-select-option :key="classItem.cea_class_id" :value="classItem.cea_class_name">
            {{ classItem.cea_class_name }}
          </a-select-option>
        </template>
      </a-select>
      <span class="pl-2">测试：</span>
      <a-select
        v-model="testNameRight"
        style="width: 140px"
        placeholder="请选择测试内容"
        @change="testNameChangeRight"
      >
        <template v-for="test in testNamesRight">
          <a-select-option :key="test" :value="test">
            {{ test }}
          </a-select-option>
        </template>
      </a-select>
    </div>

    <div id="class-compare" class="w-full h-96"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { overview } from './dashboard.service'
import { getClassList } from '../term/term.service'
import * as echarts from 'echarts'

export default {
  name: 'class-compare',
  components: {},
  data() {
    return {
      term: '',
      classNameLeft: '',
      classNameRight: '该学期暂无其他班级',
      classList: [],
      testNames: [],
      testNameLeft: '',
      testNamesRight: [],
      testNameRight: '',

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
      this.chart = echarts.init(document.getElementById('class-compare'))
      this.chart.showLoading({ text: '正在加载...' })
      const classList = await this.loadClassList(this.term)
      this.classList = classList
      if (classList.length > 0) {
        this.classNameLeft = classList[0].cea_class_name
        if (classList.length > 1) {
          this.classNameRight = classList[1].cea_class_name
        }
      } else {
        this.classNameLeft = '该学期暂无班级'
      }
      const overviewData = await this.loadOverviewData(this.term, this.classNameLeft)
      this.testNames = overviewData.testNames
      if (this.testNames.length > 0) {
        this.testNameLeft = this.testNames[0]
      } else {
        this.testNameLeft = '暂无考试内容'
      }
      if (this.classNameRight !== '该学期暂无其他班级') {
        const overviewData2 = await this.loadOverviewData(this.term, this.classNameRight)
        this.testNamesRight = overviewData2.testNames
        if (this.testNamesRight.length > 0) {
          this.testNameRight = this.testNamesRight[0]
        } else {
          this.testNameRight = '暂无考试内容'
        }
      }

      const data = await this.loadData(this.term, this.className, this.testName)
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
    async loadData(term, className, testNames) {
      // const payload = { term, className, kind: '数学', testNames }
      // const data = await testsAverageStudent(payload, this.userInfo.ceaTeacherId)
      // for (let i = 0; i < data.avgList.length; i++) {
      //   const avg = data.avgList[i]
      //   data.avgList[i] = avg.toFixed(2)
      // }
      // return data
    },
    async termChange() {
      // this.chart.showLoading({ text: '正在加载...' })
      // const data = await this.loadTestsAverageStudent(this.term, this.className, this.testName)
      // const option = this.chart.getOption()
      // option.series[0].data = data.avgList
      // option.xAxis[0].data = data.studentList
      // this.chart.hideLoading()
      // this.chart.setOption(option)
    },
    classChangeLeft() {
      // this.chart.showLoading({ text: '正在加载...' })
      // const data = await this.loadTestsAverageStudent(this.term, this.className, this.testName)
      // const option = this.chart.getOption()
      // option.series[0].data = data.avgList
      // option.xAxis[0].data = data.studentList
      // this.chart.hideLoading()
      // this.chart.setOption(option)
    },
    classChangeRight() {},
    testNameChangeLeft() {
      // this.chart.showLoading({ text: '正在加载...' })
      // const data = await this.loadTestsAverageStudent(this.term, this.className, this.testName)
      // const option = this.chart.getOption()
      // option.series[0].data = data.avgList
      // option.xAxis[0].data = data.studentList
      // this.chart.hideLoading()
      // this.chart.setOption(option)
    },
    testNameChangeRight() {},
    setChartOption(data) {
      const option = {
        title: {
          text: '班级比较'
        },
        tooltip: {
          position: function (point, params, dom, rect, size) {
            return { left: point[0] + 50, top: '10%' }
          },
          axisPointer: {
            type: 'shadow'
          }
        },
        radar: [
          {
            indicator: [
              { text: '100分段' },
              { text: '90分段' },
              { text: '80分段' },
              { text: '70分段' },
              { text: '不及格' }
            ],
            radius: 120,
            startAngle: 90,
            splitNumber: 4,
            name: {
              color: '#fff',
              backgroundColor: '#666',
              borderRadius: 3,
              padding: [3, 5]
            }
          }
        ],
        series: [
          {
            name: '班级比较',
            type: 'radar',
            emphasis: {
              lineStyle: {
                width: 4
              }
            },
            data: [
              {
                value: [20, 18, 10, 5, 9],
                name: this.classNameLeft,
                areaStyle: {
                  color: 'rgb(25, 228, 152)'
                },
                label: {
                  show: true,
                  color: 'blue',
                  offset: [0, 6],
                  formatter: function (params) {
                    return params.value + '个'
                  }
                }
              },
              {
                value: [6, 5, 30, 10, 10],
                name: this.classNameRight,
                areaStyle: {
                  color: 'rgba(255, 228, 52, 0.6)'
                },
                label: {
                  show: true,
                  color: 'red',
                  offset: [0, 6],
                  formatter: function (params) {
                    return params.value + '个'
                  }
                }
              }
            ]
          }
        ]
      }
      this.chart.hideLoading()
      this.chart.setOption(option, true)
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'termOptions'])
  }
}
</script>

<style lang="scss" scoped>
</style>
