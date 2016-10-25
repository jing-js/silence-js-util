// 不清楚琐碎的数字到字符串格式化对性能是否有影响。反正先生成好放那儿, 也占不了多少内存。
const PAD_2_NUMS = (new Array(100).fill(0).map((n, i) => pad(i)));
const PAD_3_NUMS = (new Array(1000).fill(0).map((n, i) => pad3(i)));
const TIME_ZONE = (function () {
  let to = (new Date()).getTimezoneOffset();
  let tn = to < 0;
  to = to < 0 ? -to : to;
  let th = (to / 60) | 0;
  let tm = (to - th * 60);
  return ` GMT${tn ? '+' : '-'}${pad(th)}${pad(tm)}`
})();

function pad(n) {
  return n < 10 ? '0' + n : n.toString();
}

function pad3(n) {
  return n < 10 ? '00' + n : (n < 100 ? '0' + n : n.toString());
}

function formatDate(date) {
  date = date ? date : new Date();
  return `${date.getFullYear()}/${PAD_2_NUMS[date.getMonth()+1]}/${PAD_2_NUMS[date.getDate()]} ${PAD_2_NUMS[date.getHours()]}:${PAD_2_NUMS[date.getMinutes()]}:${PAD_2_NUMS[date.getSeconds()]}.${PAD_3_NUMS[date.getMilliseconds()]}${TIME_ZONE}`;
}

formatDate.PAD_2_NUMS = PAD_2_NUMS;
formatDate.PAD_3_NUMS = PAD_3_NUMS;

module.exports = formatDate;

