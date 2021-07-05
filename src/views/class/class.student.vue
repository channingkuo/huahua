<template>
  <a-page-header class="k-ant-page-header">
    <template slot="extra">
      <a-row type="flex" justify="space-between" align="bottom" :gutter="{ xs: 8, sm: 16, md: 24 }">
        <a-col :span="24">
          <a-row type="flex" justify="start" align="middle">
            <span class="search-field-control-header">学生姓名：</span>
            <a-input
              v-model="studentName"
              allowClear
              placeholder="输入学生姓名"
              @pressEnter="onSearch"
              :style="{ marginRight: '20px', width: '160px' }"
            />
            <a-button type="primary" @click="onSearch"> 筛选 </a-button>
          </a-row>
        </a-col>
      </a-row>
    </template>
    <a-row type="flex">
      <a-col :span="24">
        <a-table
          class="k-table"
          :columns="columns"
          :row-key="(record) => record.ceaClassId"
          :data-source="studentList"
          :loading="loading"
          :pagination="false"
        >
          <template slot="index" slot-scope="text, record, index">
            {{ index + 1 }}
          </template>
          <template slot="ceaStudentGender" slot-scope="text">
            <a-tag color="volcano" v-if="!text"> 男 </a-tag>
            <a-tag color="pink" v-if="text"> 女 </a-tag>
          </template>
          <template slot="ceaStudentStatus" slot-scope="text">
            <a-tag color="volcano" v-if="!text"> 禁用 </a-tag>
            <a-tag color="green" v-if="text"> 正常 </a-tag>
          </template>
          <template slot="operator">
            <div class="flex justify-around justify-items-center">test</div>
          </template>
        </a-table>
      </a-col>
    </a-row>
  </a-page-header>
</template>

<script>
import { classStudentList } from './class.service'
import { isEmpty } from '../../utils/index'

export default {
  name: 'Class-Student',
  components: {},
  data() {
    return {
      classId: null,
      studentName: '',

      loading: false,
      columns: [
        {
          title: '#',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          width: 60,
          align: 'center'
        },
        {
          title: '班级名称',
          dataIndex: 'ceaClassName',
          align: 'center'
        },
        {
          title: '姓名',
          dataIndex: 'ceaStudentName',
          align: 'center'
        },
        {
          title: '性别',
          dataIndex: 'ceaStudentGender',
          scopedSlots: { customRender: 'ceaStudentGender' },
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'ceaStudentStatus',
          scopedSlots: { customRender: 'ceaStudentStatus' },
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'operator',
          scopedSlots: { customRender: 'operator' },
          width: 120
        }
      ],
      studentList: []
    }
  },
  created() {},
  mounted() {
    const { query } = this.$route
    this.classId = query.classId
    this.loadClassStudentList()
  },
  methods: {
    async loadClassStudentList() {
      this.loading = true
      const studentName = isEmpty(this.studentName) ? 'null' : this.studentName
      const data = await classStudentList(this.classId, studentName)
      this.loading = false
      this.studentList = data
    },
    onSearch() {
      this.loadClassStudentList()
    }
  },
  computed: {}
}
</script>
