/**
 * JavaScript模块系统 - 现代模块化开发
 * 重点：CommonJS vs ES Modules、模块加载机制、循环依赖处理
 */

console.log('=== JavaScript模块系统 ===\n');

// 1. 模块化的演进历程
console.log('1. 模块化演进历程：');

console.log(`
JavaScript模块化演进：
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ 时期        │ 方案        │ 优点        │ 缺点        │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ 早期        │ 全局变量    │ 简单        │ 污染全局    │
│ 命名空间    │ IIFE包装    │ 避免冲突    │ 依赖管理难  │
│ CommonJS    │ require/exports│ 同步加载  │ 浏览器不支持│
│ AMD         │ define/require│ 异步加载   │ 语法复杂    │
│ UMD         │ 通用模块    │ 兼容性好    │ 代码冗余    │
│ ES Modules  │ import/export│ 标准化     │ 兼容性问题  │
└─────────────┴─────────────┴─────────────┴─────────────┘
`);

// 2. CommonJS模块系统 (Node.js)
console.log('2. CommonJS模块系统演示：');

// 注意：在浏览器环境中演示CommonJS概念
// 实际使用需要在Node.js环境中

// 模拟CommonJS的module和exports对象
function simulateCommonJS() {
    console.log('=== CommonJS风格 ===');
    
    // 模拟模块定义
    function createMathModule() {
        const module = { exports: {} };
        const exports = module.exports;
        
        // 方式1：exports.xxx
        exports.add = function(a, b) {
            return a + b;
        };
        
        exports.subtract = function(a, b) {
            return a - b;
        };
        
        // 方式2：module.exports
        module.exports.multiply = function(a, b) {
            return a * b;
        };
        
        // 方式3：直接赋值（会覆盖前面的导出）
        // module.exports = function(a, b) { return a / b; };
        
        return module.exports;
    }
    
    // 模拟require函数
    function simulateRequire(moduleFactory) {
        return moduleFactory();
    }
    
    // 使用模块
    const math = simulateRequire(createMathModule);
    console.log('CommonJS加法:', math.add(5, 3));
    console.log('CommonJS减法:', math.subtract(5, 3));
    console.log('CommonJS乘法:', math.multiply(5, 3));
}

simulateCommonJS();

console.log('\n' + '='.repeat(50) + '\n');

// 3. ES Modules语法演示
console.log('3. ES Modules语法：');

// 注意：这里用模拟方式演示ES Modules概念
// 实际使用需要支持ES Modules的环境

function demonstrateESModules() {
    console.log('=== ES Modules风格 ===');
    
    // 模拟命名导出
    const namedExports = {
        // export const PI = 3.14159;
        PI: 3.14159,
        
        // export function calculateArea(radius) { return PI * radius * radius; }
        calculateArea: function(radius) {
            return namedExports.PI * radius * radius;
        },
        
        // export class Calculator { ... }
        Calculator: class {
            constructor() {
                this.history = [];
            }
            
            add(a, b) {
                const result = a + b;
                this.history.push(`${a} + ${b} = ${result}`);
                return result;
            }
            
            getHistory() {
                return [...this.history];
            }
        }
    };
    
    // 模拟默认导出
    const defaultExport = {
        name: 'DefaultUtility',
        version: '1.0.0',
        
        formatNumber: function(num, decimals = 2) {
            return num.toFixed(decimals);
        }
    };
    
    // 模拟导入
    // import { PI, calculateArea, Calculator } from './math.js';
    const { PI, calculateArea, Calculator } = namedExports;
    
    // import DefaultUtility from './utility.js';
    const DefaultUtility = defaultExport;
    
    // import * as MathUtils from './math.js';
    const MathUtils = namedExports;
    
    console.log('ES Modules PI:', PI);
    console.log('ES Modules 圆面积:', calculateArea(5));
    
    const calc = new Calculator();
    console.log('ES Modules 计算器:', calc.add(10, 20));
    console.log('ES Modules 计算历史:', calc.getHistory());
    
    console.log('ES Modules 默认导出:', DefaultUtility.name);
    console.log('ES Modules 命名空间导入:', Object.keys(MathUtils));
}

demonstrateESModules();

console.log('\n' + '='.repeat(50) + '\n');

// 4. 模块加载机制对比
console.log('4. 模块加载机制：');

