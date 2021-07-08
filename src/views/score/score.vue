<template>
  <a-page-header class="k-ant-page-header">
    <template slot="extra">
      <a-row type="flex" justify="space-between" align="bottom" :gutter="{ xs: 8, sm: 16, md: 24 }">
        <a-col :span="17">
          <a-row type="flex" justify="start" align="middle">
            <span class="search-field-control-header">学期：</span>
            <a-select v-model="term" style="width: 140px" @change="handleChange">
              <template v-for="option in termOptions">
                <a-select-option :value="option.value" :key="option.value">
                  {{ option.label }}
                </a-select-option>
              </template>
            </a-select>
            <span class="search-field-control-header ml-5">班级：</span>
            <a-select v-model="className" style="width: 140px">
              <template v-for="classItem in classList">
                <a-select-option :key="classItem.cea_class_id" :value="classItem.cea_class_name">
                  {{ classItem.cea_class_name }}
                </a-select-option>
              </template>
            </a-select>
            <span class="search-field-control-header ml-5">学生姓名：</span>
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

        <a-col class="flex justify-end">
          <a-tooltip placement="top" title="">
            <score-excel-import
              style="margin-right: 10px; margin-left: 10px"
              type="default"
              @upload="onUpload"
            />
          </a-tooltip>
        </a-col>
      </a-row>
    </template>
    <a-row type="flex">
      <a-col :span="24">
        <a-table
          class="k-table"
          :columns="columns"
          :row-key="(record) => md5(JSON.stringify(record))"
          :data-source="scoreList"
          :loading="loading"
          :pagination="false"
          :scroll="{ x: 1300, y: height }"
          :rowClassName="
            (record, index) => {
              return index % 2 === 0 ? 'single' : 'double'
            }
          "
        >
          <template slot="index" slot-scope="text, record, index">
            {{ index + 1 }}
          </template>
          <template slot="cea_student_name" slot-scope="text, record, index">
            <a @click="onViewRow(record, index)">{{ text }}</a>
          </template>
        </a-table>
      </a-col>
    </a-row>
    <a-drawer
      title="成绩调整"
      :width="720"
      destroyOnClose
      :visible="visible"
      class="huahua-drawer"
      @close="onClose"
    >
      <a-form :form="form" layout="vertical" hide-required-mark>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="学期">
              <a-input
                v-decorator="[
                  'ceaTerm',
                  {
                    initialValue: this.rowData.cea_term
                  }
                ]"
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="班级">
              <a-input
                v-decorator="[
                  'ceaClassName',
                  {
                    initialValue: this.rowData.cea_class_name
                  }
                ]"
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="姓名">
              <a-input
                v-decorator="[
                  'ceaStudentName',
                  {
                    initialValue: this.rowData.cea_student_name
                  }
                ]"
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="学科">
              <a-input
                v-decorator="[
                  'ceaKind',
                  {
                    initialValue: this.rowData.cea_kind
                  }
                ]"
                disabled
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <template v-for="(testName, index) in testNameList">
            <a-col :span="6" :key="index">
              <a-form-item :label="testName">
                <a-input-number
                  allowClear
                  v-decorator="[
                    testName,
                    {
                      initialValue: rowData[testName],
                      rules: [{ required: true, message: '请输入成绩' }]
                    }
                  ]"
                  placeholder="请输入学生姓名"
                  :min="0"
                  :max="100"
                />
              </a-form-item>
            </a-col>
          </template>
        </a-row>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="onClose"> 取消 </a-button>
        <a-button type="primary" :loading="submitLoading" @click="onSaveScore"> 保存 </a-button>
      </div>
    </a-drawer>
  </a-page-header>
</template>

<script>
import md5 from 'js-md5'
import ScoreExcelImport from './score.excel.import.vue'
import { mapGetters } from 'vuex'
import { getScreenHeight } from '../../utils/common'
import { getClassList } from '../term/term.service'
import { uploadScore, getScoreList, saveScore } from './score.service'

