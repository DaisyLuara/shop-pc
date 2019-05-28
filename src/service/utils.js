import router from 'router'

export default {
  install(Vue, options) {
    Vue.prototype.$cancel = function() {
      history.go(-1)
    }
  }
}

// yyyy-MM-dd 23:59:59
const handleDateTransform = valueDate => {
  let date = new Date(valueDate)
  let year = date.getFullYear() + '-'
  let mouth =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  let day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ''
  let hours = date.getHours() === 0 ? date.getHours() + 23 : date.getHours()
  let minutes =
    date.getMinutes() === 0 ? date.getMinutes() + 59 : date.getMinutes()
  let second =
    date.getSeconds() === 0 ? date.getSeconds() + 59 : date.getSeconds()
  return year + mouth + day + ' ' + hours + ':' + minutes + ':' + second
}
// yyyy-MM-dd hh:mm:ss
const handleDateTimesTransform = time => {
  var d = new Date(time)
  var year = d.getFullYear()
  var month = change(d.getMonth() + 1)
  var day = change(d.getDate())
  var hour = change(d.getHours())
  var minute = change(d.getMinutes())
  var second = change(d.getSeconds())
  function change(t) {
    if (t < 10) {
      return '0' + t
    } else {
      return t
    }
  }
  return (time =
    year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second)
}
// yyyy-MM-dd
const handleDateTypeTransform = valueDate => {
  let date = new Date(valueDate)
  let year = date.getFullYear() + '-'
  let mouth =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  let day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ''
  return year + mouth + day
}

const historyBack = () => {
  router.back()
}

const randomString = len => {
  len = len || 32
  let timestamp = new Date().getTime()
  let _chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  let maxPos = _chars.length
  let randomStr = ''
  for (let i = 0; i < len; i++) {
    randomStr += _chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return randomStr + timestamp
}

export {
  randomString,
  handleDateTransform,
  handleDateTimesTransform,
  handleDateTypeTransform,
  historyBack
}
