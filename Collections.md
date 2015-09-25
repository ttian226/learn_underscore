#### each

遍历数组中的值，回调函数参数依次为：element, index, list

```javascript
_.each([1, 2, 3], function (element, index, list) {
    console.log(element);
});
```

遍历javascript对象，回调函数参数依次为：value, key, list

```javascript
_.each({one: 1, two: 2, three: 3}, function (value, key, list) {
    console.log(value);
});
```

#### map

映射数组，返回一个新的数组，回调函数参数依次为：element, index, list

```javascript
var r = _.map([1, 2, 3], function (element, index, list) {
    return element * 3;
});

console.log(r); //[3, 6, 9]
```

```javascript
var r = _.map([[1, 2], [3, 4]], _.first);

console.log(r); //[1, 3]
```

映射js对象，返回一个新的数组，回调函数参数依次为：value, key, list

```javascript
var r = _.map({one: 1, two: 2, three: 3}, function (value, key, list) {
    return value * 3;
});

console.log(r); //[3, 6, 9]
```

#### reduce

把数组中的元素合并成一个值，回调函数第一个参数memo为一个初始值（第一次等于第3个参数的值，每次遍历存储一个临时结果保存到memo中）

```javascript
var r = _.reduce([1, 2, 3], function (memo, element, index, list) {
    return memo + element;
}, 0);

console.log(r); //6
```

把js对象合并成一个值，回调函数参数依次为：memo, value, key, list

```javascript
var r = _.reduce({one: 1, two: 2, three: 3}, function (memo, value, key, list) {
    return memo + value;
}, 0);

console.log(r); //6
```

#### reduceRight

把数组中的元素合并成一个值（数组元素从右向左遍历）

```javascript
var list = [[0, 1], [2, 3], [4, 5]];
var r = _.reduceRight(list, function (memo, element, index, list) {
    return memo.concat(element);
}, []);

console.log(r); //6
```
