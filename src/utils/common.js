export function isNull (obj) {
  if (obj === undefined || obj === null || obj === '') {
    return true
  } else {
    return JSON.stringify(obj) === '{}' || JSON.stringify(obj) === '[]'
  }
}

/**
 * 判断是否为空字符串
 * @param {string | Object} s 查询目标
 */
export function isEmpty (s) {
  return isNull(s) || JSON.stringify(s).trim() === '""'
}

// 屏幕宽度
export function getScreenWidth () {
  return document.documentElement.clientWidth || document.body.clientWidth
}

export function getAvailableScreenWidth () {
  return (document.documentElement.clientWidth || document.body.clientWidth) - 240
}

// 屏幕高度
export function getScreenHeight () {
  return document.documentElement.clientHeight || document.body.clientHeight
}

export function guidHash () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }

  return s4() + s4() + s4() + s4()
}

export function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
