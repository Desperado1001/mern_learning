/**
 * JavaScript闭包深入应用 - 高级概念和实践
 * 重点：闭包内存模型、实用模式、性能考量
 */

console.log('=== JavaScript闭包深入应用 ===\n');

// 1. 闭包的内存模型理解
console.log('1. 闭包内存模型：');

function createClosureExample() {
    let largeData = new Array(1000000).fill('data'); // 大量数据
    let smallData = 'important';
    
    // 只引用smallData的闭包
    function getSmallData() {
        return smallData;
    }
    
    // 引用所有数据的闭包
    function getAllData() {
        return { largeData, smallData };
    }
    
    // 返回函数但不引用largeData
    return {
        getSmall: getSmallData,
        // 注意：即使返回getAllData，largeData也会被保持在内存中
        // getAll: getAllData
    };
}

const closureInstance = createClosureExample();
console.log('闭包访问数据:', closureInstance.getSmall());

// 演示闭包的数据独立性
function createCounter(initialValue = 0) {
    let count = initialValue;
    let history = [];
    
    return {
        increment(step = 1) {
            count += step;
            history.push(`+${step}`);
            return count;
        },
        
        decrement(step = 1) {
            count -= step;
            history.push(`-${step}`);
            return count;
        },
        
        getValue() {
            return count;
        },
        
        getHistory() {
            return [...history]; // 返回副本，防止外部修改
        },
        
        reset() {
            count = initialValue;
            history = [];
            return count;
        }
    };
}

const counter1 = createCounter(10);
const counter2 = createCounter(100);

console.log('计数器1操作:', counter1.increment(5));
console.log('计数器2操作:', counter2.decrement(20));
console.log('计数器1历史:', counter1.getHistory());
console.log('计数器2历史:', counter2.getHistory());

console.log('\n' + '='.repeat(50) + '\n');

// 2. 闭包实现设计模式
console.log('2. 闭包设计模式：');

// 单例模式
const DatabaseConnection = (function() {
    let instance = null;
    let isConnected = false;
    
    function createConnection() {
        return {
            connect() {
                if (!isConnected) {
                    isConnected = true;
                    console.log('数据库连接已建立');
                } else {
                    console.log('数据库已连接');
                }
                return this;
            },
            
            disconnect() {
                if (isConnected) {
                    isConnected = false;
                    console.log('数据库连接已断开');
                } else {
                    console.log('数据库未连接');
                }
                return this;
            },
            
            query(sql) {
                if (isConnected) {
                    console.log(`执行查询: ${sql}`);
                    return `查询结果: ${sql}`;
                } else {
                    throw new Error('数据库未连接');
                }
            },
            
            getStatus() {
                return isConnected ? '已连接' : '未连接';
            }
        };
    }
    
    return {
        getInstance() {
            if (instance === null) {
                instance = createConnection();
            }
            return instance;
        }
    };
})();

// 使用单例
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();

console.log('单例测试:', db1 === db2); // true
db1.connect().query('SELECT * FROM users');
console.log('数据库状态:', db2.getStatus());

// 观察者模式
function createEventEmitter() {
    const events = {};
    
    return {
        on(event, callback) {
            if (!events[event]) {
                events[event] = [];
            }
            events[event].push(callback);
            return this;
        },
        
        off(event, callback) {
            if (events[event]) {
                events[event] = events[event].filter(cb => cb !== callback);
            }
            return this;
        },
        
        emit(event, ...args) {
            if (events[event]) {
                events[event].forEach(callback => {
                    try {
                        callback(...args);
                    } catch (error) {
                        console.error('事件处理错误:', error);
                    }
                });
            }
            return this;
        },
        
        listEvents() {
            return Object.keys(events);
        },
        
        getListenerCount(event) {
            return events[event] ? events[event].length : 0;
        }
    };
}

const eventEmitter = createEventEmitter();

// 事件监听器
const userLoginHandler = (username) => {
    console.log(`用户 ${username} 已登录`);
};

const loginLogHandler = (username) => {
    console.log(`[LOG] 登录事件: ${username} at ${new Date().toISOString()}`);
};

eventEmitter
    .on('user:login', userLoginHandler)
    .on('user:login', loginLogHandler)
    .on('user:logout', (username) => {
        console.log(`用户 ${username} 已退出`);
    });

console.log('触发登录事件:');
eventEmitter.emit('user:login', 'Alice');

console.log('\n' + '='.repeat(50) + '\n');

// 3. 函数式编程中的闭包
console.log('3. 函数式编程应用：');

