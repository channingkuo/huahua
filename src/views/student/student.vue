<template>
  <a-page-header class="k-ant-page-header">
    <template slot="extra">
      <a-row type="flex" justify="space-between" align="bottom" :gutter="{ xs: 8, sm: 16, md: 24 }">
        <a-col :span="17">
          <a-row type="flex" justify="start" align="middle">
            <span class="search-field-control-header">班级：</span>
            <a-input
              v-model="className"
              allowClear
              placeholder="输入班级"
              @pressEnter="onSearch"
              :style="{ marginRight: '20px', width: '160px' }"
            />
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
          <a-tooltip placement="top" title="批量导入学生">
            <student-excel-import
              style="margin-right: 10px; margin-left: 10px"
              type="default"
              @upload="onUpload"
            />
          </a-tooltip>
          <a-tooltip placement="top" title="添加单个学生" class="ml-5">
            <a-button type="primary" @click="onAdd()"> 添加 </a-button>
          </a-tooltip>
        </a-col>
      </a-row>
    </template>
    <a-row type="flex">
      <a-col :span="24">
        <a-table
          class="k-table"
          :columns="columns"
          :row-key="(record) => record.cea_student_id"
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
          <template slot="cea_student_name" slot-scope="text, record">
            <template v-if="!record.editing">
              {{ text }}
            </template>
            <template v-else>
              <a-input
                v-model="record.cea_student_name"
                allowClear
                placeholder="输入学生姓名"
                :style="{ width: '160px' }"
              />
            </template>
          </template>
          <template slot="cea_student_gender" slot-scope="text, record">
            <template v-if="!record.editing">
              <a-tag color="volcano" v-if="!text"> 男 </a-tag>
              <a-tag color="pink" v-if="text"> 女 </a-tag>
            </template>
            <template v-else>
              <a-select v-model="record.cea_student_gender" placeholder="请选择学生性别">
                <a-select-option :value="0"> 男 </a-select-option>
                <a-select-option :value="1"> 女 </a-select-option>
              </a-select>
            </template>
          </template>
          <template slot="operator" slot-scope="text, record, index">
            <div class="flex justify-around justify-items-center">
              <a v-if="!record.editing" @click="onEditRow(record, index)">编辑</a>
              <a v-else @click="onCancelEditRow(record, index)">取消</a>
              <a v-if="record.editing" @click="onSaveEditRow(record, index)">保存</a>
              <a-popconfirm
                title="是否确认删除该行?一旦删除，数据无法恢复！"
                ok-text="确认"
                cancel-text="取消"
                placement="bottomRight"
                @confirm="() => onDeleteRow(record, index)"
              >
                <a-icon slot="icon" type="exclamation-circle" style="color: #ff4242" />
                <a>删除</a>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
      </a-col>
    </a-row>
    <a-drawer
      title="添加学生"
      :width="720"
      destroyOnClose
      :visible="visible"
      class="huahua-drawer"
      @close="onClose"
    >
      <a-form :form="form" layout="vertical" hide-required-mark>
        <a-row :gutter="16">
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
                  v-for="item in classList"
                  :key="item.ceaClassId"
                  :value="item.ceaClassId"
                >
                  {{ item.ceaClassName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
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
        </a-row>
        <a-row :gutter="16">
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
import StudentExcelImport from './student.excel.import.vue'
import { getStudentList, deleteStudent, uploadStudents, saveStudent } from './student.service'
import { getClassList } from '../class/class.service'

export default {
  name: 'Student',
  components: {
    StudentExcelImport
  },
  data() {
    return {
      studentName: '',
      className: '',

      columns: [
        {
          title: '#',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          width: 60,
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
          scopedSlots: { customRender: 'cea_student_name' },
          align: 'center'
        },
        {
          title: '性别',
          dataIndex: 'cea_student_gender',
          scopedSlots: { customRender: 'cea_student_gender' },
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'operator',
          scopedSlots: { customRender: 'operator' },
          width: 200
        }
      ],
      studentList: [],
      loading: false,

      form: this.$form.createForm(this),
      visible: false,
      classList: [],
      submitLoading: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadList()
      this.loadClassList()
    })
  },
  methods: {
    async loadList() {
      this.loading = true
      const payload = {
        className: this.className,
        studentName: this.studentName
      }
      const data = await getStudentList(payload)
      this.loading = false
      this.studentList = data
    },
    async loadClassList() {
      const data = await getClassList({ name: '' })
      this.classList = data
    },
    handleChange() {
      this.loadClassList()
    },
    onSearch() {
      this.loadList()
    },
    onDeleteRow(record, index) {
      deleteStudent(record.cea_student_id).then((resp) => {
        this.loadList()
      })
    },
    onUpload(studentList) {
      this.$message.info('正在导入...')
      uploadStudents(studentList).then((resp) => {
        if (resp.length > 0) {
          this.$modal.confirm({
            title: '上传失败记录',
            content: (h) => {
              return h(
                'div',
                resp.map((student) => {
                  return h('p', {
                    style: { color: 'red' },
                    domProps: {
                      innerHTML: student.className + '，' + student.name + '，' + student.gender
                    }
                  })
                })
              )
            },
            icon: 'exclamation-circle',
            centered: true,
            onOk: () => {
              console.log(resp)
            }
          })
        } else {
          this.$message.success('导入成功！')
        }
        this.loadList()
      })
    },
    onAdd() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
    onAddStudent() {
      this.submitLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          this.submitLoading = false
          saveStudent(values)
            .then((resp) => {
              this.$message.success('添加成功！')
              this.visible = false
              this.loadList()
            })
            .catch((err) => {
              this.$message.error(err)
            })
        } else {
          this.submitLoading = false
        }
      })
    },
    onEditRow(record, index) {
      this.$set(record, 'editing', true)
    },
    onCancelEditRow(record, index) {
      this.$set(record, 'editing', false)
    },
    onSaveEditRow(record, index) {
      console.log(record)

      const payload = {
        ceaStudentId: record.cea_student_id,
        ceaClassId: record.cea_class_id,
        ceaStudentName: record.cea_student_name,
        ceaStudentGender: record.cea_student_gender,
        ceaStudentStatus: record.cea_student_status
      }
      saveStudent(payload).then((resp) => {
        this.$message.success('修改成功！')
        this.loadList()
      })
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  }
}
</script>
