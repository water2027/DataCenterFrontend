<template>
  <div class="excel-upload-container">
    <!-- 文件上传组件 -->
    <el-upload
      class="excel-uploader"
      drag
      action=""
      :show-file-list="true"
      :on-change="handleFileChange"
      accept=".xlsx, .xls"
    >
      <el-icon><Upload /></el-icon>
      <div class="el-upload__text">拖拽文件或 <em>点击上传</em></div>
    </el-upload>

    <!-- 列名配置 -->
    <button>展开列名</button>
    <el-form v-if="columns.length > 0 && columnsShow" label-width="120px">
      <el-form-item
        v-for="(column, index) in columns"
        :key="index"
        :label="`原始列名: ${column.label}`"
      >
        <el-input v-model="column.customName" placeholder="请输入自定义列名" />
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <div class="operate-buttons">
      <el-button type="primary" @click="saveData" :disabled="tableData.length === 0">
        保存数据
      </el-button>
    </div>

    <!-- 表格组件 -->
    <el-table :data="tableData" border stripe style="width: 100%" @cell-dblclick="handleCellEdit">
      <el-table-column
        v-for="(column, index) in columns"
        :key="index"
        :prop="column.prop"
        :label="column.customName || column.label"
      >
        <template #default="{ row, column, $index }">
          <el-input
            v-if="editingCell.row === $index && editingCell.column === column.property"
            v-model="row[column.property]"
            @blur="finishEditing"
            @keyup.enter="finishEditing"
          />
          <span v-else>{{ row[column.property] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, type UploadFile } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'

interface Column {
  prop: string
  label: string
  customName: string
}

interface TableRow {
  [key: string]: string | number
}

interface EditingCell {
  row: number | null
  column: string | null
}

interface SaveData {
  columns: Column[]
  data: TableRow[]
}

// 定义响应式数据
const tableData = ref<TableRow[]>([])
const columns = ref<Column[]>([])
const editingCell = ref<EditingCell>({
  row: null,
  column: null,
})

const columnsShow = ref<boolean>(false)

// 处理文件上传
const handleFileChange = (file: UploadFile): void => {
  const reader = new FileReader()
  reader.onload = (e: ProgressEvent<FileReader>) => {
    // 读取Excel文件
    const workbook = XLSX.read(e.target?.result, { type: 'binary' })

    // 获取第一个sheet
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // 将Excel数据转换为JSON
    const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as Array<
      Array<string | number>
    >

    // 设置表头
    if (excelData.length > 0) {
      columns.value = excelData[0].map((header, index) => ({
        prop: `col${index}`,
        label: String(header),
        customName: '', // 新增自定义列名
      }))

      // 设置数据行
      tableData.value = excelData.slice(1).map((row) =>
        row.reduce<TableRow>((acc, cell, index) => {
          acc[`col${index}`] = cell
          return acc
        }, {}),
      )
    }
  }

  // 读取文件
  reader.readAsBinaryString(file.raw as Blob)
}

// 处理单元格双击编辑
const handleCellEdit = (row: TableRow, column: Column, cell: HTMLElement, event: MouseEvent) => {
  editingCell.value = {
    row: tableData.value.indexOf(row),
    column: column.prop,
  }
}

// 完成编辑
const finishEditing = () => {
  editingCell.value = {
    row: null,
    column: null,
  }
}

// 保存数据到后端
const saveData = async () => {
  try {
    const dataToSave: SaveData = {
      columns: columns.value, // 列名
      data: tableData.value, // 数据
    }
    console.log(dataToSave)
  } catch (error) {
    console.error('保存数据出错:', error)
    ElMessage.error('数据保存出现异常')
  }
}
</script>

<style scoped>
.excel-upload-container {
  padding: 20px;
}

.excel-uploader {
  margin-bottom: 20px;
}

.operate-buttons {
  margin-bottom: 20px;
}
</style>
