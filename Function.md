#### bind

把一个js对象绑定到一个函数上，并返回一个新的函数的引用。
第一个参数是一个函数的引用，第二个参数是要绑定的对象，第二个参数是函数的参数

```javascript
window.name = 'a';

var func = function (greeting) {
    return greeting + ':' + this.name;
};

var f1 = _.bind(func, {name: 'wang'}, 'hi');
var f2 = _.bind(func, {name: 'xu'}, 'hi');

f1();   //'hi:wang'
f2();   //'hi:xu'
func('hello'); //'hello:a'
```

如果是用`_.bind()`返回的函数作为构造函数，则原函数内部的上下文不是传入的对象了

```javascript
var name = 't';
var F = function() {
    console.log(this.name);
};
var boundf = _.bind(F, {name: 'moe curly'});
var Boundf = boundf;
var newBoundf = new Boundf();   //这里是undefined，而不是'moe curly'
```

#### bindAll

把一些方法绑定到指定的对象上，这些方法就会在这个对象的上下文中执行。经常用作事件处理函数的场景。

```html
<p>_.bindAll Practice</p>
<div id="wrapper">
    <ol>
        <li class="btn">button</li>
        <li class="btn">button</li>
    </ol>
</div>
```

```javascript
var buttonView = {
    label: 'underscore',
    onClick: function () {
        console.log('clicked: ' + this.label);
    },
    onHover: function (e) {
        var elem = e.target;
        elem.setAttribute('style', 'color: red');
    }
};

// 把onClick和onHover方法绑定到buttonView对象上。
// 如果不使用这行代码，那么事件回调中的this指向的是Element对象（Button按钮），而不是buttonView对象
// bindAll后，buttonView发生改变，即buttonView.onClick和buttonView.onHover的函数中上下文为buttonView对象，而不是Element元素，参考源码
_.bindAll(buttonView, 'onClick', 'onHover');

var btn = document.querySelectorAll('.btn');

for (var i = 0; i < btn.length; i++) {
    btn[i].addEventListener('click', buttonView.onClick, false);
    btn[i].addEventListener('mouseover', buttonView.onHover, false);
}
```

以上代码如果使用`_.bind()`

```javascript
var click = _.bind(buttonView.onClick, buttonView);
var hover = _.bind(buttonView.onHover, buttonView);
var btn = document.querySelectorAll('.btn');
for (var i = 0; i < btn.length; i++) {
    btn[i].addEventListener('click', click, false);
    btn[i].addEventListener('mouseover', hover, false);
}
```

#### partial

填充函数的部分参数，返回一个新的函数。

填充全部参数

```javascript
var subtract = function(a, b) { 
    return b - a; 
};
// 给subtract填充参数，a=5,b=20，返回一个新的函数sub
var sub = _.partial(subtract, 5, 20);
sub(); //15
```

填充部分参数

```javascript
var subtract = function(a, b) { 
    return b - a; 
};
// 给subtract填充参数，a=5，返回一个新的函数sub5,这个函数接受一个新的参数，就是subtract的第二个参数b
var sub5 = _.partial(subtract, 5);
sub5(20); //15
```

使用占位符填充部分参数

```javascript
var subtract = function(a, b) { 
    return b - a; 
};
// 用_占位a,b=20,返回一个新的函数subFrom20,这个函数接受一个新的参数，就是使用占位符的a
var subFrom20 = _.partial(subtract, _, 20);
subFrom20(5); //15
```

#### memoize

可以缓存函数的计算结果，对于耗时较长的计算是有帮助的。

不使用memoize时：

```javascript
var fibonacci = function (n) {
    return n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2);
};
fibonacci(10);  //55
```

使用memoize时：

```javascript
var fibonacci = _.memoize(function(n) {
    return n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2);
});
fibonacci(10);  //55
```

#### delay

类似`setTimeout()`，在指定的毫秒后调用方法。第三个参数为要传递给被调用函数的参数

```javascript
var show = function (str) {
    console.log(str);
};
_.delay(show, 1000, 'hello');
```

#### defer

延迟调用function直到当前调用栈清空为止，类似使用延时为0的`setTimeout`方法。对于执行开销大的计算和无阻塞UI线程的HTML渲染时候非常有用。

```javascript
_.defer(function () {
    alert('deferred');
});
```

#### once

创建一个只能被调用一次的函数。作为初始化函数使用时非常有用, 不用再设一个boolean值来检查是否已经初始化完成.

```javascript
var createApplication = function () {
    alert('once');
};

var initialize = _.once(createApplication);
initialize();
initialize();
```

#### after

创建一个函数, 只有在运行了`count`次之后才有效果. 在处理同组异步请求返回结果时, 如果你要确保同组里所有异步请求完成之后才执行这个函数, 这将非常有用

```javascript
var list = [1, 2, 3];
var save = function () {
    console.log('save');
};
// aftersave在被第三次调用时才调用save
var aftersave = _.after(list.length, save);
_.each(list, function (val) {
    aftersave();
});
```

#### before

创建一个函数，调用不超过count次（从count次开始返回的结果是count-1次的值）

```javascript
var i = 1;

var add = function () {
    return i++;
};

var before = _.before(3, add);
var r1 = before();
console.log(r1);    //1
var r2 = before();
console.log(r2);    //2
// 从第3次调用开始，返回的都是第二次的结果
var r3 = before();
console.log(r3);    //2
var r4 = before();
console.log(r4);    //2
```

#### wrap

`_.wrap(function, wrapper)`

将第一个函数`function`封装到函数`wrapper`里面, 并把函数`function`作为第一个参数传给`wrapper`. 这样可以让`wrapper`在`function` 运行之前和之后执行代码

```javascript
// hello是要被封装的函数
var hello = function (name) {
    return 'hello: ' + name;
};

// 第二个参数是一个wrapper，它的参数是一个函数的引用，也就是第一个参数hello
var wrap = _.wrap(hello, function (func) {
    return "before, " + func("moe") + ", after";
});

wrap(); //"before, hello: moe, after"
```

例2

```javascript
var hello = function (name) {
    return 'hello: ' + name;
};

var call = function (func, v) {
    return "before, " + func("moe") + ", after " + v;
};
var wrap = _.wrap(hello, call);

wrap('aa'); //"before, hello: moe, after aa"
```

#### negate

返回一个新的`predicate`函数的否定版本

```javascript
var isEven = function (val) {
    return val % 2 === 0;
};
var isOdd = _.negate(isEven);

var r1 = _.filter([1, 2, 3, 4, 5, 6], isEven);
var r2 = _.filter([1, 2, 3, 4, 5, 6], isOdd);
console.log(r1);    //[2, 4, 6]
console.log(r2);    //[1, 3, 5]
```

#### compose

返回函数集`functions`组合后的复合函数, 也就是一个函数执行完之后把返回的结果再作为参数赋给下一个函数来执行.

```javascript
var greet = function (name) {
    return "hi: " + name;
};
var exclaim = function (statement) {
    return statement.toUpperCase() + "!";
};

var welcome = _.compose(greet, exclaim);
welcome('wang');    //'hi: WANG!'
```

实际调用顺序（参考源码）

```javascript
// 先调用最后一个函数
var result = exclaim('wang');
// 再把返回值作为参数调用第一个函数
greet(result);
```

