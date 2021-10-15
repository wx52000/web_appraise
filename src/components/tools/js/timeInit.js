function dateFormatInit() {
  String.prototype.dateFormat = Number.prototype.dateFormat = function(
    fmt = "yyyy-mm-dd HH:MM:SS"
  ) {
    let date = new Date(this);
    let fmtDate = fmt;
    // 转化时间
    let o = {
      "y+": date.getFullYear(),
      "m+": date.getMonth() + 1,
      "d+": date.getDate(),
      "H+": date.getHours(),
      "M+": date.getMinutes(),
      "S+": date.getSeconds()
    };

    for (let key in o) {
      // 正则
      let rep = new RegExp(`${key}`);

      // 是所需要的格式
      if (rep.test(fmt)) {
        fmtDate = fmtDate.match(rep) // 有匹配到所对应格式
          ? fmtDate.replace(
            fmt.match(rep)[0], // 将原来的格式进行值的替换 例如 yyyy - 2019
            // String(o[key]).padStart(fmt.match(rep)[0].length, "0") // ES2017写法
            String(o[key]).length === 1 ? `0${o[key]}` : `${o[key]}` // 例 小时为 7 时，在前面加上 0 ，变成 07
          )
          : "";
      }
    }

    return fmtDate;
  };
}
dateFormatInit;
