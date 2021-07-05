<template>
  <div>
    <a-button :type="type" :icon="icon" @click="visible = !visible"> {{ title }} </a-button>
    <a-modal
      v-model="visible"
      :closable="false"
      :mask-closable="false"
      title="学生成绩: Excel导入"
      width="80%"
      :mask-style="{ zIndex: 1000 }"
      :z-index="1001"
      :confirmLoading="confirmLoading"
      :destroy-on-close="true"
      @ok="onHandleOk"
      @cancel="onCloseModal"
    >
      <a-page-header class="k-ant-page-header" :style="{ padding: 0, border: 'none' }">
        <template slot="extra">
          <a-row type="flex" justify="start">
            <a-button
              @click="onSelectFile"
              type="primary"
              class="input-button"
              title="选择导入文件"
            >
              <input
                @change="onFileChange"
                id="excelImport"
                type="file"
                accept=".xlsx,.xls"
              />选择导入文件
            </a-button>
            <a-button style="margin-left: 20px" @click="onDownloadTemplate"> 下载模版 </a-button>
          </a-row>
        </template>

        <a-divider :dashed="true" :style="{ margin: 0, marginTop: '15px' }"></a-divider>

        <a-row type="flex">
          <a-col :span="24">
            <a-table
              :row-key="(record) => md5(JSON.stringify(record))"
              :data-source="scoreList"
              :columns="columns"
              :pagination="false"
              :loading="loading"
            >
              <template slot="index" slot-scope="text, record, index">
                {{ index + 1 }}
              </template>
              <template slot="term" slot-scope="text, record">
                <a-tooltip placement="top" :title="text">
                  <a-select
                    v-model="record.term"
                    style="width: 100%"
                    @change="
                      (value, option) => {
                        record.gender = value
                      }
                    "
                  >
                    <template v-for="option in termOptions">
                      <a-select-option :value="option.value" :key="option.value">
                        {{ option.label }}
                      </a-select-option>
                    </template>
                  </a-select>
                </a-tooltip>
              </template>
              <template slot="className" slot-scope="text, record">
                <a-tooltip placement="top" :title="text">
                  <a-input v-model="record.className" placeholder="班级" />
                </a-tooltip>
              </template>
              <template slot="name" slot-scope="text, record">
                <a-tooltip placement="top" :title="text">
                  <a-input v-model="record.name" placeholder="姓名" />
                </a-tooltip>
              </template>
              <template slot="kind" slot-scope="text, record">
                <a-tooltip placement="top" :title="text">
                  <a-input v-model="record.kind" placeholder="学科" />
                </a-tooltip>
              </template>
              <template slot="testName" slot-scope="text, record">
                <a-tooltip placement="top" :title="text">
                  <a-input v-model="record.testName" placeholder="测试名称" />
                </a-tooltip>
              </template>
              <template slot="score" slot-scope="text, record">
                <a-tooltip placement="top" :title="text">
                  <a-input-number v-model="record.score" placeholder="成绩" :min="0" :max="100" />
                </a-tooltip>
              </template>
            </a-table>
          </a-col>
        </a-row>
      </a-page-header>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import md5 from 'js-md5'
import XLSX from 'xlsx'
import templateJson from './score.template.json'
import { sheetToBlob, openDownloadDialog, readerData } from '../../utils/excel'

const columns = [
  {
    title: '#',
    dataIndex: 'index',
    scopedSlots: { customRender: 'index' },
    width: 60,
    align: 'center'
  },
  {
    title: '学期',
    dataIndex: 'term',
    scopedSlots: { customRender: 'term' },
    align: 'center'
  },
  {
    title: '班级',
    dataIndex: 'className',
    scopedSlots: { customRender: 'className' },
    align: 'center'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
    align: 'center'
  },
  {
    title: '学科',
    dataIndex: 'kind',
    scopedSlots: { customRender: 'kind' },
    align: 'center'
  },
  {
    title: '测试名称',
    dataIndex: 'testName',
    scopedSlots: { customRender: 'testName' },
    align: 'center'
  },
  {
    title: '成绩',
    dataIndex: 'score',
    scopedSlots: { customRender: 'score' },
    align: 'center'
  }
]

export default {
  name: 'Score-Excel-Import',
  props: {
    title: {
      type: String,
      default: '导入'
    },
    type: {
      type: String,
      default: 'primary'
    },
    icon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,

      file: null,
      loading: false,
      columns,
      scoreList: [],
      poiTypeOptions: [],
      poiStatusOptions: [],

      project: {
        id: null,
        name: ''
      },
      subitem: {
        id: null,
        name: ''
      },
      projectSet: [],
      subitemSet: []
    }
  },
  mounted() {},
  methods: {
    md5,
    async onSelectFile() {},
    async onFileChange(e) {
      let excelData = []
      const file = e.target.files[0]
      if (this.file !== null && this.file !== file) {
        this.$modal.confirm({
          title: '是否覆盖之前导入的数据',
          zIndex: 100000,
          okText: '确认',
          centered: true,
          onOk: async () => {
            this.file = file
            this.loading = true
            excelData = await readerData(file)
            this.loading = false

            const excelImport = document.getElementById('excelImport')
            excelImport.value = ''

            this.genTableData(excelData)
          }
        })
      } else {
        this.file = file
        this.loading = true
        excelData = await readerData(file)
        this.loading = false

        const excelImport = document.getElementById('excelImport')
        excelImport.value = ''

        this.genTableData(excelData)
      }
    },
    genTableData(excelData) {
      for (let i = 0; i < excelData.length; i++) {
        const data = excelData[i]
        const payload = {}
        for (let j = 0; j < templateJson.length; j++) {
          const json = templateJson[j]
          payload[json.value] = data[json.label]
        }
        this.scoreList.push(payload)
      }
    },
    async onDownloadTemplate() {
      const sheetDataList = []

      const data = []
      data[0] = []
      for (let i = 0; i < templateJson.length; i++) {
        const json = templateJson[i]
        data[0] = [...data[0], json.label]
      }
      data[1] = [
        '2021-上半学期',
        '4（7）班',
        'Kuo',
        '数学',
        '第一单元',
        90,
        '本行数据为示例数据，参考后请删除!'
      ]
      sheetDataList.push({
        name: 'sheet1',
        sheet: XLSX.utils.aoa_to_sheet(data)
      })

      openDownloadDialog(sheetToBlob(sheetDataList), '成绩导入模版.xlsx')
    },
    onHandleOk() {
      if (this.scoreList.length <= 0) {
        this.$message.info('至少导入一条数据！')
        return
      }
      this.visible = false
      this.$emit('upload', this.scoreList)
      this.onCloseModal()
    },
    onCloseModal() {
      this.scoreList = []
      this.subitem = {
        id: null,
        name: ''
      }
      this.file = null
    }
  },
  computed: {
    ...mapGetters(['termOptions'])
  }
}
</script>

<style lang="scss" scoped>
  .input-button input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer;
  }
</style>
