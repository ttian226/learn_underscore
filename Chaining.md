
`Underscore`可以使用函数式风格或者面向对象风格两种方式：

以下两种方式的执行结果都相同：

```javascript
_.map([1, 2, 3], function (val) {
    return val * 2;
});

_([1, 2, 3]).map(function (val) {
    return val * 2;
});
```

#### chain

返回一个封装的对象，在封装的对象上调用方法会返回封装的对象本身，直到调用`value()`方法为止

```javascript
var stooges = [
    {name: 'curly', age: 25},
    {name: 'moe', age: 21},
    {name: 'larry', age: 23}
];

var youngest = _.chain(stooges)
    .sortBy(function (element) {
        return element.age;
    })
    .map(function (element) {
        return element.name + ' is ' + element.age;
    })
    .first()
    .value();

console.log(youngest);  //moe is 21
```

#### value

获取封装对象的最终值
