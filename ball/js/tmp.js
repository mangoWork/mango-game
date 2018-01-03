/**

 @Name : layDate 5.0.9 日期时间控件
 @Author: 贤心
 @Site：http://www.layui.com/laydate/
 @License：MIT

 */

;!function(){
  "use strict";

  var isLayui = window.layui && layui.define, ready = {
    getPath: function(){
      var jsPath = document.currentScript ? document.currentScript.src : function(){
        var js = document.scripts
        ,last = js.length - 1
        ,src;
        for(var i = last; i > 0; i--){
          if(js[i].readyState === 'interactive'){
            src = js[i].src;
            break;
          }
        }
        return src || js[last].src;
      }();
      return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
    }()

    //获取节点的style属性值
    ,getStyle: function(node, name){
      var style = node.currentStyle ? node.currentStyle : window.getComputedStyle(node, null);
      return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](name);
    }

    //载入CSS配件
    ,link: function(href, fn, cssname){

      //未设置路径，则不主动加载css
      if(!laydate.path) return;

      var head = document.getElementsByTagName("head")[0], link = document.createElement('link');
      if(typeof fn === 'string') cssname = fn;
      var app = (cssname || href).replace(/\.|\//g, '');
      var id = 'layuicss-'+ app, timeout = 0;

      link.rel = 'stylesheet';
      link.href = laydate.path + href;
      link.id = id;

      if(!document.getElementById(id)){
        head.appendChild(link);
      }

      if(typeof fn !== 'function') return;

      //轮询css是否加载完毕
      (function poll() {
        if(++timeout > 8 * 1000 / 100){
          return window.console && console.error('laydate.css: Invalid');
        };
        parseInt(ready.getStyle(document.getElementById(id), 'width')) === 1989 ? fn() : setTimeout(poll, 100);
      }());
    }
  }

  ,laydate = {

  }

  //组件构造器
  ,Class = function(options){

  }

  //DOM构造器
  ,LAY = function(selector){

  };


  /*
    lay对象操作
  */

  LAY.prototype = [];
  LAY.prototype.constructor = LAY;

  //查找子元素
  LAY.prototype.find = function(selector){

    return that;
  };


  /*
    组件操作
  */

  //默认配置
  Class.prototype.config = {
    type: 'date' //控件类型，支持：year/month/date/time/datetime
    ,range: false //是否开启范围选择，即双控件
    ,format: 'yyyy-MM-dd' //默认日期格式
    ,value: null //默认日期，支持传入new Date()，或者符合format参数设定的日期格式字符
    ,min: '1900-1-1' //有效最小日期，年月日必须用“-”分割，时分秒必须用“:”分割。注意：它并不是遵循 format 设定的格式。
    ,max: '2099-12-31' //有效最大日期，同上
    ,trigger: 'focus' //呼出控件的事件
    ,show: false //是否直接显示，如果设置true，则默认直接显示控件
    ,showBottom: true //是否显示底部栏
    ,btns: ['clear', 'now', 'confirm'] //右下角显示的按钮，会按照数组顺序排列
    ,lang: 'cn' //语言，只支持cn/en，即中文和英文
    ,theme: 'default' //主题
    ,position: null //控件定位方式定位, 默认absolute，支持：fixed/absolute/static
    ,calendar: false //是否开启公历重要节日，仅支持中文版
    ,mark: {} //日期备注，如重要事件或活动标记
    ,zIndex: null //控件层叠顺序
    ,done: null //控件选择完毕后的回调，点击清空/现在/确定也均会触发
    ,change: null //日期时间改变后的回调
  };

  //多语言
  Class.prototype.lang = function(){

    return text[options.lang] || text['cn'];
  };

  //初始准备
  Class.prototype.init = function(){
    var that = this
    ,options = that.config
    ,dateType = 'yyyy|y|MM|M|dd|d|HH|H|mm|m|ss|s'
    ,isStatic = options.position === 'static'
    ,format = {
      year: 'yyyy'
      ,month: 'yyyy-MM'
      ,date: 'yyyy-MM-dd'
      ,time: 'HH:mm:ss'
      ,datetime: 'yyyy-MM-dd HH:mm:ss'
    };

    options.elem = lay(options.elem);
    options.eventElem = lay(options.eventElem);

    if(!options.elem[0]) return;

    //日期范围分隔符
    if(options.range === true) options.range = '-';

    //根据不同type，初始化默认format
    if(options.format === format.date){
      options.format = format[options.type];
    }

    //将日期格式转化成数组
    that.format = options.format.match(new RegExp(dateType + '|.', 'g')) || [];

    //生成正则表达式
    that.EXP_IF = '';
    that.EXP_SPLIT = '';
    lay.each(that.format, function(i, item){
      var EXP =  new RegExp(dateType).test(item)
        ? '\\d{'+ function(){
          if(new RegExp(dateType).test(that.format[i === 0 ? i + 1 : i - 1]||'')){
            if(/^yyyy|y$/.test(item)) return 4;
            return item.length;
          }
          if(/^yyyy$/.test(item)) return '1,4';
          if(/^y$/.test(item)) return '1,308';
          return '1,2';
        }() +'}'
      : '\\' + item;
      that.EXP_IF = that.EXP_IF + EXP;
      that.EXP_SPLIT = that.EXP_SPLIT + '(' + EXP + ')';
    });
    that.EXP_IF = new RegExp('^'+ (
      options.range ?
        that.EXP_IF + '\\s\\'+ options.range + '\\s' + that.EXP_IF
      : that.EXP_IF
    ) +'$');
    that.EXP_SPLIT = new RegExp('^'+ that.EXP_SPLIT +'$', '');

    //如果不是input|textarea元素，则默认采用click事件
    if(!that.isInput(options.elem[0])){
      if(options.trigger === 'focus'){
        options.trigger = 'click';
      }
    }

    //设置唯一KEY
    if(!options.elem.attr('lay-key')){
      options.elem.attr('lay-key', that.index);
      options.eventElem.attr('lay-key', that.index);
    }
  };

  //控件主体渲染
  Class.prototype.render = function(){


  };

  //控件移除
  Class.prototype.remove = function(prev){
    var that = this
    ,options = that.config
    ,elem = lay('#'+ (prev || that.elemID));
    if(!elem.hasClass(ELEM_STATIC)){
      that.checkDate(function(){
        elem.remove();
      });
    }
    return that;
  };

  //定位算法
  Class.prototype.position = function(){

  };

  //提示
  Class.prototype.hint = function(content){

  };

  //获取递增/减后的年月
  Class.prototype.getAsYM = function(Y, M, type){

  };

  //系统消息
  Class.prototype.systemDate = function(newDate){

  };

  //日期校验
  Class.prototype.checkDate = function(fn){

  };

  //公历重要日期与自定义备注
  Class.prototype.mark = function(td, YMD){

  };

  //无效日期范围的标记
  Class.prototype.limit = function(elem, date, index, time){

  };

  //日历表
  Class.prototype.calendar = function(value){

  };

  //生成年月时分秒列表
  Class.prototype.list = function(type, index){

  };

  //记录列表切换后的年月
  Class.prototype.listYM = [];

  //关闭列表
  Class.prototype.closeList = function(){

  };

  //检测结束日期是否超出开始日期
  Class.prototype.setBtnStatus = function(tips, start, end){

  };

  //转义为规定格式的日期字符
  Class.prototype.parse = function(state, date){

  };

  //创建指定日期时间对象
  Class.prototype.newDate = function(dateTime){

  };

  //赋值
  Class.prototype.setValue = function(value){
    var that = this
    ,options = that.config
    ,elem = that.bindElem || options.elem[0]
    ,valType = that.isInput(elem) ? 'val' : 'html'

    options.position === 'static' || lay(elem)[valType](value || '');
    return this;
  };

  //标记范围内的日期
  Class.prototype.stampRange = function(){

  };

  //执行done/change回调
  Class.prototype.done = function(param, type){
    var that = this
    ,options = that.config
    ,start = lay.extend({}, that.startDate ? lay.extend(that.startDate, that.startTime) : options.dateTime)
    ,end = lay.extend({}, lay.extend(that.endDate, that.endTime))

    lay.each([start, end], function(i, item){
      if(!('month' in item)) return;
      lay.extend(item, {
        month: item.month + 1
      });
    });

    param = param || [that.parse(), start, end];
    typeof options[type || 'done'] === 'function' && options[type || 'done'].apply(options, param);

    return that;
  };

  //选择日期
  Class.prototype.choose = function(td){

  };

  //底部按钮
  Class.prototype.tool = function(btn, type){

  };

  //统一切换处理
  Class.prototype.change = function(index){
    var that = this
    ,options = that.config
    ,dateTime = options.dateTime
    ,isAlone = options.range && (options.type === 'year' || options.type === 'month')

    ,elemCont = that.elemCont[index || 0]
    ,listYM = that.listYM[index]
    ,addSubYeay = function(type){
      var startEnd = ['startDate', 'endDate'][index]
      ,isYear = lay(elemCont).find('.laydate-year-list')[0]
      ,isMonth = lay(elemCont).find('.laydate-month-list')[0];

      //切换年列表
      if(isYear){
        listYM[0] = type ? listYM[0] - 15 : listYM[0] + 15;
        that.list('year', index);
      }

      if(isMonth){ //切换月面板中的年
        type ? listYM[0]-- : listYM[0]++;
        that.list('month', index);
      }

      if(isYear || isMonth){
        lay.extend(dateTime, {
          year: listYM[0]
        });
        if(isAlone) that[startEnd].year = listYM[0];
        options.range || that.done(null, 'change');
        that.setBtnStatus();
        options.range || that.limit(lay(that.footer).find(ELEM_CONFIRM), {
          year: listYM[0]
        });
      }
      return isYear || isMonth;
    };


  };

  //日期切换事件
  Class.prototype.changeEvent = function(){
  };

  //是否输入框
  Class.prototype.isInput = function(elem){
  };

  //绑定的元素事件处理
  Class.prototype.events = function(){

  };


  //核心接口
  laydate.render = function(options){
    var inst = new Class(options);
    return thisDate.call(inst);
  };




}();