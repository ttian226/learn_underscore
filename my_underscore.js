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
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    // 当前版本号
    _.VERSION = '1.8.3';

    var optimizeCb = function (func, context, argCount) {
        if (context === void 0) {
            return func;
        }
        switch (argCount == null ? 3 : argCount) {
            case 1: return function(value) {
                return func.call(context, value);
            };
            case 2: return function(value, other) {
                return func.call(context, value, other);
            };
            case 3: return function(value, index, collection) {
                return func.call(context, value, index, collection);
            };
            case 4: return function(accumulator, value, index, collection) {
                return func.call(context, accumulator, value, index, collection);
            };
        }
        return function() {
            return func.apply(context, arguments);
        };
    };

    // 在内部经常使用的一个函数，产生一个回调函数用来迭代集合中每一个元素
    var cb = function (value, context, argCount) {
        if (value == null) {
            return _.identity;
        }
        if (_.isFunction(value)) {
            return optimizeCb(value, context, argCount);
        }
        if (_.isObject(value)) {
            return _.matcher(value);
        }
        // 既不是函数又不是对象返回_.property方法
        return _.property(value);
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
                    // 如果不传参数undefinedOnly，则会覆盖已经存在的属性
                    // 如果undefinedOnly=true，如果已经存在则不会覆盖原有属性
                    if (!undefinedOnly || obj[key] === void 0) {
                        obj[key] = source[key]; //给obj赋值
                    }
                }
            }
            return obj;//返回赋值后的对象
        };
    };

    // 创建一个继承其它原型的一个实例
    var baseCreate = function (prototype) {
        if (!_.isObject(prototype)) {
            return {};
        }
        if (nativeCreate) {
            return nativeCreate(prototype);
        }
        Ctor.prototype = prototype;
        var result = new Ctor();
        Ctor.prototype = null;
        return result;
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

    // 随机选取集合中的几个值
    _.sample = function (obj, n, guard) {
        // 只传一个参数，随机返回一个元素
        if (n == null || guard) {
            if (!isArrayLike(obj)) {
                obj = _.values(obj);
            }
            return obj[_.random(obj.length - 1)]
        }
        // 指定个数，返回一个集合
        return _.shuffle(obj).slice(0, Math.max(0, n));
    };

    // 根据iteratee方法的返回值来排序集合中的值
    _.sortBy = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var func = function (value, index, list) {
            return {
                value: value,
                index: index,
                criteria: iteratee(value, index, list)
            };
        };
        // sort()的排序函数
        var compare = function (left, right) {
            var a = left.criteria;
            var b = right.criteria;
            // a,b不同时
            if (a !== b) {
                if (a > b || a === void 0) return 1;
                if (b > a || b === void 0) return -1;
            }
            // a,b相同是比较索引
            return left.index - right.index;
        };
        // _.map(obj, func)返回一个数组，数组中每个元素分别有value,index,criteria三个属性
        // 这个数组调用排序sort()方法，返回一个按照元素中criteria属性结果排序后的数组
        // 调用pluck提取每个元素的value属性返回一个新的数组
        return _.pluck(_.map(obj, func).sort(compare), 'value');
    };

    // 用于处理group by操作的内部方法
    var group = function (behavior) {
        return function (obj, iteratee, context) {
            var result = {};
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index) {
                var key = iteratee(value, index, obj);
                behavior(result, value, key);
            });
            return result;
        };
    };

    // 分组集合
    _.groupBy = group(function (result, value, key) {
        if (_.has(result, key)) {
            result[key].push(value);
        } else {
            result[key] = [value];
        }
    });

    // 按照指定的key分组集合，key需要是唯一的
    _.indexBy = group(function (result, value, key) {
        result[key] = value;
    });

    // 按照数量分组集合
    _.countBy = group(function (result, value, key) {
        if (_.has(result, key)) {
            result[key]++;
        } else {
            result[key] = 1;
        }
    });

    // 把对象转换为数组
    _.toArray = function (obj) {
        if (!obj) {
            return [];
        }
        if (_.isArray(obj)) {
            return slice.call(obj);
        }
        if (isArrayLike(obj)) {
            return _.map(obj, _.identity);
        }
        return _.values(obj);
    };

    // 返回集合中元素的个数
    _.size = function (obj) {
        if (obj == null) {
            return 0;
        }
        return isArrayLike(obj) ? obj.length : _.keys(obj).length;
    };

    // 把集合分割成两个数组，一部分满足断言，一部分不满足断言
    _.partition = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var pass = [], fail = [];
        _.each(obj, function (value, key, obj) {
            (predicate(value, key, obj) ? pass : fail).push(value);
        });
        return [pass, fail];
    };

    // Array Functions

    // 返回数组的第一个元素或前面几个元素组成的数组
    _.first = _.head = _.take = function (array, n, guard) {
        if (array == null) {
            return void 0;
        }
        if (n == null || guard) {
            return array[0];
        }
        return _.initial(array, array.length - n);
    };

    // 返回数组中除了最后指定个数以外的所有元素组成的数组
    _.initial = function (array, n, guard) {
        var max = array.length - (n == null || guard ? 1 : n);
        return slice.call(array, 0, Math.max(0, max));
    };

    // 返回数组的最后一个元素或最后面几个元素组成的数组
    _.last = function (array, n, guard) {
        if (array == null) {
            return void 0;
        }
        if (n == null || guard) {
            return array[array.length - 1];
        }
        return _.rest(array, Math.max(0, array.length - n));
    };

    // 返回数组中除了最前面指定个数以外的所有元素组成的数组
    _.rest = _.tail = _.drop = function (array, n, guard) {
        return slice.call(array, n == null ? 1 : n);
    };

    // 从数组中去除所有的false值
    _.compact = function (array) {
        return _.filter(array, _.identity);
    };

    // flatten使用的内部函数
    var flatten = function (input, shallow, strict, startIndex) {
        var output = [], idx = 0;
        for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
            var value = input[i];
            if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
                if (!shallow) {
                    value = flatten(value, shallow, strict);
                }
                var j = 0, len = value.length;
                output.length += len;
                while (j < len) {
                    output[idx++] = value[j++];
                }
            } else {
                output[idx++] = value;
            }
        }
        return output;
    };

    // 把多层嵌套的数值转化为单层数组
    _.flatten = function (array, shallow) {
        return flatten(array, shallow, false);
    };

    // 返回不包括指定元素的数组
    _.without = function (array) {
        return _.difference(array, slice.call(arguments, 1))
    };

    // 返回一个数组，数组中的元素是唯一的。
    _.uniq = _.unique = function (array, isSorted, iteratee, context) {
        // 参数是array,iteratee,context的情况
        if (!_.isBoolean(isSorted)) {
            context = iteratee;
            iteratee = isSorted;
            isSorted = false;
        }
        if (iteratee != null) {
            iteratee = cb(iteratee, context);
        }
        var result = [];
        var seen = [];
        for (var i = 0, length = getLength(array); i < length; i++) {
            var value = array[i],
                computed = iteratee ? iteratee(value, i, array) : value;
            if (isSorted) {
                // 传两个参数的情况array, isSorted
                if (!i || seen !== computed) {
                    result.push(value);
                }
                seen = computed;
            } else if (iteratee) {
                // 参数array, iteratee, context
                if (!_.contains(seen, computed)) {
                    seen.push(computed);
                    result.push(value);
                }
            } else if (!_.contains(result, value)) {
                // 只传一个参数array的情况
                result.push(value);
            }
        }
        return result;
    };

    // 把一个或多个数组合并成一个数组，数组中去除相同的元素
    _.union = function () {
        return _.uniq(flatten(arguments, true, true));
    };

    // 返回多个数组中都存在的值组成的数值
    _.intersection = function (array) {
        var result = [];
        var argsLength = arguments.length;
        for (var i = 0, length = getLength(array); i < length; i++) {
            var item = array[i];
            if (_.contains(result, item)) {
                continue;
            }
            for (var j = 1; j < argsLength; j++) {
                if (!_.contains(arguments[j], item)) {
                    break;
                }
            }
            if (j === argsLength) {
                result.push(item);
            }
        }
        return result;
    };

    // 返回只在第一个数组中存在的元素组成的数组
    _.difference = function (array) {
        // rest为获取传入的第二个数组
        var rest = flatten(arguments, true, true, 1);
        // 遍历第一个数组array的每个值
        return _.filter(array, function (value) {
            return !_.contains(rest, value);
        });
    };

    // 合并数组，把不同数组中相同位置的元素合并到一个数组中（参数是多个数组）
    _.zip = function () {
        return _.unzip(arguments);
    };

    // _.zip的逆向操作（参数是一个二维数组）
    _.unzip = function (array) {
        var length = array && _.max(array, getLength).length || 0;
        var result = Array(length);
        for (var index = 0; index < length; index++) {
            result[index] = _.pluck(array, index);
        }
        return result;
    };

    // 把多个数组转化为js对象
    _.object = function (list, values) {
        var result = {};
        for (var i = 0, length = getLength(list); i < length; i++) {
            if (values) {
                result[list[i]] = values[i];
            } else {
                result[list[i][0]] = list[i][1];
            }
        }
        return result;
    };

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
                // 对于排序数组，第三个参数可以传true
                idx = sortedIndex(array, item);
                return array[idx] === item ? idx : -1;
            }

            // item = NaN
            if (item !== item) {
                idx = predicateFind(slice.call(array, i, length), _.isNaN);
                return idx >= 0 ? idx + i : -1;
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

    // 根据start,stop,step创建一个整型元素的数组
    _.range = function (start, stop, step) {
        if (stop == null) {
            stop = start || 0;
            start = 0;
        }
        step = step || 1;
        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var range = Array(length);
        for (var idx = 0; idx < length; idx++, start += step) {
            range[idx] = start;
        }
        return range;
    };

    // Function (ahem) Functions
    // 决定是否作为一个构造函数被调用，或者是作为一个普通函数调用
    var executeBound = function (sourceFunc, boundFunc, context, callingContext, args) {
        // 作为普通函数
        if (!(callingContext instanceof boundFunc)) {
            return sourceFunc.apply(context, args);
        }
        // 作为构造函数
        var self = baseCreate(sourceFunc.prototype);
        var result = sourceFunc.apply(self, args);
        if (!_.isObject(result)) {
            return result;
        }
        return self;
    };

    // 创建了一个被绑定了指定对象的函数
    _.bind = function (func, context) {
        if (nativeBind && func.bind === nativeBind) {
            return nativeBind.apply(func, slice.call(arguments, 1));
        }
        if (!_.isFunction(func)) {
            throw new TypeError('Bind must be called on a function');
        }
        // 获取func的参数
        var args = slice.call(arguments, 2);
        var bound = function () {
            // 如果_.bind返回的函数作为构造函数时，this是bound的实例(this instanceof bound === true)
            return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
        };
        return bound;
    };

    // 填充部分参数返回一个函数
    _.partial = function (func) {
        var boundArgs = slice.call(arguments, 1);
        var bound = function () {
            var position = 0, length = boundArgs.length;
            var args = Array(length);
            for (var i = 0; i < length; i++) {
                args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
            }
            while (position < arguments.length) {
                args.push(arguments[position++]);
            }
            return executeBound(func, bound, this, this, args);
        };
        return bound;
    };

    // 把一些方法绑定到指定的对象上
    _.bindAll = function (obj) {
        var i, length = arguments.length, key;
        if (length <= 1) {
            throw new Error('bindAll must be passed function names');
        }
        for (var i = 1; i < length; i++) {
            key = arguments[i];
            // 改变之前的obj
            obj[key] = _.bind(obj[key], obj);
        }
        return obj;
    };

    // 缓存开销高的函数结果
    _.memoize = function (func, hasher) {
        var memoize = function (key) {
            var cache = memoize.cache;
            var address = '' + (hasher ? hasher.apply(this, arguments) : key);
            if (!_.has(cache, address)) {
                cache[address] = func.apply(this, arguments);
            }
            return cache[address];
        };
        memoize.cache = {};
        return memoize;
    };

    // 延迟执行函数
    _.delay = function (func, wait) {
        var args = slice.call(arguments, 2);
        return setTimeout(function () {
            return func.apply(null, args);
        }, wait);
    };

    // 延迟调用函数直到当前调用栈清空为止
    _.defer = _.partial(_.delay, _, 1);

    _.wrap = function (func, wrapper) {
        return _.partial(wrapper, func);
    };

    // 返回函数的否定版本
    _.negate = function (predicate) {
        return function () {
            return !predicate.apply(this, arguments);
        };
    };

    // 返回一个组合了多个函数的复合函数
    _.compose = function () {
        var args = arguments;
        // 最后一个参数的索引
        var start = args.length - 1;
        return function () {
            // 先调用最后一个函数，返回值为result
            var i = start;
            var result = args[start].apply(this, arguments);
            // 每次把返回值result传递给前一个函数调用
            while (i--) {
                result = args[i].call(this, result);
            }
            return result;
        };
    };

    // 返回一个函数在被调用第N次时执行
    _.after = function (times, func) {
        return function () {
            if (--times < 1) {
                return func.apply(this, arguments);
            }
        };
    };

    // 返回一个函数只能被执行N-1次
    _.before = function (times, func) {
        var memo;
        return function () {
            if (--times > 0) {
                memo = func.apply(this, arguments);
            }
            if (times <= 1) {
                func = null;
            }
            return memo;
        };
    };

    // 返回一个函数只能被执行一次（无论被调用多少次），通常用来初始化
    _.once = _.partial(_.before, 2);

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

    // 映射对象
    _.mapObject = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = _.keys(obj),
            length = keys.length,
            results = {},
            currentKey;

        for (var index = 0; index < length; index++) {
            currentKey = keys[index];
            results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    // 把对象转换为[key, value]列表
    _.pairs = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = Array(length);
        for (var i = 0; i < length; i++) {
            pairs[i] = [keys[i], obj[keys[i]]];
        }
        return pairs;
    };

    // 对象的键值互相对调
    _.invert = function (obj) {
        var keys = _.keys(obj);
        var result = {};
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    };

    // 返回对象里的所有方法名
    _.functions = _.methods = function (obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) {
                names.push(key);
            }
        }
        return names.sort();
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

    // 返回一个对象的拷贝，只包括白名单属性
    _.pick = function (object, oiteratee, context) {
        var result = {},
            obj = object,
            iteratee, keys;
        if (obj == null) {
            return result;
        }
        if (_.isFunction(oiteratee)) {
            // 第二个参数为函数
            keys = _.allKeys(obj);
            iteratee = optimizeCb(oiteratee, context);
        } else {
            // 从第二个参数开始是要筛选的属性
            keys = flatten(arguments, false, false, 1);
            iteratee = function (value, key, obj) {
                return key in obj;
            };
            obj = Object(obj);
        }
        for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i];
            var value = obj[key];
            if (iteratee(value, key, obj)) {
                result[key] = value;
            }
        }
        return result;
    };

    // 返回一个对象的拷贝，不包括黑名单属性
    _.omit = function (obj, iteratee, context) {
        if (_.isFunction(iteratee)) {
            iteratee = _.negate(iteratee);
        } else {
            var keys = _.map(flatten(arguments, false, false, 1), String);
            iteratee = function (value, key) {
                return !_.contains(keys, key);
            };
        }
        return _.pick(obj, iteratee, context);
    };

    // 和extend方法的唯一不同就是它不会覆盖已有属性
    _.defaults = createAssigner(_.allKeys, true);

    // 创建具有给定原型的新对象
    _.create = function (prototype, props) {
        var result = baseCreate(prototype);
        if (props) {
            _.extendOwn(result, props);
        }
        return result;
    };

    // 创建一个对象的浅拷贝
    _.clone = function (obj) {
        if (!_.isObject(obj)) {
            return obj;
        }
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };

    // 对obj对象调用函数interceptor，并返回这个对象
    _.tap = function (obj, interceptor) {
        interceptor(obj);
        return obj;
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

    // 提供给isEqual调用的内部函数
    var eq = function (a, b, aStack, bStack) {
        if (a === b) {
            return a !== 0 || 1 / a === 1 / b;
        }
        // null == undefined，但null !== undefined
        if (a == null || b == null) {
            return a === b;
        }
        if (a instanceof _) {
            a = a._wrapped;
        }
        if (b instanceof _) {
            b = b._wrapped;
        }
        // a,b类型不同返回false
        var className = toString.call(a);
        if (className !== toString.call(b)) {
            return false;
        }
        switch (className) {
            case '[object RegExp]':
            case '[object String]':
                return '' + a === '' + b;
            case '[object Number]':
                // a为NaN时，如果b不为NaN返回false，b为NaN返回true
                if (+a !== +a) {
                    return +b !== +b;
                }
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                return +a === +b;
        }
        var areArrays = className === '[object Array]';
        if (!areArrays) {
            if (typeof a !== 'object' || typeof b !== 'object') {
                return false;
            }
            var aCtor = a.constructor, bCtor = b.constructor;
            if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                _.isFunction(bCtor) && bCtor instanceof bCtor)
                && ('constructor' in a && 'constructor' in b)) {
                return false;
            }
        }
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) {
            if (aStack[length] === a) {
                return bStack[length] === b;
            }
        }
        aStack.push(a);
        bStack.push(b);

        if (areArrays) {
            // 数组
            length = a.length;
            if (length !== b.length) {
                return false;
            }
            // 遍历数组每个元素
            while (length--) {
                // 递归比较
                if (!eq(a[length], b[length], aStack, bStack)) {
                    return false;
                }
            }
        } else {
            // 对象
            var keys = _.keys(a), key;
            length = keys.length;
            if (_.keys(b).length !== length) {
                return false;
            }
            // 遍历对象每个属性
            while (length--) {
                key = keys[length];
                // 递归比较属性的每个属性的值是否相等
                if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) {
                    return false;
                }
            }
        }
        aStack.pop();
        bStack.pop();
        return true;
    };

    // 执行深比较检查两个对象是否相等
    _.isEqual = function (a, b) {
        return eq(a, b);
    };

    // 检查给定的数组，字符串，对象是否为空
    _.isEmpty = function (obj) {
        if (obj == null) {
            return true;
        }
        if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) {
            return obj.length === 0;
        }
        return _.keys(obj).length === 0;
    };

    // 检查对象是否是Dom元素
    _.isElement = function (obj) {
        return !!(obj && obj.nodeType === 1);
    };

    // 检查对象是否是数组
    _.isArray = nativeIsArray || function(obj) {
        return toString.call(obj) === '[object Array]';
    };

    // 检查给定的值是否是对象
    _.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    // 添加isType方法：isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError
    _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function (name) {
        _['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']'
        };
    });

    // IE < 9
    if (!_.isArguments(arguments)) {
        _.isArguments = function (obj) {
            return _.has(obj, 'callee');
        };
    }

    // 检查对象是否是函数类型
    _.isFunction = function (obj) {
        return typeof obj == 'function' || false;
    };

    // 检查对象是否是finite
    _.isFinite = function (obj) {
        return isFinite(obj) && !isNaN(parseFloat(obj));
    };

    // 是否是NaN
    _.isNaN = function (obj) {
        return _.isNumber(obj) && obj !== +obj;
    };

    // 检查是否是布尔值
    _.isBoolean = function (obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };

    // 检查对象是否是null
    _.isNull = function (obj) {
        return obj === null;
    };

    // 检查对象是否是undefined
    _.isUndefined = function (obj) {
        return obj === void 0;
    };

    // 检查对象是否有指定的给定的直接属性
    _.has = function (obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    };

    // Utility Functions

    // 返回underscore对象，释放出`_`变量。
    _.noConflict = function () {
        root._ = previousUnderscore;
        return this;
    };

    // 返回一个与传入相等的值
    _.identity = function (value) {
        return value;
    };

    // 创建一个函数，返回相同的值
    _.constant = function (value) {
        return function () {
            return value;
        };
    };

    _.noop = function () {};

    _.property = property;

    // 返回对象的指定属性值
    _.propertyOf = function (obj) {
        return obj == null ? function () {} : function (key) {
            return obj[key];
        }
    };

    // 返回一个断言函数，检查给定的对象中是否包含指定的键值对(attrs)
    _.matcher = _.matches = function (attrs) {
        attrs = _.extendOwn({}, attrs);
        // 参数obj是要检查的js对象
        return function (obj) {
            return _.isMatch(obj, attrs);//内部调用isMatch方法
        };
    };

    // 执行指定函数n次
    _.times = function (n, iteratee, context) {
        var accum = Array(Math.max(0, n));
        iteratee = optimizeCb(iteratee, context, 1);
        for (var i = 0; i < n; i++) {
            accum[i] = iteratee(i);
        }
        return accum;
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

    // 返回一个当前时间的一个整型的时间戳
    _.now = Date.now || function() {
        return new Date().getTime();
    };

    // 要转义的字符列表
    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    };

    var unescapeMap = _.invert(escapeMap);

    // 转义方法
    var createEscaper = function (map) {
        var escaper = function (match) {
            return map[match];
        };

        var source = '(?:' + _.keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function (string) {
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    };

    _.escape = createEscaper(escapeMap);
    _.unescape = createEscaper(unescapeMap);

    // 如果property是函数则调用它，否则返回这个属性值。如果属性不存在，返回fallback
    _.result = function (object, property, fallback) {
        var value = object == null ? void 0 : object[property];
        if (value === void 0) {
            value = fallback;
        }
        return _.isFunction(value) ? value.call(object) : value;
    };

    // 产生全局唯一的id
    var idCounter = 0;
    _.uniqueId = function (prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    _.templateSettings = {
        evaluate    : /<%([\s\S]+?)%>/g,
        interpolate : /<%=([\s\S]+?)%>/g,
        escape      : /<%-([\s\S]+?)%>/g
    };

    var noMatch = /(.)^/;

    // 对指定的字符做转义处理，比如'\n'会被替换为'\\n'
    var escapes = {
        "'":      "'",
        '\\':     '\\',
        '\r':     'r',
        '\n':     'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

    var escapeChar = function(match) {
        return '\\' + escapes[match];
    };

    // 模板方法
    _.template = function (text, settings, oldSettings) {
        if (!settings && oldSettings) {
            settings = oldSettings;
        }
        settings = _.defaults({}, settings, _.templateSettings);

        // 拼装正则表达式
        var matarr = [
            (settings.escape || noMatch).source,
            (settings.interpolate || noMatch).source,
            (settings.evaluate || noMatch).source
        ];
        // 正则表达式：/<%-([\s\S]+?)%>|<%=([\s\S]+?)%>|<%([\s\S]+?)%>|$/g
        var matcher = RegExp(matarr.join('|') + '|$', 'g');

        var index = 0;
        var source = "__p+='";

        // 遍历每个匹配的字符串，拼装source
        text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset).replace(escaper, escapeChar);
            index = offset + match.length;
            if (escape) {
                // 匹配<%- %>使用_.escape进行转义
                source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            } else if (interpolate) {
                // 匹配<%= %>，按原样输出
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            } else if (evaluate) {
                // 匹配<% %>，支持模板中使用js
                source += "';\n" + evaluate + "\n__p+='";
            }
            return match;
        });

        // 继续拼装source
        source += "';\n";

        if (!settings.variable) {
            source = 'with(obj||{}){\n' + source + '}\n';
        }

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + 'return __p;\n';

        try {
            // 使用Function构造函数创建函数render，接受两个参数
            var render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
            e.source = source;
            throw  e;
        }

        // 定义要返回的模板函数
        var template = function (data) {
            // 传递两个参数data,和_
            return render.call(this, data, _);
        };

        // 定义source属性
        var argument = settings.variable || 'obj';
        template.source = 'function(' + argument + '){\n' + source + '}';

        return template;
    };

    _.chain = function (obj) {
        var instance = _(obj);
        instance._chain = true;
        return instance;
    };

    // OOP
    var result = function(instance, obj) {
        return instance._chain ? _(obj).chain() : obj;
    };

    _.mixin = function (obj) {
        _.each(_.functions(obj), function (name) {
            // 给`_`添加属性
            var func = _[name] = obj[name];
            // 给`_`的原型对象添加属性（定义实例方法）
            _.prototype[name] = function () {
                var args = [this._wrapped];
                // 合并参数
                push.apply(args, arguments);
                return result(this, func.apply(_, args));
            };
        });
    };

    // 添加所有的underscore方法到外层对象上（给_()实例添加所有的方法）
    _.mixin(_);

    // 添加部分原生数组方法到外层对象上
    _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name === 'shift' || name === 'splice') && obj.length === 0) {
                delete obj[0];
            }
            // 返回变化后的obj
            return result(this, obj);
        };
    });

    // 添加部分原生数组方法到外层对象上
    _.each(['concat', 'join', 'slice'], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            // 返回原生方法返回的结果
            return result(this, method.apply(this._wrapped, arguments));
        };
    });

    // 原型方法，获取underscore对象的值
    _.prototype.value = function () {
        return this._wrapped;
    };

    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

    _.prototype.toString = function () {
        return '' + this._wrapped;
    };

    if (typeof define === 'function' && define.amd) {
        define('underscore', [], function() {
            return _;
        });
    }

}.call(this));
