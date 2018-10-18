// import md5 from 'js-md5'

let validate = {
  account(value) {
    if (isEmpty(value)) {
      return {
        validate: false,
        errorText: '请输入手机号'
      }
    }

    if (!checkMobile(value)) {
      return {
        validate: false,
        errorText: '手机号格式有误,请重新输入'
      }
    }

    return {
      validate: true
    }
  },

  password(value) {
    if (isEmpty(value)) {
      return {
        validate: false,
        errorText: '请输入密码'
      }
    }
    // if(!checkPasswordFormat(value)){
    //   return {
    //     validate: false,
    //     errorText: '密码必须是数字、大小写字母组合且不能小于8位'
    //   }
    // }

    return {
      validate: true
    }
  },

  imageCaptcha(value) {
    if (isEmpty(value)) {
      return {
        validate: false,
        errorText: '请输入验证码'
      }
    }

    if (isContainBlank(value)) {
      return {
        validate: false,
        errorText: '验证码不能包含空格'
      }
    }

    if (!checkLength(value, 5)) {
      return {
        validate: false,
        errorText: '请输入5位验证码'
      }
    }
    return {
      validate: true
    }
  }
}

function isEmpty(value) {
  let len = value.length
  if (len < 1) {
    return true
  } else {
    return false
  }
}

function isContainBlank(value) {
  if (/\s/.test(value)) {
    return true
  } else {
    return false
  }
}

function checkMobile(value) {
  if (!value.match(/^1\d{10}$/) || value.match(/^1[0-2]\d{9}$/)) {
    return false
  } else {
    return true
  }
}

function checkLength(value, len) {
  if (value.length != len) {
    return false
  } else {
    return true
  }
}

function checkPasswordFormat(value) {
  let reg = /(?![0-9A-Z]+$)(?![0-9a-z]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/
  if (reg.test(value)) {
    return true
  } else {
    return false
  }
}

export default validate
