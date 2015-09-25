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

#### invoke

第二个参数是一个函数名
返回这个函数调用数组中每个元素的结果组成的一个数组。

```javascript
var r = _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');

console.log(r); //[[1, 5, 7], [1, 2, 3]]
```

#### pluck

第一个参数是js对象组成的数组，第二个参数是指定的属性名
返回一个数组，数组中每个元素由指定的属性名所对应的值组成。

```javascript
var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
var r = _.pluck(stooges, 'name');
console.log(r); //["moe", "larry", "curly"]
```

#### max

返回数组中的最大值

```javascript
var r = _.max([1, 2, 3], function (element) {
    return element;
});
console.log(r); //3
```

或者是

`_.max([1, 2, 3]);`

数组的元素是对象

```javascript
var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
var r = _.max(stooges, function (element) {
    return element.age; //获取age值最大的那个元素
});

console.log(r); //{name: "curly", age: 60}
```

#### min

返回数组中的最小值

```javascript
var numbers = [10, 5, 100, 2, 1000];
_.min(numbers); //2
```

#### sortBy

返回一个排序的新数组，第二个参数是一个回调

```javascript
var r = _.sortBy([1, 2, 3, 4, 5, 6], function (element) {
    return Math.sin(element);   //根据Math.sin()的结果由小到大排序
});

console.log(r); //[5, 4, 6, 3, 1, 2]
```

第二个参数可以是字符串，它列表中元素的属性名

```javascript
var stooges = [{name: 'moe', age: 40}, {name: 'curly', age: 60}, {name: 'larry', age: 50}];
var r = _.sortBy(stooges, 'age');   //按照属性age由小到大，返回一个新的数组
console.log(r); //[{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}]
```

#### groupBy

给列表中的元素分组，返回一个新的对象

```javascript
var r = _.groupBy([1.3, 2.1, 2.4], function (element) {
    return Math.floor(element); //按照Math.floor的结果分组
});

console.log(r); //{1: [1.3], 2: [2.1, 2.4]}
```

如果第二个参数是字符串时，作为每个元素的属性来分组

```javascript
var r = _.groupBy(['one', 'tow', 'three'], 'length');   //按照length属性分组
console.log(r); //{3: ["one", "two"], 5: ["three"]}
```

上面的分组也可以这么写：

```javascript
var r = _.groupBy(['one', 'tow', 'three'], function (element) {
    return element.length;  //按照字符串的长度分组
});
console.log(r); //{3: ["one", "two"], 5: ["three"]}
```

#### indexBy

返回一个对象，对象中的属性名由第二个参数决定，它可以是一个函数，返回指定的属性名

```javascript
var stooges = [{name: 'moe', age: 40}, {name: 'curly', age: 60}, {name: 'larry', age: 50}];
var r = _.indexBy(stooges, function (element) {
    return element.age; //age属性作为索引
});
console.log(r); 
//{
//"40": {name: 'moe', age: 40},
//"50": {name: 'larry', age: 50},
//"60": {name: 'curly', age: 60}
//}
```

第二个参数可以是字符串，它是元素的一个属性名，上面的代码也可以这么写：

```javascript
var stooges = [{name: 'moe', age: 40}, {name: 'curly', age: 60}, {name: 'larry', age: 50}];
var r = _.indexBy(stooges, 'age');  //根据age的值作为索引分组
console.log(r); 
//{
//"40": {name: 'moe', age: 40},
//"50": {name: 'larry', age: 50},
//"60": {name: 'curly', age: 60}
//}
```

#### countBy

和`_.groupBy()`类似，给列表中的元素分组，返回一个新的对象，和`_.groupBy()`不同的是它的值不是数组而是在数组中值的个数。

```javascript
var r = _.countBy([1.3, 2.1, 2.4], function (element) {
    return Math.floor(element);
});

console.log(r); //{1: 1, 2: 2}
```

```javascript
var r = _.countBy([1, 2, 3, 4, 5], function (element) {
    return element % 2 === 0 ? 'even' : 'odd';
});

console.log(r); //{odd: 3, even: 2}
```

第二个参数是个字符串

```javascript
var r = _.countBy(['one', 'tow', 'three'], 'length');
console.log(r); //{3: 2, 5: 1}
```

#### shuffle

返回一个打乱的新的数组

```javascript
var r = _.shuffle([1, 2, 3, 4, 5, 6]);
console.log(r); //[4, 1, 6, 3, 5, 2]
```

#### sample

随机返回数组的的一个值，或由几个值组成的一个数组。
如果不指定第二个参数，随机返回一个值。

```javascript
var r = _.sample([1, 2, 3, 4, 5, 6]);   //随机返回一个值
console.log(r); //4
```

如果指定了第二个参数，则返回一个数组

```javascript
var r = _.sample([1, 2, 3, 4, 5, 6], 1); //返回随机取1个值组成的数组
console.log(r); //[4]
```

```javascript
var r = _.sample([1, 2, 3, 4, 5, 6], 3); //返回随机取3个值组成的数组
console.log(r); //[1, 3, 4]
```

#### toArray

转化为真实的数组，通常用于把函数的argument对象转换为数组（通常把Array like对象转化为数组）

```javascript
function test() {
    var args = _.toArray(arguments);    //把arguments对象转化为数组
    var r = args.slice(1);
    console.log(r);
}

test(1, 2, 3, 4);
```

#### size

返回列表中元素的个数，列表可以是数组也可以是js对象

```javascript
_.size({one: 1, two: 2, three: 3});     //3
_.size([1, 2, 3, 4, 5, 6]);     //6
```

#### partition

把数组中的元素分成两个数组，一部分满足回调函数中的条件，一部分不满足回调中的条件

```javascript
var r = _.partition([0, 1, 2, 3, 4, 5], function (element) {
    return element % 2 === 0;   //把值为true的元素归为第一个数组，值为false的元素归为第二个数组
});

console.log(r); //[[0, 2, 4], [1, 3, 5]]
```
