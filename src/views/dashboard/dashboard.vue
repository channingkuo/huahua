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

    <div class="h-14 pb-2 flex justify-start items-center">
      <span class="pl-2">学期：</span>
      <a-select v-model="section2Term" style="width: 140px" @change="section2TermChange">
        <template v-for="option in termOptions">
          <a-select-option :value="option.value" :key="option.value">
            {{ option.label }}
          </a-select-option>
        </template>
      </a-select>
      <span class="pl-2">班级：</span>
      <a-select v-model="section2ClassName" style="width: 140px" @change="section2ClassChange">
        <template v-for="classItem in section2ClassList">
          <a-select-option :key="classItem.cea_class_id" :value="classItem.cea_class_name">
            {{ classItem.cea_class_name }}
          </a-select-option>
        </template>
      </a-select>
      <span class="pl-2">考试内容：</span>
      <a-select v-model="section2TestName" style="width: 140px" @change="section2TestChange">
        <template v-for="test in section2TestNameList">
          <a-select-option :key="test" :value="test">
            {{ test }}
          </a-select-option>
        </template>
      </a-select>
      <a-tooltip placement="top" title="由高到低排序">
        <a-icon class="size-change m-5" type="sort-ascending" @click="onSortTestScore" />
      </a-tooltip>
    </div>
    <div id="single-test" class="w-full h-96"></div>

    <div class="h-14 pb-2 flex justify-start items-center">
      <span class="pl-2">学期：</span>
      <a-select v-model="section3Term" style="width: 140px" @change="section3TermChange">
        <template v-for="option in termOptions">
          <a-select-option :value="option.value" :key="option.value">
            {{ option.label }}
          </a-select-option>
        </template>
      </a-select>
      <span class="pl-2">班级：</span>
      <a-select v-model="section3ClassName" style="width: 140px" @change="section3ClassChange">
        <template v-for="classItem in section3ClassList">
          <a-select-option :key="classItem.cea_class_id" :value="classItem.cea_class_name">
            {{ classItem.cea_class_name }}
          </a-select-option>
        </template>
      </a-select>
      <span class="pl-2">学生：</span>
      <a-select v-model="studentName" style="width: 140px" @change="section3StudentChange">
        <template v-for="name in studentList">
          <a-select-option :key="name" :value="name">
            {{ name }}
          </a-select-option>
        </template>
      </a-select>
    </div>
    <div id="single-student-test" class="w-full h-96"></div>

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

      section2Term: '',
      section2ClassName: '',
      section2ClassList: [],
      section2TestName: '',
      section2TestNameList: [],

      section3Term: '',
      section3ClassName: '',
      section3ClassList: [],
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
    this.section2Term = `${year}-${month < 9 ? '上' : '下'}半学期`
    this.section3Term = `${year}-${month < 9 ? '上' : '下'}半学期`
  },
  mounted() {
    this.$nextTick(async () => {
      this.overviewChart = echarts.init(document.getElementById('overview'))
      this.singleTestChart = echarts.init(document.getElementById('single-test'))
      this.singleStudentTestChart = echarts.init(document.getElementById('single-student-test'))
      this.overviewChart.showLoading({ text: '正在加载...' })
      this.singleTestChart.showLoading({ text: '正在加载...' })
      this.singleStudentTestChart.showLoading({ text: '正在加载...' })
      const classList = await this.loadClassList(this.term)
      this.classList = classList
      this.section2ClassList = classList
      this.section3ClassList = classList
      if (classList.length > 0) {
        this.className = classList[0].cea_class_name
        this.section2ClassName = classList[0].cea_class_name
        this.section3ClassName = classList[0].cea_class_name
      } else {
        this.className = '该学期暂无班级'
        this.section2ClassName = '该学期暂无班级'
        this.section3ClassName = '该学期暂无班级'
      }

      const overviewData = await this.loadOverviewData(this.term, this.className)
      this.section2TestNameList = overviewData.testNames
      if (this.section2TestNameList.length > 0) {
        this.section2TestName = this.section2TestNameList[0]
      } else {
        this.section2TestName = '暂无考试内容'
      }
      this.studentList = overviewData.studentNames
      if (this.studentList.length > 0) {
        this.studentName = this.studentList[0]
      } else {
        this.studentName = '暂无学生'
      }
      this.setOverviewOption(overviewData)

      const singleTestData = await this.loadSingleTestData(
        this.section2Term,
        this.section2ClassName,
        this.section2TestName
      )
      this.setSingleTestOption(singleTestData)

      const singleStudentTestData = await this.loadSingleStudentTestData(
        this.section3Term,
        this.section3ClassName,
        this.studentName
      )
      this.setSingleStudentTestOption(singleStudentTestData)
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
    async handleTermChange() {
      const classList = await this.loadClassList(this.term)
      this.classList = classList
      if (this.classList.length > 0) {
        this.className = this.classList[0].cea_class_name
      } else {
        this.className = '该学期暂无班级'
      }
      this.overviewChart.showLoading({ text: '正在加载...' })
      const overviewData = await this.loadOverviewData(this.term, this.className)
      this.setOverviewOption(overviewData)
    },
    setOverviewOption(overviewData) {
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
          {
            type: 'slider',
            zoomLock: false,
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
    async handleClassChange() {
      this.overviewChart.showLoading({ text: '正在加载...' })
      const overviewData = await this.loadOverviewData(this.term, this.className)
      this.setOverviewOption(overviewData)
    },

    async loadSingleTestData(term, className, testName) {
      const payload = {
        term: term,
        className: className,
        kind: '数学',
        testName: testName
      }
      return await singleTest(payload, this.userInfo.ceaTeacherId)
    },
    async section2TermChange() {
      this.singleTestChart.showLoading({ text: '正在加载...' })
      const classList = await this.loadClassList(this.section2Term)
      this.section2ClassList = classList
      if (this.section2ClassList.length > 0) {
        this.section2ClassName = this.section2ClassList[0].cea_class_name
      } else {
        this.section2ClassName = '该学期暂无班级'
      }

      const overviewData = await this.loadOverviewData(this.section2Term, this.section2ClassName)
      this.section2TestNameList = overviewData.testNames
      if (this.section2TestNameList.length > 0) {
        this.section2TestName = this.section2TestNameList[0]
      } else {
        this.section2TestName = '暂无考试内容'
      }

      const singleTestData = await this.loadSingleTestData(
        this.section2Term,
        this.section2ClassName,
        this.section2TestName
      )
      const option = this.singleTestChart.getOption()
      option.series[0].data = singleTestData.scoreList
      option.series[0].name = this.section2TestName
      option.series[0].markLine.data[0].yAxis = singleTestData.min || 0
      option.series[0].markLine.data[1].yAxis = singleTestData.avg
      option.series[0].markLine.data[2].yAxis = singleTestData.max || 0
      option.xAxis[0].data = singleTestData.studentList
      this.singleTestChart.hideLoading()
      this.singleTestChart.setOption(option)
    },
    async section2ClassChange() {
      this.singleTestChart.showLoading({ text: '正在加载...' })
      const overviewData = await this.loadOverviewData(this.section2Term, this.section2ClassName)
      this.section2TestNameList = overviewData.testNames
      if (this.section2TestNameList.length > 0) {
        this.section2TestName = this.section2TestNameList[0]
      } else {
        this.section2TestName = '暂无考试内容'
      }

      const singleTestData = await this.loadSingleTestData(
        this.section2Term,
        this.section2ClassName,
        this.section2TestName
      )
      const option = this.singleTestChart.getOption()
      option.series[0].data = singleTestData.scoreList
      option.series[0].name = this.section2TestName
      option.series[0].markLine.data[0].yAxis = singleTestData.min || 0
      option.series[0].markLine.data[1].yAxis = singleTestData.avg
      option.series[0].markLine.data[2].yAxis = singleTestData.max || 0
      option.xAxis[0].data = singleTestData.studentList
      this.singleTestChart.hideLoading()
      this.singleTestChart.setOption(option)
    },
    async section2TestChange() {
      const singleTestData = await this.loadSingleTestData(
        this.section2Term,
        this.section2ClassName,
        this.section2TestName
      )
      const option = this.singleTestChart.getOption()
      option.series[0].data = singleTestData.scoreList
      option.series[0].name = this.section2TestName
      option.series[0].markLine.data[0].yAxis = singleTestData.min || 0
      option.series[0].markLine.data[1].yAxis = singleTestData.avg
      option.series[0].markLine.data[2].yAxis = singleTestData.max || 0
      option.xAxis[0].data = singleTestData.studentList
      this.singleTestChart.setOption(option)
    },
    onSortTestScore() {
      const option = this.singleTestChart.getOption()
      option.series[0].realtimeSort = true
      this.singleTestChart.setOption(option)
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
        title: {
          text: '考试成绩'
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
            axisLabel: { rotate: 90 },
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
            name: this.section2TestName,
            type: 'bar',
            barGap: 0,
            // realtimeSort: true,
            label: {
              show: true,
              position: 'insideBottom',
              distance: 15,
              verticalAlign: 'middle',
              fontWeight: 'bold',
              fontSize: 16,
              valueAnimation: true
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
                { name: '最低分', yAxis: singleTestData.min || 0 },
                { name: '平均分', yAxis: singleTestData.avg },
                { name: '最高分', yAxis: singleTestData.max || 0 }
              ]
            }
          }
        ]
      }
      this.singleTestChart.hideLoading()
      this.singleTestChart.setOption(option, true)
    },

    async loadSingleStudentTestData(term, className, studentName) {
      const payload = {
        term: term,
        className: className,
        kind: '数学',
        name: studentName
      }
      const data = await singleStudentTest(payload, this.userInfo.ceaTeacherId)
      return data
    },
    async section3TermChange() {
      this.singleStudentTestChart.showLoading({ text: '正在加载...' })
      const classList = await this.loadClassList(this.section3Term)
      this.section3ClassList = classList
      if (this.section3ClassList.length > 0) {
        this.section3ClassName = this.section3ClassList[0].cea_class_name
      } else {
        this.section3ClassName = '该学期暂无班级'
      }

      const overviewData = await this.loadOverviewData(this.section3Term, this.section3ClassName)
      this.studentList = overviewData.studentNames
      if (this.studentList.length > 0) {
        this.studentName = this.studentList[0]
      } else {
        this.studentName = '暂无学生'
      }

      const studentData = await this.loadSingleStudentTestData(
        this.section3Term,
        this.section3ClassName,
        this.studentName
      )
      const option = this.singleStudentTestChart.getOption()
      option.series[0].data = studentData.scoreList
      option.series[0].name = this.studentName
      option.series[0].markLine.data[0].yAxis = studentData.min || 0
      option.series[0].markLine.data[1].yAxis = studentData.avg
      option.series[0].markLine.data[2].yAxis = studentData.max || 0
      option.xAxis[0].data = studentData.testNames
      option.xAxis[0].axisLabel = { rotate: 30 }
      this.singleStudentTestChart.hideLoading()
      this.singleStudentTestChart.setOption(option)
    },
    async section3ClassChange() {
      this.singleStudentTestChart.showLoading({ text: '正在加载...' })
      const overviewData = await this.loadOverviewData(this.section3Term, this.section3ClassName)
      this.studentList = overviewData.studentNames
      if (this.studentList.length > 0) {
        this.studentName = this.studentList[0]
      } else {
        this.studentName = '暂无学生'
      }

      const studentData = await this.loadSingleStudentTestData(
        this.section3Term,
        this.section3ClassName,
        this.studentName
      )
      const option = this.singleTestChart.getOption()
      option.series[0].data = studentData.scoreList
      option.series[0].name = this.studentName
      option.series[0].markLine.data[0].yAxis = studentData.min || 0
      option.series[0].markLine.data[1].yAxis = studentData.avg
      option.series[0].markLine.data[2].yAxis = studentData.max || 0
      option.xAxis[0].data = studentData.testNames
      option.xAxis[0].axisLabel = { rotate: 30 }
      this.singleStudentTestChart.hideLoading()
      this.singleStudentTestChart.setOption(option)
    },
    async section3StudentChange() {
      const singleStudentTestData = await this.loadSingleStudentTestData(
        this.section2Term,
        this.section2ClassName,
        this.studentName
      )
      const option = this.singleTestChart.getOption()
      option.series[0].data = singleStudentTestData.scoreList
      option.series[0].name = this.studentName
      option.series[0].markLine.data[0].yAxis = singleStudentTestData.min || 0
      option.series[0].markLine.data[1].yAxis = singleStudentTestData.avg
      option.series[0].markLine.data[2].yAxis = singleStudentTestData.max || 0
      option.xAxis[0].data = singleStudentTestData.testNames
      option.xAxis[0].axisLabel = { rotate: 30 }
      this.singleStudentTestChart.hideLoading()
      this.singleStudentTestChart.setOption(option)
    },
    setSingleStudentTestOption(studentData) {
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
            axisLabel: { rotate: 30 },
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
  .size-change {
    font-size: 20px;
    z-index: 10000;
  }
  .size-change:hover {
    color: $primary-color;
    transform: scale(1.3);
    transition: transform 0.5s;
  }
</style>