export default {
  name: 'Class',
  components: {
    ScoreExcelImport
  },
  data() {
    return {
      height: getScreenHeight() - 220,
      term: '',
      className: '',
      classList: [],
      studentName: '',

      loading: false,
      tmpColumns: [
        {
          title: '#',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        // {
        //   title: '学期',
        //   dataIndex: 'cea_term',
        //   width: 100,
        //   align: 'center',
        //   fixed: 'left'
        // },
        // {
        //   title: '班级',
        //   dataIndex: 'cea_class_name',
        //   width: 100,
        //   align: 'center',
        //   fixed: 'left'
        // },
        {
          title: '姓名',
          dataIndex: 'cea_student_name',
          scopedSlots: { customRender: 'cea_student_name' },
          width: 100,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '学科',
          dataIndex: 'cea_kind',
          width: 100,
          align: 'center',
          fixed: 'left'
        }
      ],
      columns: [
        {
          title: '#',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        // {
        //   title: '学期',
        //   dataIndex: 'cea_term',
        //   width: 100,
        //   align: 'center',
        //   fixed: 'left'
        // },
        // {
        //   title: '班级',
        //   dataIndex: 'cea_class_name',
        //   width: 100,
        //   align: 'center',
        //   fixed: 'left'
        // },
        {
          title: '姓名',
          dataIndex: 'cea_student_name',
          scopedSlots: { customRender: 'cea_student_name' },
          width: 100,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '学科',
          dataIndex: 'cea_kind',
          width: 100,
          align: 'center',
          fixed: 'left'
        }
      ],

      scoreList: [],

      submitLoading: false,
      visible: false,
      form: this.$form.createForm(this),
      rowData: {},
      testNameList: []
    }
  },
  created() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    this.term = `${year}-${month < 9 ? '上' : '下'}半学期`
  },
  async mounted() {
    await this.loadClassList()

    this.loadList()
  },
  methods: {
    md5,
    async loadList() {
      this.loading = true

      const payload = {
        term: this.term,
        className: this.className,
        studentName: this.studentName
      }
      const data = await getScoreList(payload)
      this.loading = false
      this.scoreList = data

      if (this.scoreList.length > 0) {
        let testNameSets = ''
        for (let i = 0; i < this.scoreList.length; i++) {
          const score = this.scoreList[i]
          if (score.test_name_sets.length >= testNameSets.length) {
            testNameSets = score.test_name_sets
          }
          const testNameSplitList = score.test_name_sets.split(',')
          const scoreSplitList = score.score_sets.split(',')
          for (let j = 0; j < testNameSplitList.length; j++) {
            const testName = testNameSplitList[j]
            score[testName] = scoreSplitList[j]
          }
        }
        const testNameSplitList = testNameSets.split(',')
        testNameSplitList.sort((a, b) => {
          const tmp1 = a.split('.')
          const tmp2 = b.split('.')
          if (parseInt(tmp1[0]) < parseInt(tmp2[0])) {
            return -1
          } else {
            return 1
          }
        })
        this.testNameList = testNameSplitList
        for (let k = 0; k < testNameSplitList.length; k++) {
          const item = testNameSplitList[k]
          this.columns.push({
            title: item,
            dataIndex: item,
            align: 'center'
          })
        }
      }
    },
    handleChange() {
      this.loadClassList()
    },
    async loadClassList() {
      const data = await getClassList(this.userInfo.ceaTeacherId, this.term)
      this.classList = data
      if (this.classList.length > 0) {
        this.className = this.classList[0].cea_class_name
      } else {
        this.className = 'null'
      }
    },
    async onSearch() {
      this.columns = this.tmpColumns
      this.loading = true
      const payload = {
        term: this.term,
        className: this.className,
        studentName: this.studentName
      }
      const data = await getScoreList(payload)
      this.loading = false
      this.scoreList = data

      if (this.scoreList.length > 0) {
        let testNameSets = ''
        for (let i = 0; i < this.scoreList.length; i++) {
          const score = this.scoreList[i]
          if (score.test_name_sets.length >= testNameSets.length) {
            testNameSets = score.test_name_sets
          }
          const testNameSplitList = score.test_name_sets.split(',')
          const scoreSplitList = score.score_sets.split(',')
          for (let j = 0; j < testNameSplitList.length; j++) {
            const testName = testNameSplitList[j]
            score[testName] = scoreSplitList[j]
          }
        }
        const testNameSplitList = testNameSets.split(',')
        testNameSplitList.sort((a, b) => {
          const tmp1 = a.split('.')
          const tmp2 = b.split('.')
          if (parseInt(tmp1[0]) < parseInt(tmp2[0])) {
            return -1
          } else {
            return 1
          }
        })
        this.testNameList = testNameSplitList
        for (let k = 0; k < testNameSplitList.length; k++) {
          const item = testNameSplitList[k]
          this.columns.push({
            title: item,
            dataIndex: item,
            align: 'center'
          })
        }
      }
    },
    onUpload(scoreList) {
      this.$message.info('正在上传...')
      uploadScore(scoreList).then((resp) => {
        this.$message.success('上传成功！')
        this.loadList()
      })
    },
    onViewRow(record, index) {
      this.visible = true
      this.rowData = record
    },
    onClose() {
      this.visible = false
      this.rowData = {}
    },
    onSaveScore() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.submitLoading = false
          saveScore(values)
            .then((resp) => {
              this.$message.success('保存成功！')
              this.visible = false
              this.onSearch()
            })
            .catch((err) => {
              this.$message.error(err)
            })
        } else {
          this.submitLoading = false
        }
      })
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'termOptions'])
  }
}
</script>
