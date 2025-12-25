// 时间戳转普通日期
export function timeFormat(time) {
  let dateObj = new Date(time * 1000);
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  let day = dateObj.getDay();
  return `${year}-${month}-${day}`
}

export function filterFileType(file) {
  let match = file.match(/.*?sql$/g)
  if (match) {
    return file
  } else {
    return false
  }
}


