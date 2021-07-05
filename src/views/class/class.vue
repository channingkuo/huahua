<template>
  <a-page-header class="k-ant-page-header">
    <template slot="extra">
      <a-row type="flex" justify="space-between" align="bottom" :gutter="{ xs: 8, sm: 16, md: 24 }">
        <a-col :span="20">
          <a-row type="flex" justify="start" align="middle">
            <span class="search-field-control-header">班级名称：</span>
            <a-input
              v-model="className"
              allowClear
              placeholder="输入班级名称"
              @pressEnter="onSearch"
              :style="{ marginRight: '20px', width: '160px' }"
            />
            <a-button type="primary" @click="onSearch"> 筛选 </a-button>
          </a-row>
        </a-col>

        <a-col class="flex justify-end">
          <a-tooltip placement="top" title="">
            <a-button type="primary" @click="onEdit()"> 新建 </a-button>
          </a-tooltip>
        </a-col>
      </a-row>
    </template>
    <a-row type="flex">
      <a-col :span="24">
        <a-table
          class="k-table"
          :columns="columns"
          :row-key="(record) => record.ceaClassId"
          :data-source="classList"
          :loading="loading"
          :pagination="false"
          :rowClassName="
            (record, index) => {
              return index % 2 === 0 ? 'single' : 'double'
            }
          "
        >
          <!-- @change="onTableChange" -->
          <template slot="index" slot-scope="text, record, index">
            {{ index + 1 }}
          </template>
          <template slot="className" slot-scope="text, record">
            {{ record.ceaClassName }}
          </template>
          <template slot="operator" slot-scope="text, record, index">
            <div class="flex justify-around justify-items-center">
              <!-- <a-tooltip placement="top" title="学生列表">
                <a @click="gotoStudentList(record)">学生</a>
              </a-tooltip> -->
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
  </a-page-header>
</template>

<script>
import { getClassList, deleteClass, saveClass } from './class.service'
import { isEmpty } from '../../utils/index'

export default {
  name: 'Class',
  components: {},
  data() {
    return {
      className: '',

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
          dataIndex: 'className',
          scopedSlots: { customRender: 'className' },
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
      classList: [],
      // pagination: {
      //   showTotal: (total, range) => `第${range[0]}-${range[1]}行，共${total}行`,
      //   // showSizeChanger: true,
      //   // showQuickJumper: true,
      //   current: 1,
      //   pageSize: 20,
      //   total: 0
      // }
      newClassName: ''
    }
  },
  created() {},
  mounted() {
    this.loadClassList()
  },
  methods: {
    async loadClassList() {
      this.loading = true
      const data = await getClassList({ name: this.className })
      this.loading = false
      this.classList = data
    },
    onSearch() {
      this.loadClassList()
    },
    onDeleteRow(record, index) {
      deleteClass(record.ceaClassId).then((resp) => {
        this.loadClassList()
      })
    },
    onEdit() {
      this.$modal.confirm({
        title: '新建班级',
        content: (h) => {
          return h('a-input', {
            attrs: {
              placeholder: '请填写班级名称',
              allowClear: true,
              value: this.newClassName
            },
            style: {},
            on: {
              change: (event) => {
                this.newClassName = event.target.value
              }
            }
          })
        },
        icon: 'snippets',
        centered: true,
        onOk: () => {
          if (isEmpty(this.newClassName)) {
            this.$message.warning('请填写班级名称！')
            return
          }
          const payload = {
            ceaClassName: this.newClassName
          }
          saveClass(payload).then((resp) => {
            this.loadClassList()
          })
        }
      })
    },
    gotoStudentList(record) {
      this.$router
        .push({ path: '/class/student', query: { classId: record.ceaClassId } })
        .catch((err) => {
          console.error(err)
        })
    }
  },
  computed: {}
}
</script>
