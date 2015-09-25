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

#### find

返回数组中第一个在回调中返回为true的元素，如果找不到则返回`undefined`。

```javascript
var r = _.find([1, 2, 3, 4, 5, 6], function (element) {
    return element % 2 === 0;
});

console.log(r); //2
```

#### filter

遍历数组，返回一个新的数组，新数组中每个值在回调中都返回true

```javascript
var r = _.filter([1, 2, 3, 4, 5, 6], function (element) {
    return element % 2 === 0;
});

console.log(r); //[2, 4, 6]
```

#### where

第一个参数是一个数组，数组中的每个元素都是一个js对象。第二个参数是一个js对象。
遍历数组，返回一个新的数组，这个数组中的每个元素（js对象）都包含指定js对象（第二个参数）所有的键值对。

```javascript
var list = [
    {author: "Shakespeare"},
    {year: 1611},
    {title: "Cymbeline", author: "Shakespeare", year: 1611},
    {title: "The Tempest", author: "Shakespeare", year: 1611}
];

var r = _.where(list, {author: "Shakespeare", year: 1611});

console.log(r); //[{title: "Cymbeline", author: "Shakespeare", year: 1611}, {title: "The Tempest", author: "Shakespeare", year: 1611}]
```

#### findWhere

同`_.where()`不同，它只返回第一个匹配的js对象，如果找不到匹配返回`undefined`

```javascript
var list = [
    {author: "Shakespeare"},
    {year: 1611},
    {title: "Cymbeline", author: "Shakespeare", year: 1611},
    {title: "The Tempest", author: "Shakespeare", year: 1611}
];

var r = _.findWhere(list, {author: "Shakespeare", year: 1611});

console.log(r); //{title: "Cymbeline", author: "Shakespeare", year: 1611}
```

#### reject

和`_.filter()`正相反，它返回的数组的每个值在回调中都返回false

```javascript
var r = _.reject([1, 2, 3, 4, 5, 6], function (element) {
    return element % 2 === 0;
});

console.log(r); //[1, 3, 5]
```

#### every

如果数组中每个元素在回调中都返回true，则返回true。如果数组中有一个值在回调中返回false，则返回false。

```javascript
var r = _.every([2, 4, 6], function (element) {
    return element % 2 === 0;
});

console.log(r); //true
```

```javascript
var r = _.every([1, 2, 4, 6], function (element) {
    return element % 2 === 0;
});

console.log(r); //false
```

#### some

和`_.every()`相反，如果数组中所有的元素都不通过测试，返回false。如果有一个元素通过测试返回true

```javascript
var r = _.some([1, 3, 5], function (element) {
    return element % 2 === 0;
});

console.log(r); //false
```

```javascript
var r = _.some([1, 2, 3, 5], function (element) {
    return element % 2 === 0;
});

console.log(r); //true
```

#### contains

如果指定的值在数组中找到返回true

```javascript
_.contains([1, 2, 3], 1);   //true
```

如果设置了第三个参数，表示查找的起始位置

```javascript
_.contains([1, 2, 3], 1, 1);   //false
```





