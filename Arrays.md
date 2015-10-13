#### first

返回数组的第一个元素

```javascript
_.first([5, 4, 3, 2, 1]);   //5
```

如果指定了第二个参数，则返回一个包含前面n个元素的数组

```javascript
_.first([5, 4, 3, 2, 1], 1);   //[5]
```

```javascript
_.first([5, 4, 3, 2, 1], 2);   //[5, 4]
```

#### initial

返回数组中除了最后一个元素以外的所有元素组成的数组

```javascript
_.initial([5, 4, 3, 2, 1]); //[5, 4, 3, 2]
```

如果指定了第二个参数，返回除了最后面n个元素的其它元素组成的数组。

```javascript
_.initial([5, 4, 3, 2, 1], 3);  //[5, 4]
```

#### last

和`_.first()`相反，返回数组的最后一个元素。

```javascript
_.last([5, 4, 3, 2, 1]);   //1
```

指定了第二个参数，则返回一个包含最后面n个元素的数组

```javascript
_.last([5, 4, 3, 2, 1], 1);   //[1]
```

```javascript
_.last([5, 4, 3, 2, 1], 2);   //[2, 1]
```

#### rest

和`_.initial()`相反，返回数组中除了第一个元素以外的所有元素组成的数组

```javascript
_.rest([5, 4, 3, 2, 1]); //[4, 3, 2, 1]
```

如果指定了第二个参数，返回除了最前面n个元素的其它元素组成的数组。

```javascript
_.rest([5, 4, 3, 2, 1], 3); //[2, 1]
```

#### compact

返回一个不包含以下元素`false`, `null`, `0`, `""`, `undefined`, `NaN`的数组

```javascript
_.compact([0, 1, false, 2, '', 3]); //[1, 2, 3]
```

#### flatten

把多层嵌套的数值转化为单层数组

```javascript
_.flatten([1, [2], [3, [[4]]]]);    //[1, 2, 3, 4]
```

如果指定了第二个参数为true，只减少一层嵌套

```javascript
_.flatten([1, [2], [3, [[4]]]], true);    //[1, 2, 3, [[4]]]
```

#### without

返回一个不包含指定元素的数组

```javascript
// 返回一个不包含0和1的数组
_.without([1, 2, 1, 0, 3, 1, 4], 0, 1); //[2, 3, 4]
```

#### union

把一个或多个数组合并成一个数组，数组中去除相同的元素。

```javascript
_.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);    //[1, 2, 3, 101, 10]
```

```javascript
_.union([1, 2, 3, 2, 4]);   //[1, 2, 3, 4]
```

#### intersection

把多个数组合并成一个数组，数组中包含每个数组中共同拥有的元素。

```javascript
// 因为每个数组都有共同的元素1, 2，所以返回[1, 2]
_.intersection([1, 2, 3], [101, 2, 1, 10], [2, 1]); //[1, 2]
```

#### difference

和`_.without()`类似，返回一个数组，数组中的元素只在第一个数组中存在。

```javascript
// 1,3,4只存在第一个数组中，2和5也存在第二个数值中
_.difference([1, 2, 3, 4, 5], [5, 2, 10]);  //[1, 3, 4]
```

```javascript
// 10只存在第一个数组中，2和5也存在第二个数值中
_.difference([5, 2, 10], [1, 2, 3, 4, 5]);  //[10]
```

#### uniq

返回一个数组，数组中的每个元素是唯一的。

```javascript
_.uniq([1, 2, 1, 4, 1, 3]); //[1, 2, 4, 3]
```

如果数组是排序的，可以传入第二个参数true，可以使用更快速的算法获取结果

```javascript
_.uniq([1, 1, 2, 2, 3, 3, 4], true); //[1, 2, 3, 4]
```

第二个参数还可以是函数

```javascript
var r = _.uniq([1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 4], function (value) {
    return Math.floor(value);
});
console.log(r);//[1.1, 2.1, 3.1, 4]
```

#### zip

