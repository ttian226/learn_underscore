#### underscore的立即调用表达式

```javascript
// 通常写法
(function () {
    //this引用的是全局上下文的this
}());

// underscore的写法
(function () {
    //this现在是传过来的上下文了
}.call(this));  //通过call把上下文传递给匿名闭包
```


#### 创建underscore对象

```javascript
// 无new创建
var _ = function (obj) {
    if (obj instanceof _) {
        return obj;
    }

    if (!(this instanceof _)) {
        return new _(obj);
    }

    this._wrapped = obj;
};

// 给window对象添加属性'_'
// 可以通过'_([1, 2, 3])'创建underscore对象
// 或者可以通过'_.each()'引用underscore方法
root._ = _;
```

```javascript
// 这里_([1, 2, 3])就是通过无new构造函数创建的一个underscore对象
_([1, 2, 3]).each(function (i) {});
```

#### void 0

参考[JS魔法堂：从void 0 === undefined说起](http://www.cnblogs.com/fsjohnhuang/p/4146506.html)

 `undefined`在JavaScript中并不属于保留字/关键字，因此在IE5.5~8中我们可以将其当作变量那样对其赋值（IE9+及其他现代浏览器中赋值给undefined将无效）

```javascript
// 判断一个变量是否是未定义
if (a === void 0) {

}

// 尽量避免
if (a === undefined) {

}

// 或者使用立即调用表达式
(function (window, undefined) {
    // 这里可以使用undefined来判断
    if (a === undefined) {

    }
}(window));
```



