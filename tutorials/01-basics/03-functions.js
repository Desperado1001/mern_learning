/**
 * JavaScript函数特性 - 函数式编程思维
 * 重点：函数是一等公民、高阶函数、箭头函数、this绑定
 */

console.log('=== JavaScript函数特性 ===\n');

// 1. 函数是一等公民 (First-class citizens)
console.log('1. 函数是一等公民的体现：');

// 函数可以赋值给变量
const add = function(a, b) {
    return a + b;
};

// 函数可以作为参数传递
function calculate(operation, a, b) {
    return operation(a, b);
}

// 函数可以作为返回值
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

// 函数可以存储在数据结构中
const operations = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b
};

console.log('函数计算结果:', calculate(add, 5, 3));
console.log('创建乘法器:', createMultiplier(2)(10));
console.log('对象中的函数:', operations.multiply(4, 5));

console.log('\n' + '='.repeat(50) + '\n');

// 2. 函数声明的不同方式
console.log('2. 函数声明方式对比：');

// 函数声明 (Function Declaration) - 会被提升
function declaredFunction() {
    return '函数声明';
}

// 函数表达式 (Function Expression) - 不会被提升
const expressionFunction = function() {
    return '函数表达式';
};

// 箭头函数 (Arrow Function) - ES6新增
const arrowFunction = () => '箭头函数';

// 命名函数表达式
const namedExpression = function namedFunc() {
    return '命名函数表达式';
};

console.log('声明函数:', declaredFunction());
console.log('表达式函数:', expressionFunction());
console.log('箭头函数:', arrowFunction());

console.log('\n' + '='.repeat(50) + '\n');

// 3. 箭头函数详解
console.log('3. 箭头函数特性：');

// 语法简化
const numbers = [1, 2, 3, 4, 5];

// 传统函数写法
const doubled1 = numbers.map(function(n) {
    return n * 2;
});

// 箭头函数简化写法
const doubled2 = numbers.map(n => n * 2);
const doubled3 = numbers.map((n) => n * 2);
const doubled4 = numbers.map((n) => {
    return n * 2;
});

console.log('数组映射结果:', doubled2);

// 箭头函数的this绑定差异
const obj = {
    name: '对象',
    
    // 传统函数：this指向调用者
    traditionalMethod: function() {
        console.log('传统函数this:', this.name);
        
        // 嵌套函数中this指向会丢失
        setTimeout(function() {
            console.log('嵌套传统函数this:', this.name); // undefined
        }, 10);
        
        // 箭头函数继承外层this
        setTimeout(() => {
            console.log('嵌套箭头函数this:', this.name); // '对象'
        }, 20);
    },
    
    // 箭头函数：this继承外层作用域
    arrowMethod: () => {
        console.log('箭头函数this:', this.name); // undefined (全局作用域)
    }
};

obj.traditionalMethod();
obj.arrowMethod();

console.log('\n' + '='.repeat(50) + '\n');

// 4. 高阶函数 (Higher-order functions)
console.log('4. 高阶函数应用：');

// 接受函数作为参数的高阶函数
function applyOperation(arr, operation) {
    return arr.map(operation);
}

// 返回函数的高阶函数
function createValidator(rule) {
    return function(value) {
        return rule(value);
    };
}

// 函数组合
function compose(f, g) {
    return function(x) {
        return f(g(x));
    };
}

// 实际应用
const data = [1, 2, 3, 4, 5];
const square = x => x * x;
const addOne = x => x + 1;

console.log('平方操作:', applyOperation(data, square));

const isPositive = createValidator(x => x > 0);
console.log('正数验证:', isPositive(5), isPositive(-3));

const squareThenAddOne = compose(addOne, square);
console.log('函数组合:', squareThenAddOne(3)); // (3^2) + 1 = 10

console.log('\n' + '='.repeat(50) + '\n');

// 5. 函数式编程常用方法
console.log('5. 函数式编程方法：');

const products = [
    { id: 1, name: '笔记本', price: 5000, category: '电子' },
    { id: 2, name: '鼠标', price: 100, category: '电子' },
    { id: 3, name: '书籍', price: 50, category: '图书' },
    { id: 4, name: '键盘', price: 300, category: '电子' }
];