合并数组，把不同数组中相同位置的元素合并到一个数组中。（参数是多个数组）

```javascript
_.zip(['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]);   
//[["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]
```

#### unzip

`_.zip()`的逆向操作（参数是一个二维数组）

```javascript
_.unzip([["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]);
//[['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]]
```

#### object

把多个数组转化成js对象。

如参数包含两个数组，前一个数组作为key的集合`[key1, key2, key3...]`，后一个数组作为value的集合`[value1, value2, value3...]`

```javascript
_.object(['moe', 'larry', 'curly'], [30, 40, 50]);  //{moe: 30, larry: 40, curly: 50}
```

如果参数是一个二维数组，每个子数组都是一个`[key,value]`的集合

```javascript
_.object([['moe', 30], ['larry', 40], ['curly', 50]]);  //{moe: 30, larry: 40, curly: 50}
```

#### indexOf

返回指定元素在数组中的第一个索引位置，如果找不到指定元素返回-1

```javascript
_.indexOf([1, 2, 3, 2], 2); //1
```

#### lastIndexOf

返回指定元素在数组中的最后一个索引位置，如果找不到指定元素返回-1

```javascript
_.lastIndexOf([1, 2, 3, 1, 2, 3], 2);   //4
```

#### sortedIndex

第一个参数是一个数组，第二个参数是一个值（也可以是js对象），这个值它应该按照数组的默认顺序插入到数组中的哪个位置，返回这个位置的索引。

```javascript
_.sortedIndex([10, 20, 30, 40, 50], 35);    //3
```

如果数组本身是无序的，数组元素不会重排，这里不会是3

```javascript
_.sortedIndex([30, 40, 10, 50, 20], 35);    //5
```

第二参数是一个js对象，第三个参数是一个字符串（js对象的一个属性），这个js对象它应该按照这个属性作为排序的依据插入到哪个位置，返回这个位置的索引。

```javascript
var stooges = [{name: 'moe', age: 40}, {name: 'curly', age: 60}];
_.sortedIndex(stooges, {name: 'larry', age: 50}, 'age');    //1
```

#### findIndex

和`_.indexOf()`类似，不同的是第二个参数是一个函数，返回第一个返回true的值的索引

```javascript
var r = _.findIndex([4, 6, 8, 12], function (element) {
    return element % 2 === 0;   //第一个返回true的值是4，它在数值中的索引是0
});
console.log(r); //0
```

#### findLastIndex

和`_.findIndex()`相反，它返回最后一个返回true的值的索引

```javascript
var r = _.findLastIndex([4, 6, 8, 12], function (element) {
    return element % 2 === 0;  //最后一个返回true的值是12，它在数值中的索引是3
});
console.log(r); //3
```

第一个参数是一个对象数组，第二个参数是一个js对象

```javascript
var users = [
    {'id': 1, 'name': 'Bob', 'last': 'Brown'},
    {'id': 2, 'name': 'Ted', 'last': 'White'},
    {'id': 3, 'name': 'Frank', 'last': 'James'},
    {'id': 4, 'name': 'Ted', 'last': 'Jones'}
];

// 查找name为'Ted'的元素在数组的索引
var r = _.findLastIndex(users, {name: 'Ted'});
console.log(r); //3
```

#### range

创建一个由整型元素组成的数组，第一个参数是起始值（默认为0），第二个参数是stop值，第三个参数是步长

只有一个参数，数组的stop值（数值中不包含这个值）：

```javascript
// 创建一个stop=10的数组，起始值默认为0，步长默认为1
_.range(10); //[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

有两个参数，第一个参数是起始值，第二个参数是数组的stop值：

```javascript
// 创建一个stop=11的数组，起始值为1，步长默认为1
_.range(1, 11); //[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

有3个参数，第一个参数是起始值，第二个参数是数组的stop值，最后一个参数是步长：

```javascript
_.range(0, 30, 5);  //[0, 5, 10, 15, 20, 25]
```

```javascript
_.range(0, -10, -1);    //[0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
_.range(0); //[]
```

