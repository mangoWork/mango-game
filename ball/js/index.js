var Class =  function (options) {
    var that = this;
    that.init(options);
},
    Mango = function () {

},
    _mango = null;
    mango = function () {
        if(_mango == null){
            _mango = new Mango();
        }
    return _mango;
},
    ball = {
        v: '0.0.1'
    };



Mango.prototype = [];
Mango.prototype.constructor = Mango;

// 清除数据
Mango.prototype.clear = function () {
    _mango = null;
};

Mango.prototype.uuid = function () {
    var uuidStr = '';
    for(var i =0; i <8; i++){
        uuidStr += (((1+Math.random())*0x10000)|0).toString(16).substring(1)
    }
    return uuidStr;
};

// 获取节点
Mango.prototype.getDom = function (elm) {
    if(typeof elm === 'string'&&elm.constructor ==String){
        if(/^#/gi.test(elm)){
            return document.getElementById(elm);
        }else if(/^\./gi.test(elm)){
            return document.getElementsByClassName(elm);
        }else{
            return document.getElementsByTagName(elm);
        }
    }else{
        return null;
    }
};

mango = mango()

// 普通对象的深度扩展
mango.extend = function () {
    var args = arguments;
    // 对象的深度克隆
    var clone = function (target, obj) {
        target = target || (obj.constructor===Array? []:{});
        for(var i in obj){
            target[i] = (obj[i]&&(obj[i].constructor === Object))?clone(target[i], obj[i]):obj[i];
        }
        return target;
    };
    args[0] = typeof args[0] === 'object'? args[0]:{};
    for(var i=0; i<args.length; i++){
        if(typeof args[i] === 'object'){
            clone(args[0], args[i])
        }
    }
    return args[0]
};


Class.prototype.config = {
    ball: {
        ballNumber: 100, // 球的数量
        ballSize: 10,
        ballColor: {'#FFB6C1': 0.1, '#191970': 0.2, '#B0C4DE': 0.4, '#87CEFA': 0.1}, // 其中的key代表的是颜色，value代表不同颜色的球所占的百分比
        speed: 10
    },
    canvas: {
        dom: 'body',
        style: {width: 500, height: 300}
    }
};


Class.prototype.init = function (options) {
    var that = this;
    that.config = mango.extend(options);
    that.createdCanvas();
};

// 创建画布
Class.prototype.createdCanvas = function () {
    var that = this;
    var canvas = document.createElement('canvas');
    canvas.id = mango.uuid();
    canvas.style = that.config.canvas.style;
    var parents =  mango.getDom(that.config.canvas.dom);
    for(var parent in parents){
        parent.appendChild(canvas);
    }
};

Class.prototype.uuid = function () {
    var uuidStr = '';
    for(var i =0; i <8; i++){
        uuidStr += (((1+Math.random())*0x10000)|0).toString(16).substring(1)
    }
    return uuidStr;
};


ball.render = function (options) {
    var that = new Class(options);
};