function demonstrateModuleLoading() {
    console.log('=== 模块加载机制对比 ===');
    
    console.log(`
CommonJS vs ES Modules 加载机制：
┌─────────────────┬─────────────────┬─────────────────┐
│ 特性            │ CommonJS        │ ES Modules      │
├─────────────────┼─────────────────┼─────────────────┤
│ 加载时机        │ 运行时          │ 编译时          │
│ 加载方式        │ 同步加载        │ 异步加载        │
│ 值拷贝          │ 值的拷贝        │ 值的引用        │
│ 动态导入        │ 支持            │ 需要import()    │
│ 循环依赖        │ 部分支持        │ 更好支持        │
│ Tree Shaking    │ 不支持          │ 支持            │
│ 静态分析        │ 困难            │ 容易            │
└─────────────────┴─────────────────┴─────────────────┘
`);
    
    // 演示值拷贝 vs 值引用的差异
    console.log('=== 值拷贝 vs 值引用演示 ===');
    
    // CommonJS风格 - 值拷贝
    function createCommonJSCounter() {
        let count = 0;
        
        return {
            exports: {
                count: count,  // 导出时拷贝值
                increment: function() {
                    count++;
                    this.count = count;  // 需要手动更新导出的值
                    return count;
                },
                getCount: function() {
                    return count;
                }
            }
        };
    }
    
    // ES Modules风格 - 值引用
    function createESModuleCounter() {
        let count = 0;
        
        return {
            get count() {  // 使用getter实现引用
                return count;
            },
            increment() {
                count++;
                return count;
            }
        };
    }
    
    const cjsCounter = createCommonJSCounter().exports;
    const esCounter = createESModuleCounter();
    
    console.log('CommonJS初始值:', cjsCounter.count);
    console.log('ES Module初始值:', esCounter.count);
    
    cjsCounter.increment();
    esCounter.increment();
    
    console.log('CommonJS增加后导出值:', cjsCounter.count);  // 仍然是0（值拷贝）
    console.log('CommonJS增加后实际值:', cjsCounter.getCount());  // 1
    console.log('ES Module增加后值:', esCounter.count);  // 1（值引用）
}

demonstrateModuleLoading();

console.log('\n' + '='.repeat(50) + '\n');

// 5. 循环依赖处理
console.log('5. 循环依赖处理：');

function demonstrateCircularDependency() {
    console.log('=== 循环依赖演示 ===');
    
    // 模拟模块A和模块B的循环依赖
    const moduleCache = {};
    
    function createModuleA() {
        if (moduleCache.A) return moduleCache.A;
        
        console.log('开始加载模块A');
        
        const moduleA = {
            name: 'ModuleA',
            getValue: function() {
                // 依赖模块B
                const moduleB = createModuleB();
                return `A调用B: ${moduleB.getValue()}`;
            }
        };
        
        moduleCache.A = moduleA;
        console.log('模块A加载完成');
        return moduleA;
    }
    
    function createModuleB() {
        if (moduleCache.B) return moduleCache.B;
        
        console.log('开始加载模块B');
        
        const moduleB = {
            name: 'ModuleB',
            getValue: function() {
                // 检查是否存在循环依赖
                if (moduleCache.A) {
                    return `B知道A存在: ${moduleCache.A.name}`;
                } else {
                    return 'B在A完成前加载';
                }
            }
        };
        
        moduleCache.B = moduleB;
        console.log('模块B加载完成');
        return moduleB;
    }
    
    // 清空缓存
    Object.keys(moduleCache).forEach(key => delete moduleCache[key]);
    
    console.log('从模块A开始加载:');
    const moduleA = createModuleA();
    console.log('结果:', moduleA.getValue());
    
    console.log('\n重新清空缓存，从模块B开始加载:');
    Object.keys(moduleCache).forEach(key => delete moduleCache[key]);
    const moduleB = createModuleB();
    console.log('结果:', moduleB.getValue());
}

demonstrateCircularDependency();

console.log('\n' + '='.repeat(50) + '\n');

// 6. 动态导入和代码分割
console.log('6. 动态导入：');

function demonstrateDynamicImports() {
    console.log('=== 动态导入演示 ===');
    
    // 模拟动态导入
    function createAsyncModule(name, content) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    name,
                    content,
                    loadTime: new Date().toISOString()
                });
            }, Math.random() * 100);
        });
    }
    
    // 模拟import()函数
    async function simulateImport(moduleName) {
        console.log(`开始动态加载: ${moduleName}`);
        
        try {
            const module = await createAsyncModule(moduleName, `${moduleName}的内容`);
            console.log(`${moduleName} 加载成功:`, module);
            return module;
        } catch (error) {
            console.error(`${moduleName} 加载失败:`, error);
            throw error;
        }
    }
    
    // 条件性导入
    async function conditionalImport(feature) {
        if (feature === 'advanced') {
            return await simulateImport('AdvancedModule');
        } else {
            return await simulateImport('BasicModule');
        }
    }
    
    // 并行动态导入
    async function parallelImports() {
        console.log('开始并行导入...');
        
        const [moduleA, moduleB, moduleC] = await Promise.all([
            simulateImport('ModuleA'),
            simulateImport('ModuleB'),
            simulateImport('ModuleC')
        ]);
        
        console.log('并行导入完成:', { moduleA, moduleB, moduleC });
    }
    
    // 执行演示
    conditionalImport('advanced').then(() => {
        return parallelImports();
    });
}

