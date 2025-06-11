/**
 * JavaScript变量作用域和提升 - 与C/C++作用域对比
 * 重点：var/let/const差异、作用域链、变量提升
 */

console.log('=== JavaScript作用域机制对比 ===\n');

// 1. var vs let vs const 对比
console.log('1. var/let/const 声明对比：');

function scopeComparison() {
    // var: 函数作用域，存在变量提升
    console.log('var声明前访问:', typeof varVariable); // undefined (不是ReferenceError)
    var varVariable = 'var value';
    
    // let: 块级作用域，暂时性死区
    // console.log('let声明前访问:', letVariable); // ReferenceError
    let letVariable = 'let value';
    
    // const: 块级作用域，必须初始化，不可重新赋值
    const constVariable = 'const value';
    
    console.log('函数内部访问:');
    console.log('varVariable:', varVariable);
    console.log('letVariable:', letVariable);
    console.log('constVariable:', constVariable);
}

scopeComparison();

console.log('\n' + '='.repeat(50) + '\n');

// 2. 块级作用域对比 (C/C++有块级作用域)
console.log('2. 块级作用域对比：');

function blockScopeDemo() {
    console.log('=== C/C++风格的块级作用域 ===');
    
    // JavaScript中只有let和const有块级作用域
    for (let i = 0; i < 3; i++) {
        let blockScoped = `块内变量 ${i}`;
        var functionScoped = `函数变量 ${i}`;
        
        // 这里两个变量都可以访问
        console.log(`循环内 - blockScoped: ${blockScoped}, functionScoped: ${functionScoped}`);
    }
    
    // i 在这里不可访问 (let声明)
    // console.log('循环外访问 i:', i); // ReferenceError
    
    // functionScoped 在这里可以访问 (var声明)
    console.log('循环外访问 functionScoped:', functionScoped); // "函数变量 2"
    
    // blockScoped 在这里不可访问
    // console.log('循环外访问 blockScoped:', blockScoped); // ReferenceError
}

blockScopeDemo();

console.log('\n' + '='.repeat(50) + '\n');

// 3. 变量提升机制 (C/C++没有此概念)
console.log('3. 变量提升机制：');

function hoistingDemo() {
    console.log('=== 变量提升演示 ===');
    
    // 函数声明会被完全提升
    hoistedFunction(); // 可以在声明前调用
    
    function hoistedFunction() {
        console.log('这是被提升的函数声明');
    }
    
    // var变量声明会被提升，但赋值不会
    console.log('提升的var变量:', hoistedVar); // undefined
    var hoistedVar = '现在有值了';
    console.log('赋值后的var变量:', hoistedVar);
    
    // let和const有暂时性死区，不能在声明前访问
    try {
        console.log('尝试访问let变量:', hoistedLet);
    } catch (e) {
        console.log('let变量访问错误:', e.message);
    }
    let hoistedLet = 'let变量';
    
    // 函数表达式不会被提升
    try {
        notHoistedFunction();
    } catch (e) {
        console.log('函数表达式调用错误:', e.message);
    }
    var notHoistedFunction = function() {
        console.log('这是函数表达式');
    };
}

hoistingDemo();

console.log('\n' + '='.repeat(50) + '\n');

// 4. 作用域链机制
console.log('4. 作用域链机制：');

let globalVar = '全局变量';

function outerFunction(outerParam) {
    let outerVar = '外层函数变量';
    
    function innerFunction(innerParam) {
        let innerVar = '内层函数变量';
        
        // 作用域链查找顺序：内层 -> 外层 -> 全局
        console.log('内层变量:', innerVar);      // 当前作用域
        console.log('内层参数:', innerParam);    // 当前作用域
        console.log('外层变量:', outerVar);      // 上层作用域
        console.log('外层参数:', outerParam);    // 上层作用域
        console.log('全局变量:', globalVar);     // 全局作用域
        
        // 变量遮盖（shadowing）
        let globalVar = '局部遮盖全局变量';
        console.log('遮盖后的变量:', globalVar);
    }
    
    return innerFunction;
}

const inner = outerFunction('外层参数值');
inner('内层参数值');

console.log('\n' + '='.repeat(50) + '\n');

// 5. 闭包机制 (C/C++没有类似概念)
console.log('5. 闭包机制：');

function closureDemo() {
    let counter = 0;
    
    // 返回一个函数，该函数可以访问外层函数的变量
    return function() {
        counter++;
        console.log('计数器值:', counter);
        return counter;
    };
}

const incrementCounter = closureDemo();
incrementCounter(); // 1
incrementCounter(); // 2
incrementCounter(); // 3

// 创建另一个独立的闭包
const anotherCounter = closureDemo();
anotherCounter(); // 1 (独立的计数器)

console.log('\n' + '='.repeat(50) + '\n');

// 6. 常见陷阱和解决方案
console.log('6. 常见作用域陷阱：');

// 陷阱1: 循环中的异步操作
console.log('=== 循环闭包陷阱 ===');

// 错误示例 (使用var)
console.log('使用var的问题:');
for (var i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log('var循环:', i); // 输出3次3
    }, 10);
}

// 正确示例 (使用let)
setTimeout(() => {
    console.log('使用let的解决方案:');
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            console.log('let循环:', i); // 输出0,1,2
        }, 50);
    }
}, 100);

// 传统解决方案 (IIFE - 立即执行函数表达式)
setTimeout(() => {
    console.log('使用IIFE的解决方案:');
    for (var i = 0; i < 3; i++) {
        (function(index) {
            setTimeout(() => {
                console.log('IIFE循环:', index); // 输出0,1,2
            }, 10);
        })(i);
    }
}, 200);

console.log('\n' + '='.repeat(50) + '\n');

// 7. 与C/C++作用域对比总结
setTimeout(() => {
    console.log('7. 作用域机制对比总结：');
    console.log(`
C/C++ vs JavaScript 作用域：
┌─────────────────┬─────────────────┬─────────────────┐
│ 特性            │ C/C++           │ JavaScript      │
├─────────────────┼─────────────────┼─────────────────┤
│ 块级作用域      │ 支持 { }        │ let/const支持   │
│ 函数作用域      │ 函数内局部变量  │ var/let/const   │
│ 变量提升        │ 无此概念        │ var和函数声明   │
│ 暂时性死区      │ 无此概念        │ let/const特性   │
│ 闭包            │ 无此概念        │ 核心特性        │
│ 变量遮盖        │ 支持            │ 支持            │
└─────────────────┴─────────────────┴─────────────────┘

最佳实践：
• 优先使用 let 和 const，避免使用 var
• 理解作用域链查找机制
• 注意闭包的内存影响
• 小心循环中的异步操作
• 使用严格模式避免隐式全局变量
`);
}, 300);