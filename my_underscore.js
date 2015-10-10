(function () {
    // 创建root对象，在浏览器中指向的是`window`对象
    var root = this;

    // 声明变量保存前缀`_`
    var previousUnderscore = root._;

    // 保存原型对象的引用
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

    // 创建快速的核心原型方法的引用
    var
        push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    // 声明**ECMAScript 5**我们能够使用到的一些本地函数的引用
    var
        nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = FuncProto.bind,
        nativeCreate = Object.create;

    var Ctor = function () {};

    // 创建一个安全的underscore对象的引用
    var _ = function (obj) {
        if (obj instanceof _) {
            return obj;
        }

        if (!(this instanceof _)) {
            return new _(obj);
        }

        this._wrapped = obj;
    };

    // 如果浏览器下添加`_`作为全局对象
    if (typeof exports !== 'undefined') {

    } else {
        root._ = _;
    }

    // 当前版本号
    _.VERSION = '1.8.3';

    var optimizeCb = function (func, context, argCount) {
        if (context === void 0) {
            return func;
        }
    };

    // 在内部经常使用的一个函数，产生一个回调函数用来迭代集合中每一个元素
    var cb = function (value, context, argCount) {
        if (value == null) {
            return _.identity;
        }
        if (_.isFunction(value)) {
            return optimizeCb(value, context, argCount);
        }
    };

    // 赋值函数
    var createAssigner = function (keysFunc, undefinedOnly) {
        // obj是要被赋值的对象，从第二个参数开始为js对象
        return function (obj) {
            var length = arguments.length;
            if (length < 2 || obj == null) {
                return obj;
            }
            // 从第二个参数遍历，每个参数是一个js对象
            for (var index = 1; index < length; index++) {
                var source = arguments[index],  //js对象
                    keys = keysFunc(source),
                    l = keys.length;
                // 遍历keys
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (!undefinedOnly || obj[key] === void 0) {
                        obj[key] = source[key]; //给obj赋值
                    }
                }
            }
            return obj;//返回赋值后的对象
        };
    };

    var property = function (key) {
        return function (obj) {
            return obj == null ? void 0 : obj[key];
        };
    };

    // 定义collection的辅助方法
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = property('length');
    var isArrayLike = function (collection) {
        var length = getLength(collection);
        return typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    // Collection Functions
    // 遍历集合
    _.each = _.forEach = function (obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        var i, length;
        if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                iteratee(obj[i], i, obj);
            }
        } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                iteratee(obj[keys[i]], keys[i], obj);
            }
        }
        return obj;
    };

    // 映射集合元素，返回一个新的数组
    _.map = _.collect = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length);

        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    // 创建一个reduce方法，从左或从右迭代
    function createReduce(dir) {
        // 迭代器
        function iterator(obj, iteratee, memo, keys, index, length) {
            for (; index >= 0 && index < length; index += dir) {
                var currentKey = keys ? keys[index] : index;
                // 把上一次的结果保存到memo中，再通过参数传过去
                memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
            return memo;
        }

        return function (obj, iteratee, memo, context) {
            iteratee = optimizeCb(iteratee, context, 4);
            var keys = !isArrayLike(obj) && _.keys(obj),
                length = (keys || obj).length,
                index = dir > 0 ? 0 : length - 1;//正向：index=0；逆向：index=集合长度-1

            // 不传第三个参数memo
            if (arguments.length < 3) {
                // 数组，memo取数组索引为index的值
                // 对象，memo取key对应的值
                memo = obj[keys ? keys[index] : index];
                index += dir;
            }

            return iterator(obj, iteratee, memo, keys, index, length);
        };
    }

    // 返回集合中所有值的一个单一结果
    _.reduce = _.foldl = _.inject = createReduce(1);

    // reduce从右开始迭代的版本
    _.reduceRight = _.foldr = createReduce(-1);

    // 返回集合中的元素在断言表达式返回true的第一个值
    _.find = _.detect = function (obj, predicate, context) {
        var key;
        if (isArrayLike(obj)) {
            // 数组，返回索引
            key = _.findIndex(obj, predicate, context);
        } else {
            // 对象，返回key
            key = _.findKey(obj, predicate, context);
        }
        if (key !== void 0 && key !== -1) {
            // 数组返回索引对应的value，对象返回key对应的value
            return obj[key];
        }
    };

    // 返回断言表达式中为true的所有值组成的数组
    _.filter = _.select = function (obj, predicate, context) {
        var results = [];
        predicate = cb(predicate, context);
        _.each(obj, function (value, index, list) {
            if (predicate(value, index, list)) {
                results.push(value);
            }
        });
        return results;
    };

    // 返回断言表达式中为false的所有值组成的数组
    _.reject = function (obj, predicate, context) {
        return _.filter(obj, _.negate(cb(predicate)), context);
    };

    // 检测是否所有元素都通过断言为true的测试
    _.every = _.all = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (!predicate(obj[currentKey], currentKey, obj)) {
                return false;
            }
        }
        return true;
    };

    // 检测至少有一个元素通过断言为true的测试
    _.some = _.any = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (predicate(obj[currentKey], currentKey, obj)) {
                return true;
            }
        }
        return false;
    };

    // 检查数值或对象中是否包含指定的值
    _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
        if (!isArrayLike(obj)) {
            obj = _.values(obj);
        }
        if (typeof fromIndex !== 'number' || guard) {
            fromIndex = 0;
        }
        return _.indexOf(obj, item, fromIndex) >= 0;
    };

    // 对集合中的每个元素调用指定的方法
    _.invoke = function (obj, method) {
        var args = slice.call(arguments, 2);//获取method参数
        var isFunc = _.isFunction(method);
        return _.map(obj, function (value) {
            var func = isFunc ? method : value[method];
            return func == null ? func : func.apply(value, args);
        });
    };

    // 通过map来集合中的获取指定的属性值
    _.pluck = function (obj, key) {
        return _.map(obj, _.property(key));
    };

    // 返回包含有指定键值对的对象组成的数组，内部调用filter方法，本质上就是一个过滤函数
    _.where = function (obj, attrs) {
        return _.filter(obj, _.matcher(attrs));
    };

    // 返回第一个包含指定键值对的对象
    _.findWhere = function (obj, attrs) {
        return _.find(obj, _.matcher(attrs));
    };

    // 返回最大的元素
    _.max = function (obj, iteratee, context) {
        var result = -Infinity, lastComputed = -Infinity,
            value, computed;
        if (iteratee == null && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value > result) {
                    result = value;
                }
            }
        } else {
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index, list) {
                computed = iteratee(value, index, list);
                if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
                    result = value;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };

    // 返回最小的元素
    _.min = function (obj, iteratee, context) {
        var result = Infinity, lastComputed = Infinity,
            value, computed;
        if (iteratee == null && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value < result) {
                    result = value;
                }
            }
        } else {
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index, list) {
                computed = iteratee(value, index, list);
                if (computed < lastComputed || computed === Infinity && result === Infinity) {
                    result = value;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };

    // 打乱数组中的元素
    _.shuffle = function (obj) {
        var set = isArrayLike(obj) ? obj : _.values(obj);
        var length = set.length;
        var shuffled = Array(length);
        for (var index = 0, rand; index < length; index++) {
            rand = _.random(0, index);
            if (rand !== index) {
                shuffled[index] = shuffled[rand];
            }
            shuffled[rand] = set[index];
        }
        return shuffled;
    };
    // Array Functions

    // 用来创建findIndex和findLastIndex的方法
    function createPredicateIndexFinder(dir) {
        return function (array, predicate, context) {
            predicate = cb(predicate, context);
            var length = getLength(array);
            var index = dir > 0 ? 0 : length - 1;
            for (; index >= 0 && index < length; index += dir) {
                // 如果断言表达式返回true，返回当前值的索引
                if (predicate(array[index], index, array)) {
                    return index;
                }
            }
        };
    }

    // 返回数组的第一个满足条件（断言表达式中返回为true）的值的索引
    _.findIndex = createPredicateIndexFinder(1);
    _.findLastIndex = createPredicateIndexFinder(-1);

    // 返回一个索引，指示这个值应该被插入在数值的哪个位置
    _.sortedIndex = function (array, obj, iteratee, context) {
        iteratee = cb(iteratee, context, 1);
        var value = iteratee(obj);
        var low = 0, high = getLength(array);
        while (low < high) {
            var mid = Math.floor((low + high) / 2);
            if (iteratee(array[mid]) < value) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    };

    // 用来创建indexOf和lastIndexOf方法
    function createIndexFinder(dir, predicateFind, sortedIndex) {
        return function (array, item, idx) {
            var i = 0, length = getLength(array);
            if (typeof idx === 'number') {
                if (dir > 0) {
                    i = idx >= 0 ? idx : Math.max(idx + length, i);
                } else {
                    length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
                }
            } else if (sortedIndex && idx && length) {
            }

            if (item !== item) {
            }

            for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
                if (array[idx] === item) {
                    return idx;
                }
            }
            return -1;
        };
    }

    // 返回元素在数组中的第一个索引位置，找不到元素返回-1
    _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
    _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);


    // Function (ahem) Functions

    // 返回函数的否定版本
    _.negate = function (predicate) {
        return function () {
            return !predicate.apply(this, arguments);
        };
    };

    // Object Functions

    // 检索对象的属性名，返回一个数组，**ECMAScript 5**使用本地方法`Object.keys`返回
    _.keys = function (obj) {
        if (!_.isObject(obj)) {
            return [];
        }
        if (nativeKeys) {
            return nativeKeys(obj);
        }
        var keys = [];
        for (var key in obj) {
            if (_.has(obj, key)) {
                keys.push(key);
            }
        }
        return keys;
    };

    // 返回对象的所有属性名
    _.allKeys = function (obj) {
        if (!_.isObject(obj)) {
            return [];
        }
        var keys = [];
        for (var key in obj) {
            keys.push(key);
        }
        return keys;
    };

    // 返回对象所有属性值组成的数组
    _.values = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    };

    // 给一个对象扩展指定对象上的所有属性
    _.extend = createAssigner(_.allKeys);

    // 给一个对象扩展指定对象上的自有属性
    _.extendOwn = _.assign = createAssigner(_.keys);

    // 返回对象的第一个满足条件（断言表达式中返回为true）的值的key
    _.findKey = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = _.keys(obj), key;
        for (var i = 0, length = keys.length; i < length; i++) {
            key = keys[i];
            // 如果断言表达式返回true，返回当前值的key
            if (predicate(obj[key], key, obj)) {
                return key;
            }
        }
    };

    // 检查对象是否含有指定的键值对
    _.isMatch = function (object, attrs) {
        var keys = _.keys(attrs), length = keys.length;
        if (object == null) {
            return !length;
        }
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            if (attrs[key] !== obj[key] || !(key in obj)) {
                return false;
            }
        }
        return true;
    };

    // 检查给定的值是否是对象
    _.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    // 检查对象是否是函数类型
    _.isFunction = function (obj) {
        return typeof obj == 'function' || false;
    };

    // 检查对象是否有指定的给定的直接属性
    _.has = function (obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    };

    // Utility Functions

    // 返回一个与传入相等的值
    _.identity = function (value) {
        return value;
    };

    _.property = property;

    // 返回一个断言函数，检查给定的对象中是否包含指定的键值对(attrs)
    _.matcher = _.matches = function (attrs) {
        attrs = _.extendOwn({}, attrs);
        // 参数obj是要检查的js对象
        return function (obj) {
            return _.isMatch(obj, attrs);//内部调用isMatch方法
        };
    };

    // 返回介于最大值和最小值之间的一个整数
    _.random = function (min, max) {
        // 只传一个数作为最大值，取0到这个数之间的随机数
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

}.call(this));
