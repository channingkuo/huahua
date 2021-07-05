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
              <a-select-option value="null"> 全部 </a-select-option>
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
          <!-- <a-tooltip placement="top" title="批量导入新学期学生">
            <a-button type="block"> 新学期 </a-button>
          </a-tooltip> -->
          <a-tooltip placement="top" title="批量导入新学期学生">
            <a-button type="block" @click="onNewTerm()"> 新学期 </a-button>
          </a-tooltip>
          <a-tooltip placement="top" title="添加学期学生" class="ml-5">
            <a-button type="primary" @click="onOneNewTerm()"> 添加 </a-button>
          </a-tooltip>
        </a-col>
      </a-row>
    </template>
    <a-row type="flex">
      <a-col :span="24">
        <a-table
          class="k-table"
          :columns="columns"
          :row-key="(record) => record.cea_teacher_term_id"
          :data-source="studentList"
          :loading="loading"
          :pagination="false"
          :rowClassName="
            (record, index) => {
              return index % 2 === 0 ? 'single' : 'double'
            }
          "
        >
          <template slot="index" slot-scope="text, record, index">
            {{ index + 1 }}
          </template>
          <template slot="cea_student_gender" slot-scope="text">
            <a-tag color="volcano" v-if="!text"> 男 </a-tag>
            <a-tag color="pink" v-if="text"> 女 </a-tag>
          </template>
          <template slot="cea_student_status" slot-scope="text">
            <a-tag color="volcano" v-if="!text"> 禁用 </a-tag>
            <a-tag color="green" v-if="text"> 正常 </a-tag>
          </template>
          <template slot="operator" slot-scope="text, record">
            <div class="flex justify-around justify-items-center">
              <a-tooltip placement="topRight" :title="toggleTitle(record)">
                <a v-if="!record.cea_student_status" @click="onDeleteRow(record, index)">启用</a>
                <a v-if="record.cea_student_status" @click="onDeleteRow(record, index)">禁用</a>
              </a-tooltip>
              <a-popconfirm
                title="是否确认删除该行?删除后，数据不可恢复！"
                ok-text="确认"
                cancel-text="取消"
                placement="bottomRight"
                @confirm="() => onDeleteRecord(record, index)"
              >
                <a-icon slot="icon" type="exclamation-circle" style="color: #ff4242" />
                <a>删除</a>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
      </a-col>
    </a-row>
    <a-modal
      title="新建学期"
      :closable="false"
      :maskClosable="false"
      :visible="visible"
      :confirm-loading="confirmLoading"
      destroyOnClose
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <span style="padding-left: 2px">选择新学期：</span>
      <a-select
        v-model="newTerm"
        placeholder="请选择新学期"
        style="width: 100%; margin-bottom: 20px"
      >
        <template v-for="option in termOptions">
          <a-select-option :value="option.value" :key="option.value">
            {{ option.label }}
          </a-select-option>
        </template>
      </a-select>
      <span style="padding-left: 2px; margin-top: 20px">学期关联的班级：</span>
      <a-input v-model="newClassName" allowClear placeholder="输入班级名称" />
    </a-modal>
    <a-drawer
      title="添加学期学生"
      :width="720"
      destroyOnClose
      :visible="visibleDraw"
      class="huahua-drawer"
      @close="onClose"
    >
      <a-form :form="form" layout="vertical" hide-required-mark>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="学期">
              <a-select
                v-decorator="[
                  'ceaTerm',
                  {
                    rules: [{ required: true, message: '请选择学期' }]
                  }
                ]"
                placeholder="请选择学期"
              >
                <template v-for="option in termOptions">
                  <a-select-option :value="option.value" :key="option.value">
                    {{ option.label }}
                  </a-select-option>
                </template>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="班级">
              <a-select
                allowClear
                v-decorator="[
                  'ceaClassId',
                  {
                    rules: [{ required: true, message: '请选择学生班级' }]
                  }
                ]"
                placeholder="请选择学生班级"
              >
                <a-select-option
                  v-for="item in newClassList"
                  :key="item.ceaClassId"
                  :value="item.ceaClassId"
                >
                  {{ item.ceaClassName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="姓名">
              <a-input
                allowClear
                v-decorator="[
                  'ceaStudentName',
                  {
                    rules: [{ required: true, message: '请输入学生姓名' }]
                  }
                ]"
                placeholder="请输入学生姓名"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="性别">
              <a-select
                allowClear
                v-decorator="[
                  'ceaStudentGender',
                  {
                    rules: [{ required: true, message: '请选择学生性别' }]
                  }
                ]"
                placeholder="请选择学生性别"
              >
                <a-select-option :value="0"> 男 </a-select-option>
                <a-select-option :value="1"> 女 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="状态">
              <a-select
                allowClear
                v-decorator="[
                  'ceaStudentStatus',
                  {
                    initialValue: 1,
                    rules: [{ required: true, message: '请选择学生状态' }]
                  }
                ]"
                placeholder="请选择学生状态"
              >
                <a-select-option :value="0"> 禁用 </a-select-option>
                <a-select-option :value="1"> 正常 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
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
        <a-button type="primary" :loading="submitLoading" @click="onAddStudent"> 提交 </a-button>
      </div>
    </a-drawer>
  </a-page-header>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getList,
  getClassList,
  toggleTeacherTerm,
  newTeacherTerm,
  deleteTeacherTerm,
  saveTeacherTerm
} from './term.service'
import { getClassList as getNewTermClassList } from '../class/class.service'

