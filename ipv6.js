/* 
 * 一个处理 ipv6 地址的工具库 * 
 * 由于 javascript 对大整数的精度的限制，所以此库大部分地方用字符串传递和解析 ipv6 地址：
 * 有关 javascript 的精度可以研究这里： http://lifesinger.wordpress.com/2011/03/07/js-precision/
 * 
 * 使用方法：
 * 可以直接调用，如：(new ipv6()).format('your ip');
 * 亦可以预定义地址，如：var myipv6 = new ipv6('your ip'); return myipv6.addr;
 */

/*
 * TODO:
 * 格式化部分完成对短 IP 的处理，如 ::1
 * 完成返回区间地址的方法， function range(addr, distant, full)
 *
 */

function ipv6(str) {
  
  /*
  * 格式化 ipv6 地址, 返回结果或负值：
  *    -1: 输入非 string;
  *    -2: 含有非法字符;
  *    -3: 段数过多;
  *    -4: 格式错误
  * addr: 处理的字符串，输入的字符串可以为以下格式：
  *    "[2001:0:4a3f:74dc:30a6:a45f:2476:178c]"
  *    "2001:0:4a3f:74dc:30a6:a45f:2476:178c"
  *    "2001-0-4a3f-74dc-30a6-a45f-2476-178c"
  *    "200100004a3f74dc30a6a45f2476178c"
  * quote: 输出是否包含方括号
  * separator: 指定原始分隔符, 如上例三
  */  
  this.format = function(addr,quote,separator) {
    if(typeof(addr)=="undefined") addr = this.addr;
    if(typeof(addr)!='string') return -1;
    if(separator) addr = addr.replace(separator,':');
    if(addr.replace(/\[|\]|:|\d|[a-f]/ig, '')!='') return -2;
    if(addr.replace(/\d|[a-f]/ig,'')=='' && addr.length==32) 
      addr = addr.replace(/(\d|[a-f]){4}(?!$)/g,function(n){return n+':';});
    else 
      addr = addr.replace(/\[|\]/g,'');
    var addr_arr = addr.split(':');
    if(addr_arr.length != 8) return -3;
    for(var i in addr_arr) {
      if(!addr_arr[i]) addr_arr[i] = 0;
      var item = addr_arr[i];
      if((item != 0 && !parseInt('0x'+item)) || (parseInt('0x'+item)>0xffff)) return -4;
    }  
    return quote?'['+addr+']':addr;
  }

  /*
  * 返回以冒号未分隔线的数组,
  * check: 是否先检查地址是否符合标准
  */
  this.arr = function(addr,check) {
    if(typeof(addr)=="undefined") addr = this.addr;
    addr = check?this.format(addr):addr;
    return addr.split(':');
  }

  this.addr = this.format(str);
  
  /*
  * 返回
  */
  return this;
}