// 记忆化（Memoization）
function memoize(fn) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            console.log(`缓存命中: ${key}`);
            return cache.get(key);
        }
        
        console.log(`计算结果: ${key}`);
        const result = fn.apply(this, args);
        cache.set(key, result);
        
        return result;
    };
}

// 斐波那契数列（递归版本）
const fibonacci = memoize(function(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log('斐波那契数列:');
console.log('fib(10):', fibonacci(10));
console.log('fib(10) 再次调用:', fibonacci(10)); // 从缓存获取

// 偏函数应用
function partial(fn, ...presetArgs) {
    return function(...remainingArgs) {
        return fn(...presetArgs, ...remainingArgs);
    };
}

function multiply(a, b, c) {
    return a * b * c;
}

const multiplyBy2 = partial(multiply, 2);
const multiplyBy2And3 = partial(multiply, 2, 3);

console.log('偏函数应用:');
console.log('multiplyBy2(5, 4):', multiplyBy2(5, 4)); // 2 * 5 * 4 = 40
console.log('multiplyBy2And3(6):', multiplyBy2And3(6)); // 2 * 3 * 6 = 36

// 函数组合
function compose(...fns) {
    return function(value) {
        return fns.reduceRight((acc, fn) => fn(acc), value);
    };
}

const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const composedFunction = compose(square, double, addOne);
console.log('函数组合 square(double(addOne(3))):', composedFunction(3)); // (3+1)*2^2 = 64

console.log('\n' + '='.repeat(50) + '\n');

// 4. 闭包与异步编程
console.log('4. 闭包与异步编程：');

// 批处理器
function createBatchProcessor(batchSize, processInterval) {
    let batch = [];
    let timerId = null;
    
    function processBatch() {
        if (batch.length > 0) {
            console.log(`处理批次: [${batch.join(', ')}]`);
            batch = [];
        }
        timerId = null;
    }
    
    return {
        add(item) {
            batch.push(item);
            
            // 达到批次大小立即处理
            if (batch.length >= batchSize) {
                if (timerId) {
                    clearTimeout(timerId);
                    timerId = null;
                }
                processBatch();
            } else if (!timerId) {
                // 设置定时器
                timerId = setTimeout(processBatch, processInterval);
            }
        },
        
        flush() {
            if (timerId) {
                clearTimeout(timerId);
                timerId = null;
            }
            processBatch();
        },
        
        size() {
            return batch.length;
        }
    };
}

const batchProcessor = createBatchProcessor(3, 1000);

// 添加项目到批处理器
console.log('批处理演示:');
batchProcessor.add('任务1');
batchProcessor.add('任务2');

setTimeout(() => {
    batchProcessor.add('任务3'); // 触发批处理
    batchProcessor.add('任务4');
    batchProcessor.add('任务5');
}, 500);

// 防抖和节流
function debounce(fn, delay) {
    let timerId = null;
    
    return function(...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => fn.apply(this, args), delay);
    };
}

function throttle(fn, interval) {
    let lastTime = 0;
    
    return function(...args) {
        const now = Date.now();
        if (now - lastTime >= interval) {
            lastTime = now;
            fn.apply(this, args);
        }
    };
}

const debouncedLog = debounce((message) => {
    console.log('防抖输出:', message);
}, 300);

const throttledLog = throttle((message) => {
    console.log('节流输出:', message);
}, 500);

// 演示防抖和节流
setTimeout(() => {
    console.log('\n防抖和节流演示:');
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            debouncedLog(`防抖消息 ${i}`);
            throttledLog(`节流消息 ${i}`);
        }, i * 100);
    }
}, 1500);

console.log('\n' + '='.repeat(50) + '\n');

// 5. 闭包性能考量和最佳实践
setTimeout(() => {
    console.log('5. 闭包性能和最佳实践：');
    console.log(`
性能考量：
• 闭包会保持对外层作用域的引用，可能导致内存泄漏
• 避免在闭包中保持不必要的大对象引用
• 及时清理事件监听器和定时器
• 使用WeakMap和WeakSet来避免内存泄漏

最佳实践：
• 只在需要时创建闭包
• 明智地选择要保持的变量引用
• 使用模块模式封装私有数据
• 利用闭包实现函数式编程模式
• 注意闭包在循环中的使用陷阱

内存管理：
• 理解JavaScript垃圾回收机制
• 避免循环引用
• 及时解除不需要的引用
• 使用开发工具监控内存使用
`);
}, 3000);