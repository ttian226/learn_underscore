#### noConflict

用新的变量名引用Underscore对象，释放出`_`变量。

```javascript
var underscore = _.noConflict();
var _ = 1;
console.log(_); //1

underscore.each([1, 2, 3], function (element, index, list) {
    console.log(element);
});
```

#### identity

返回与传入参数相等的值，相当于`f(x) = x`。这个函数看似没用，但是在underscore里是作为默认的迭代器。

```javascript
var stooge = {name: 'moe'};
stooge === _.identity(stooge); //true
```

#### constant

创建一个函数，返回相同的值。

```javascript
var stooge = {name: 'moe'};
stooge = _.constant(stooge)(); //true
```

#### noop

`_.noop()`返回`undefined`，`_.noop`返回一个空函数，通常用作回调函数的默认参数

```javascript
_.noop();   //undefined
_.noop; //返回一个空函数：function(){}
```

```javascript
var obj = {};
obj.func = _.noop;
```

```javascript
function aFunctionThatAcceptsACallback(callback) {
    var call = callback || _.noop;
    call();
}
var call = function () {
    console.log('do something');
};
aFunctionThatAcceptsACallback(call);
```

#### times

调用指定的函数n次，第一个参数是执行的次数，第二个参数是要调用的函数。回调函数的参数是指当前是第几次调用（从0开始）

```javascript
var func = function (n) {
    console.log(n);
};
_.times(3, func);
//0
//1
//2
```

#### random

返回一个指定范围的随机整数，如果只传一个参数最小值从0开始。

```javascript
_.random(0, 100); //返回0-100的一个随机数
_.random(100);//同上
```

#### mixin

给undersocre添加自定义函数

```javascript
_.mixin({
    // 给underscore添加自定义函数capitalize
    capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    }
});
_.capitalize('wangxu'); //'Wangxu'
```

#### iteratee

用来作为集合方法的回调函数使用，支持这些集合的方法有`map`, `find`, `filter`, `reject`, `every`, `some`, `max`, `min`, `sortBy`, `groupBy`, `indexBy`, `countBy`, `sortedIndex`, `partition`, `unique`

```javascript
var stooges = [{name: 'curly', age: 25}, {name: 'moe', age: 21}, {name: 'larry', age: 23}];
_.map(stooges, _.iteratee('age'));  //[25, 21, 23]
```

#### uniqueId

产生全局唯一的id，参数中指定前缀。

```javascript
// 每次执行uniqueId后，id+1
_.uniqueId('contact_'); //'contact_1'
_.uniqueId('contact_'); //'contact_2'
_.uniqueId('contact_'); //'contact_3'
```

#### escape

转义html字符串，替换&, <, >, ", `, '等字符

```javascript
_.escape('Curly, Larry & Moe'); //"Curly, Larry &amp; Moe"
```

#### unescape

和`_.escape()`相反，替换&amp;, &lt;, &gt;, &quot;, &#96;, &#x27;等字符

```javascript
_.unescape('Curly, Larry &amp; Moe');   //"Curly, Larry & Moe"
```

#### result

第一个参数是一个对象，第二个参数是这个对象的一个属性名，如果值是一个方法那么这个方法将被调用。如果值不是一个方法那么直接返回这个值。如果属性名不存在，第三个参数是一个默认值，将返回这个默认值。

```javascript
var object = {
    cheese: 'crumpets',
    stuff: function () {
        return 'nonsense';
    }
};
_.result(object, 'stuff'); //'nonsense'
_.result(object, 'cheese');//'crumpets'
// 'meat'属性不存在，返回默认值'ham'
_.result(object, 'meat', 'ham');//'ham'
```

#### now

返回一个当前时间的一个整型的时间戳

```javascript
_.now();    //1443509921727
```

#### template

把js模板转化成可以被渲染的模板函数

当只传一个参数时，会返回一个模板函数。这个模板函数接收一个js对象作为模板的数据。

```javascript
var templateString = 'hello: <%= name %>';
// 返回一个模板函数compiled
var compiled = _.template(templateString);
// 给compiled传入数据，返回结果
var html = compiled({name: 'wang'}); 
console.log(html); //hello: wang
```

传入的数据带有html标签，如果使用`<%= %>`会按原样输出

```javascript
var templateString = 'hello: <%= name %>';
var compiled = _.template(templateString);
var html = compiled({name: '<script>'});
console.log(html); //hello: <script>
```

如果想转义传入数据的html，需要使用`<%- %>`

```javascript
var templateString = 'hello: <%- name %>';
var compiled = _.template(templateString);
var html = compiled({name: '<script>'});
console.log(html); //hello: &lt;script&gt;
```

还支持模板中使用js，需要使用`<% %>`

```javascript
var
    templateString =
        "<% _.each(people, function(name) { %> " +
        "<li><%= name %></li> " +
        "<% }); %>";

var compiled = _.template(templateString);
var data = {people: ['moe', 'curly', 'larry']};
var html = compiled(data);
console.log(html);// <li>moe</li>  <li>curly</li>  <li>larry</li> 
```



