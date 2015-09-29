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
_.bindAll(buttonView, 'onClick', 'onHover');

var btn = document.querySelectorAll('.btn');

for (var i = 0; i < btn.length; i++) {
    btn[i].addEventListener('click', buttonView.onClick, false);
    btn[i].addEventListener('mouseover', buttonView.onHover, false);
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





