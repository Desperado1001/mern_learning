# JavaScript 核心技能：二八法则精炼

根据二八法则（帕累托原则），以下是 JavaScript 中最重要的 20% 核心概念，它们将为您带来 80% 的开发效率和问题解决能力，尤其对于 MERN 全栈开发者而言。

## 核心 20% (高影响力)

掌握这些概念，您将能够理解和编写绝大多数现代 JavaScript 代码，并为深入学习 React 和 Node.js 打下坚实基础。

### 1. JavaScript 基础语法与数据类型
这是所有编程的基石。
- **变量声明**: `let`, `const`, `var` 的区别与使用场景。
- **数据类型**: 原始类型 (String, Number, Boolean, Null, Undefined, Symbol, BigInt) 和对象类型 (Object, Array, Function)。
- **运算符**: 算术、比较、逻辑、赋值等常用运算符。
- **控制流**: `if/else`, `switch`, `for`, `while` 循环。
- **函数**: 函数声明、函数表达式、参数、返回值。

### 2. 异步编程 (Promises & Async/Await)
现代 Web 开发的核心，处理网络请求和非阻塞操作的关键。
- **回调函数**: 理解其局限性（回调地狱）。
- **Promise**: 理解 Promise 的状态 (pending, fulfilled, rejected) 及其链式调用 (`.then()`, `.catch()`, `.finally()`)。
- **Async/Await**: 基于 Promise 的语法糖，使异步代码看起来像同步代码，极大提高可读性。

### 3. ES6+ (ECMAScript 2015+) 新特性
这些特性已成为现代 JavaScript 的标准，广泛应用于 React 和 Node.js 项目中。
- **箭头函数 (Arrow Functions)**: 简洁的函数语法，以及对 `this` 绑定的影响。
- **模板字符串 (Template Literals)**: 方便的字符串拼接和多行字符串。
- **解构赋值 (Destructuring Assignment)**: 从数组或对象中提取数据。
- **扩展运算符 (Spread Operator) 与剩余参数 (Rest Parameters)**: 数组和对象的复制、合并、函数参数处理。
- **模块系统 (ES Modules)**: `import` 和 `export`，用于组织和复用代码。

### 4. 作用域 (Scope) 与闭包 (Closures)
理解变量的可见性和生命周期，以及函数如何“记住”其外部环境。
- **全局作用域、函数作用域、块级作用域 (let/const)**。
- **闭包**: 函数能够访问并操作其外部函数作用域中的变量，即使外部函数已经执行完毕。

### 5. 对象 (Objects) 与数组 (Arrays) 的常用操作
JavaScript 中最常用的两种数据结构，熟练掌握其操作至关重要。
- **对象**: 属性访问、增删改查、`Object.keys()`, `Object.values()`, `Object.entries()`。
- **数组**: 常用方法如 `push`, `pop`, `shift`, `unshift`, `splice`, `slice`, `concat`。
- **高阶函数 (Higher-Order Functions)**: `map`, `filter`, `reduce`, `forEach` (这些是函数式编程的基础，虽然属于“高阶”，但其使用频率和重要性使其成为核心)。

## 剩余 80% (进阶与特定场景)

在掌握了上述核心概念后，您可以逐步学习以下内容，以提升您的 JavaScript 技能和解决更复杂问题的能力。

- **原型 (Prototypes) 与类 (Classes)**: 深入理解 JavaScript 的继承机制。
- **错误处理**: `try...catch...finally` 的高级用法，自定义错误。
- **事件循环 (Event Loop) 深入**: 更细致地理解 JavaScript 的执行机制。
- **DOM 操作 (Document Object Model)**: 如果不使用 React 等框架，直接操作 DOM 是前端开发的基础。
- **Web API**: 如 `Fetch API` (用于网络请求), `localStorage`, `sessionStorage`。
- **正则表达式 (Regular Expressions)**: 用于字符串模式匹配。
- **迭代器 (Iterators) 与生成器 (Generators)**。
- **Set, Map, WeakSet, WeakMap**: 新的数据结构。
- **模块化工具**: Webpack, Vite 等构建工具的配置和原理。
- **性能优化**: 内存管理、渲染优化等。
- **测试**: 单元测试、集成测试框架 (Jest, React Testing Library)。

通过优先掌握核心 20%，您将能够快速上手 MERN 栈开发，并在实践中逐步深化对 JavaScript 的理解。