demonstrateDynamicImports();

console.log('\n' + '='.repeat(50) + '\n');

// 7. 模块化最佳实践
setTimeout(() => {
    console.log('7. 模块化最佳实践：');
    
    console.log(`
模块化最佳实践：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 目录结构：
project/
├── src/
│   ├── utils/          # 工具函数
│   ├── components/     # 组件模块  
│   ├── services/       # 服务层
│   ├── constants/      # 常量定义
│   └── index.js       # 入口文件

🎯 命名约定：
• 文件名使用kebab-case: user-service.js
• 导出名使用camelCase: getUserData
• 常量使用UPPER_CASE: API_BASE_URL
• 类名使用PascalCase: UserManager

📋 导出原则：
• 优先使用命名导出，便于tree shaking
• 只在导出单一主要功能时使用默认导出
• 避免混合使用命名和默认导出
• 导出的接口保持稳定

🔄 依赖管理：
• 避免循环依赖
• 合理设计模块层次
• 使用依赖注入降低耦合
• 定期检查和清理无用依赖

⚡ 性能优化：
• 使用动态导入实现代码分割
• 延迟加载非关键模块
• 合理使用模块缓存
• 避免导入整个库

🔧 工具支持：
• 使用ESLint检查导入/导出
• 配置bundler进行模块打包
• 使用TypeScript增强类型安全
• 设置路径别名简化导入
`);
    
    // 实用的模块工具函数
    console.log('=== 实用模块工具 ===');
    
    // 模块懒加载管理器
    class ModuleManager {
        constructor() {
            this.cache = new Map();
            this.loading = new Map();
        }
        
        async loadModule(name, loader) {
            // 检查缓存
            if (this.cache.has(name)) {
                console.log(`从缓存获取模块: ${name}`);
                return this.cache.get(name);
            }
            
            // 检查是否正在加载
            if (this.loading.has(name)) {
                console.log(`等待模块加载: ${name}`);
                return this.loading.get(name);
            }
            
            // 开始加载
            console.log(`开始加载模块: ${name}`);
            const loadPromise = loader().then(module => {
                this.cache.set(name, module);
                this.loading.delete(name);
                console.log(`模块加载完成: ${name}`);
                return module;
            }).catch(error => {
                this.loading.delete(name);
                console.error(`模块加载失败: ${name}`, error);
                throw error;
            });
            
            this.loading.set(name, loadPromise);
            return loadPromise;
        }
        
        unloadModule(name) {
            this.cache.delete(name);
            console.log(`模块已卸载: ${name}`);
        }
        
        getLoadedModules() {
            return Array.from(this.cache.keys());
        }
    }
    
    // 使用模块管理器
    const moduleManager = new ModuleManager();
    
    // 模拟模块加载器
    const createModuleLoader = (name, delay = 100) => () => 
        new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    name,
                    version: '1.0.0',
                    api: {
                        doSomething: () => `${name} 执行操作`
                    }
                });
            }, delay);
        });
    
    // 演示模块管理
    async function demonstrateModuleManager() {
        try {
            // 首次加载
            const moduleA = await moduleManager.loadModule('ModuleA', createModuleLoader('ModuleA'));
            console.log('模块A API:', moduleA.api.doSomething());
            
            // 重复加载（从缓存获取）
            const moduleA2 = await moduleManager.loadModule('ModuleA', createModuleLoader('ModuleA'));
            console.log('模块缓存验证:', moduleA === moduleA2);
            
            // 并发加载同一模块
            const [moduleB1, moduleB2] = await Promise.all([
                moduleManager.loadModule('ModuleB', createModuleLoader('ModuleB', 200)),
                moduleManager.loadModule('ModuleB', createModuleLoader('ModuleB', 200))
            ]);
            console.log('并发加载验证:', moduleB1 === moduleB2);
            
            console.log('已加载的模块:', moduleManager.getLoadedModules());
            
        } catch (error) {
            console.error('模块管理演示错误:', error);
        }
    }
    
    demonstrateModuleManager();
    
}, 2000);