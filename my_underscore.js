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

}.call(this));