// 链式调用函数式操作
const expensiveElectronics = products
    .filter(product => product.category === '电子')  // 筛选电子产品
    .filter(product => product.price > 200)         // 筛选价格>200
    .map(product => ({                              // 转换数据结构
        name: product.name,
        price: `¥${product.price}`
    }))
    .sort((a, b) => a.name.localeCompare(b.name)); // 按名称排序

console.log('昂贵的电子产品:', expensiveElectronics);

// reduce的强大应用
const totalValue = products.reduce((sum, product) => sum + product.price, 0);
console.log('产品总价值:', totalValue);

// 按类别分组
const groupedByCategory = products.reduce((groups, product) => {
    const category = product.category;
    groups[category] = groups[category] || [];
    groups[category].push(product);
    return groups;
}, {});

console.log('按类别分组:', groupedByCategory);

console.log('\n' + '='.repeat(50) + '\n');

// 6. 柯里化 (Currying)
console.log('6. 柯里化函数：');

// 传统多参数函数
function multiply(a, b, c) {
    return a * b * c;
}

// 柯里化版本
function curriedMultiply(a) {
    return function(b) {
        return function(c) {
            return a * b * c;
        };
    };
}

// 箭头函数柯里化
const curriedMultiplyArrow = a => b => c => a * b * c;

// 通用柯里化函数
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function(...args2) {
                return curried.apply(this, args.concat(args2));
            };
        }
    };
}

console.log('传统调用:', multiply(2, 3, 4));
console.log('柯里化调用:', curriedMultiply(2)(3)(4));
console.log('部分应用:', curriedMultiply(2)(3)); // 返回函数

const curriedAdd = curry((a, b, c) => a + b + c);
const add5 = curriedAdd(5);
console.log('柯里化加法:', add5(3)(2)); // 10

console.log('\n' + '='.repeat(50) + '\n');

// 7. 闭包的实用应用
console.log('7. 闭包的实用应用：');

// 模块模式
const counterModule = (function() {
    let count = 0;
    
    return {
        increment() {
            count++;
            return count;
        },
        decrement() {
            count--;
            return count;
        },
        getCount() {
            return count;
        }
    };
})();

console.log('计数器模块:');
console.log('初始值:', counterModule.getCount());
console.log('递增:', counterModule.increment());
console.log('递增:', counterModule.increment());
console.log('递减:', counterModule.decrement());

// 函数工厂
function createLogger(prefix) {
    return function(message) {
        console.log(`[${prefix}] ${message}`);
    };
}

const errorLogger = createLogger('ERROR');
const infoLogger = createLogger('INFO');

errorLogger('这是一个错误信息');
infoLogger('这是一个信息日志');

console.log('\n' + '='.repeat(50) + '\n');

// 8. 与C/C++函数对比总结
setTimeout(() => {
    console.log('8. JavaScript函数 vs C/C++函数：');
    console.log(`
特性对比：
┌─────────────────┬─────────────────┬─────────────────┐
│ 特性            │ C/C++           │ JavaScript      │
├─────────────────┼─────────────────┼─────────────────┤
│ 函数地位        │ 子程序概念      │ 一等公民        │
│ 参数传递        │ 值传递/引用传递 │ 值传递          │
│ 返回值          │ 单一类型        │ 任意类型        │
│ 函数指针        │ 复杂语法        │ 自然支持        │
│ 闭包            │ 不支持          │ 核心特性        │
│ 高阶函数        │ 函数指针实现    │ 原生支持        │
│ this绑定        │ 无此概念        │ 动态绑定        │
│ 重载            │ 支持            │ 不支持(但有技巧)│
└─────────────────┴─────────────────┴─────────────────┘

最佳实践：
• 理解函数式编程范式
• 合理使用箭头函数和传统函数
• 掌握高阶函数的强大功能
• 利用闭包实现数据封装
• 注意this绑定规则
• 使用函数式方法处理数据
`);
}, 100);