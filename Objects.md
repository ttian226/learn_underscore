#### keys

检索一个对象所有可枚举的属性返回一个数组

```javascript
_.keys({one: 1, two: 2, three: 3}); //["one", "two", "three"]
```

不能返回继承的属性：

```javascript
function Stooge(name) {
    this.name = name;
}
Stooge.prototype.silly = true;
var o = new Stooge();
_.keys(o);  //['name']
```

#### allKeys

检索一个对象的所有属性（包括继承的属性），返回一个数组

```javascript
function Stooge(name) {
    this.name = name;
}
Stooge.prototype.silly = true;
var o = new Stooge();
_.allKeys(o);   //['name', 'silly']
```

#### values

返回一个对象所有属性的值组成的数组

```javascript
_.values({one: 1, two: 2, three: 3});   //[1, 2, 3]
```

#### mapObject

映射对象。返回一个新的对象。类似`_.map()`

```javascript
var r = _.mapObject({start: 5, end: 12}, function (val, key) {
    return val + 5;
});
console.log(r); //{start: 10, end: 17}
```

#### pairs

把对象转换一个二维数组

```javascript
_.pairs({one: 1, two: 2, three: 3});  //[["one", 1], ["two", 2], ["three", 3]]
```

#### invert

把对象的属性和值互相转换返回一个新的对象。（原有的key变成value，原有的value变成key）

```javascript
_.invert({Moe: "Moses", Larry: "Louis", Curly: "Jerome"}); 
//{Moses: "Moe", Louis: "Larry", Jerome: "Curly"}
```

#### create

创建具有给定原型的新对象

#### functions

返回对象里的所有方法名

```javascript
var o = {
    name: 'underscore',
    func1: function () {},
    func2: function () {}
};
_.functions(o); //['func1', 'func2']
```

#### findKey

同`_.findIndex()`类似，它是查找对象，而不是查找数组。返回在回调中结果为true对应的key

```javascript
var r = _.findKey({one: 1, two: 2, three: 3}, function (val, key) {
    return val === 2;
});
console.log(r); //'two'
```

#### extend

第一个参数为目标对象，第二个参数为源对象。把源对象的所有属性覆盖到目标对象上，如果目标对象有同名属性奖会被覆盖。

```javascript
_.extend({name: 'moe'}, {age: 50}); //{name: "moe", age: 50}
_.extend({name: 'moe', age: 30}, {age: 50}); //{name: "moe", age: 50}
```

源对象有继承属性，覆盖后包括继承的属性：

```javascript
function Source_obj(name, age) {
    this.name = name;
    this.age = age;
}
Source_obj.prototype.addr = 'shenyang';    //addr为原型属性

var dest_obj = {one: 1, two: 2};    //目标对象
var m = new Source_obj('wang', 35);//创建一个新的Source_obj对象m作为源对象

_.extend(dest_obj, m);  
//{one: 1, two: 2, name: "wang", age: 35, addr: "shenyang"}
```

#### extendOwn

和`_.extend()`不同的是，它只会覆盖自己的属性（不会覆盖继承的属性）

```javascript
function Source_obj(name, age) {
    this.name = name;
    this.age = age;
}
Source_obj.prototype.addr = 'shenyang';    //addr为原型属性

var dest_obj = {one: 1, two: 2};    //目标对象
var m = new Source_obj('wang', 35);//创建一个新的Source_obj对象m作为源对象

_.extendOwn(dest_obj, m);
//{one: 1, two: 2, name: "wang", age: 35}
```

#### pick

提取指定的属性返回一个对象的拷贝。第一个参数是目标对象，从第二个参数开始是白名单key（要保留下来的属性）

```javascript
_.pick({name: 'moe', age: 50, userid: 'moe1'}, 'name', 'age');  //{name: 'moe', age: 50}
```

第二个参数还可以是一个函数:

```javascript
_.pick({name: 'moe', age: 50, userid: 'moe1'}, function (value, key, object) {
    return _.isNumber(value);
});
// {age: 50}
```

#### omit

和`_.pick()`相反，提取指定的属性返回一个对象的拷贝。第一个参数是目标对象，从第二个参数开始是黑名单key（要过滤掉的属性）

```javascript
_.omit({name: 'moe', age: 50, userid: 'moe1'}, 'userid'); //{name: 'moe', age: 50}
```

```javascript
_.omit({name: 'moe', age: 50, userid: 'moe1'}, function (value, key, object) {
    return _.isNumber(value);
});
//{name: 'moe', userid: 'moe1'}
```

#### defaults

第一个参数为目标对象，第二个参数是要填充的对象。只有目标对象的属性不存在时才能填充新的属性（不会覆盖原有属性），返回这个新的对象。

```javascript
var iceCream = {flavor: "chocolate"};
_.defaults(iceCream, {flavor: "vanilla", sprinkles: "lots"}); //{flavor: "chocolate", sprinkles: "lots"}
```

#### clone

给指定的对象创建一个浅拷贝，并返回一个新的对象。

```javascript
_.clone({name: 'moe'}); //{name: 'moe'}
```

#### tap

用 object作为参数来调用函数interceptor，然后返回object

#### has

检查对象是否包含指定的key，等同于`object.hasOwnProperty(key)`

```javascript
_.has({a: 1, b: 2, c: 3}, "b"); //true
```

#### property

```javascript
var stooge = {name: 'moe'};
var func = _.property('name');
func(stooge);   //'moe'
```


