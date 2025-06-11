/**
 * JavaScript类型系统 - 与C/C++对比学习
 * 重点：动态类型、类型转换、类型检查
 */

console.log('=== JavaScript类型系统对比 ===\n');

// 1. 基本数据类型对比
console.log('1. 基本数据类型：');

// JavaScript: 动态类型，运行时确定
let number = 42;           // C: int number = 42;
let string = "Hello";      // C: char string[] = "Hello";
let boolean = true;        // C: bool boolean = true;
let undefined_var;         // C: 未初始化变量是未定义行为
let null_var = null;       // C: NULL指针

console.log('number:', typeof number, '=', number);
console.log('string:', typeof string, '=', string);
console.log('boolean:', typeof boolean, '=', boolean);
console.log('undefined_var:', typeof undefined_var, '=', undefined_var);
console.log('null_var:', typeof null_var, '=', null_var);

// 特殊情况：typeof null 返回 "object" (JavaScript的历史bug)
console.log('typeof null bug:', typeof null); // "object"

console.log('\n' + '='.repeat(50) + '\n');

// 2. 类型转换机制
console.log('2. 自动类型转换（C/C++中需要显式转换）：');

// 隐式类型转换
console.log('字符串连接:', '5' + 3);        // "53" (C中会报错)
console.log('算术运算:', '5' - 3);          // 2
console.log('比较运算:', '5' == 5);         // true (弱相等)
console.log('严格比较:', '5' === 5);        // false (强相等)
console.log('布尔转换:', !!'hello');        // true

// 显式类型转换
console.log('Number():', Number('123'));    // 123
console.log('String():', String(123));      // "123"
console.log('Boolean():', Boolean(0));      // false

console.log('\n' + '='.repeat(50) + '\n');

// 3. 类型检查方法
console.log('3. 类型检查方法：');

function demonstrateTypeChecking(value) {
    console.log(`值: ${value}`);
    console.log(`typeof: ${typeof value}`);
    console.log(`Object.prototype.toString: ${Object.prototype.toString.call(value)}`);
    console.log('Array.isArray:', Array.isArray(value));
    console.log('instanceof Object:', value instanceof Object);
    console.log('---');
}

demonstrateTypeChecking(42);
demonstrateTypeChecking("hello");
demonstrateTypeChecking([1, 2, 3]);
demonstrateTypeChecking({name: "test"});
demonstrateTypeChecking(null);
demonstrateTypeChecking(undefined);

console.log('\n' + '='.repeat(50) + '\n');

// 4. 数字类型的特殊性
console.log('4. JavaScript数字类型特点：');

// JavaScript只有一种数字类型 (IEEE 754 双精度浮点数)
console.log('整数最大值:', Number.MAX_SAFE_INTEGER);  // 2^53 - 1
console.log('浮点精度问题:', 0.1 + 0.2);              // 0.30000000000000004
console.log('精度问题解决:', (0.1 + 0.2).toFixed(1)); // "0.3"

// 特殊数值
console.log('正无穷:', Infinity);
console.log('负无穷:', -Infinity);
console.log('非数字:', NaN);
console.log('NaN比较:', NaN === NaN);     // false (唯一不等于自身的值)
console.log('检测NaN:', Number.isNaN(NaN)); // true

console.log('\n' + '='.repeat(50) + '\n');

// 5. 实用的类型工具函数
console.log('5. 实用的类型检查函数：');

// 严格类型检查函数
function getType(value) {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

// 类型检查示例
const testValues = [42, "hello", true, [], {}, null, undefined, function(){}, new Date()];
testValues.forEach(value => {
    console.log(`${JSON.stringify(value)} -> ${getType(value)}`);
});

console.log('\n' + '='.repeat(50) + '\n');

// 6. 与C/C++的关键差异总结
console.log('6. 关键差异总结：');
console.log(`
C/C++ vs JavaScript:
┌─────────────────┬─────────────────┬─────────────────┐
│ 特性            │ C/C++           │ JavaScript      │
├─────────────────┼─────────────────┼─────────────────┤
│ 类型系统        │ 静态类型        │ 动态类型        │
│ 类型检查        │ 编译时          │ 运行时          │
│ 类型转换        │ 显式（大部分）  │ 隐式+显式       │
│ 数字类型        │ int/float/double│ 统一的Number    │
│ 字符串          │ char[]          │ 内置String类型  │
│ 内存管理        │ 手动            │ 自动（GC）      │
└─────────────────┴─────────────────┴─────────────────┘
`);

// 7. 最佳实践建议
console.log('7. 最佳实践：');
console.log(`
• 使用 === 而不是 == 进行比较
• 使用 typeof 和 instanceof 进行类型检查
• 注意隐式类型转换的陷阱
• 使用 Number.isNaN() 而不是 isNaN()
• 考虑使用 TypeScript 获得类型安全
`);