export default {
  name: 'Term',
  components: {},
  data() {
    return {
      studentName: '',
      term: '',
      className: 'null',
      classList: [],

      columns: [
        {
          title: '#',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          width: 60,
          align: 'center'
        },
        {
          title: '学期',
          dataIndex: 'cea_term',
          align: 'center'
        },
        {
          title: '班级',
          dataIndex: 'cea_class_name',
          align: 'center'
        },
        {
          title: '姓名',
          dataIndex: 'cea_student_name',
          align: 'center'
        },
        {
          title: '性别',
          dataIndex: 'cea_student_gender',
          scopedSlots: { customRender: 'cea_student_gender' },
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'cea_student_status',
          scopedSlots: { customRender: 'cea_student_status' },
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
      studentList: [],
      loading: false,

      visible: false,
      confirmLoading: false,
      newTerm: '',
      newClassName: '',

      form: this.$form.createForm(this),
      visibleDraw: false,
      submitLoading: false,
      newClassList: []
    }
  },
  created() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    this.term = `${year}-${month < 9 ? '上' : '下'}半学期`
    this.newTerm = `${year}-${month < 9 ? '上' : '下'}半学期`
  },
  mounted() {
    this.$nextTick(() => {
      this.loadList()
      this.loadClassList()
      this.loadNewClassList()
    })
  },
  methods: {
    async loadList() {
      this.loading = true
      const payload = {
        teacherId: this.userInfo.ceaTeacherId,
        term: this.term,
        className: this.className === 'null' ? '' : this.className,
        studentName: this.studentName
      }
      const data = await getList(payload)
      this.loading = false
      this.studentList = data
    },
    handleChange() {
      this.loadClassList()
    },
    async loadClassList() {
      const data = await getClassList(this.userInfo.ceaTeacherId, this.term)
      this.classList = data
    },
    onSearch() {
      this.loadList()
    },
    onDeleteRow(record, index) {
      toggleTeacherTerm(record.cea_teacher_term_id).then((resp) => {
        if (record.cea_student_status) {
          this.$message.success('禁用成功！')
        } else {
          this.$message.success('启用成功！')
        }
        this.loadList()
      })
    },
    toggleTitle(record) {
      if (record.cea_student_status) {
        return '是否确认禁用该行?禁用后，成绩不计入统计！'
      } else {
        return '是否确认启用该行?启用后，成绩将计入统计！'
      }
    },
    onNewTerm() {
      this.visible = true
    },
    handleOk() {
      const payload = {
        teacherId: this.userInfo.ceaTeacherId,
        term: this.newTerm,
        className: this.newClassName
      }
      newTeacherTerm(payload).then((resp) => {
        this.$message.success('新建成功！')
        this.handleCancel()
      })
    },
    handleCancel() {
      this.visible = false

      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      this.newTerm = `${year}-${month < 9 ? '上' : '下'}半学期`

      this.newClassName = ''
    },
    onDeleteRecord(record) {
      deleteTeacherTerm(record.cea_teacher_term_id).then((resp) => {
        this.$message.success('删除成功！')
        this.loadList()
      })
    },
    async loadNewClassList() {
      const data = await getNewTermClassList({ name: '' })
      this.newClassList = data
    },
    onOneNewTerm() {
      this.visibleDraw = true
    },
    onClose() {
      this.visibleDraw = false
    },
    onAddStudent() {
      this.submitLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          this.submitLoading = false
          values.teacherId = this.userInfo.ceaTeacherId

          saveTeacherTerm(values)
            .then((resp) => {
              this.$message.success('添加成功！')
              this.visibleDraw = false
              this.loadList()
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
