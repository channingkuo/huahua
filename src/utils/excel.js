import XLSX from 'xlsx'

export function readerData (file) {
  return new Promise((resolve, reject) => {
    if (file.name.split('.')[1] !== 'xls' && file.name.split('.')[1] !== 'xlsx') {
      this.$message.error('上传文件格式错误，请上传xls、xlsx文件！')
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target.result
        const fixedData = fixdata(data)
        const workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
        // 第一张表 sheet1
        const firstSheetName = workbook.SheetNames[0]
        // 读取sheet1表中的数据
        const worksheet = workbook.Sheets[firstSheetName]

        const excelData = XLSX.utils.sheet_to_json(worksheet)
        resolve(excelData)
      }
      reader.readAsArrayBuffer(file)
    }
  })
}

/**
 * 文件流转BinaryString
 * @param {*} data
 */
export function fixdata (data) {
  let o = ''
  let l = 0
  const w = 10240
  for (; l < data.byteLength / w; ++l) {
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
  }
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
  return o
}

/**
 * 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
 * @param {*} sheetDataList
 */
export function sheetToBlob (sheetDataList) {
  const sheetNames = []
  for (let i = 0; i < sheetDataList.length; i++) {
    sheetNames[i] = sheetDataList[i].name || `sheet${i + 1}`
  }
  var workbook = {
    SheetNames: sheetNames,
    Sheets: {}
  }
  for (let j = 0; j < sheetDataList.length; j++) {
    workbook.Sheets[sheetDataList[j].name] = sheetDataList[j].sheet
  }

  var wopts = {
    // 要生成的文件类型
    bookType: 'xlsx',
    // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    bookSST: false,
    type: 'binary'
  }
  var wbout = XLSX.write(workbook, wopts)
  var blob = new Blob([s2ab(wbout)], {
    type: 'application/octet-stream'
  }) // 字符串转ArrayBuffer
  function s2ab (s) {
    var buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
  }
  return blob
}

export function openDownloadDialog (url, saveName) {
  if (typeof url === 'object' && url instanceof Blob) {
    // 创建blob地址
    url = URL.createObjectURL(url)
  }
  var aLink = document.createElement('a')
  aLink.href = url
  // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  aLink.download = saveName || ''
  var event
  if (window.MouseEvent) event = new MouseEvent('click')
  else {
    event = document.createEvent('MouseEvents')
    event.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    )
  }
  aLink.dispatchEvent(event)
}
