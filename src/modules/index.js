import { MessageBox } from 'element-ui'
import Vue from 'vue'

export function elConfirm(text = '确定执行次操作吗？', type = 'warning') {
  return MessageBox.confirm(text, '注意', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: type,
    center: true
  })
}

