/**
 * JavaScript构建工具和工程化 - 现代前端工程化
 * 重点：Webpack、Vite、Babel、ESLint、包管理
 */

console.log('=== JavaScript构建工具和工程化 ===\n');

// 1. 构建工具概述
console.log('1. 构建工具演进：');

console.log(`
前端构建工具演进历程：
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ 时代        │ 工具        │ 主要功能    │ 特点        │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ 早期        │ 手工管理    │ 文件合并    │ 简单粗暴    │
│ Task Runner │ Grunt/Gulp  │ 任务自动化  │ 流式处理    │
│ Module Bundle│ Webpack    │ 模块打包    │ 强大复杂    │
│ 零配置      │ Parcel     │ 开箱即用    │ 自动推断    │
│ 新生代      │ Vite/esbuild│ 快速构建   │ 原生ES模块  │
│ 通用工具    │ Rollup     │ 库打包      │ Tree Shaking│
└─────────────┴─────────────┴─────────────┴─────────────┘
`);

// 2. 模拟构建过程
console.log('2. 构建过程演示：');

// 模拟简单的模块打包器
class SimpleBundler {
    constructor() {
        this.modules = new Map();
        this.dependencies = new Map();
        this.output = '';
    }
    
    // 添加模块
    addModule(name, code, deps = []) {
        this.modules.set(name, code);
        this.dependencies.set(name, deps);
        console.log(`添加模块: ${name}, 依赖: [${deps.join(', ')}]`);
    }
    
    // 依赖排序（拓扑排序）
    resolveDependencies() {
        const visited = new Set();
        const visiting = new Set();
        const sorted = [];
        
        const visit = (name) => {
            if (visiting.has(name)) {
                throw new Error(`循环依赖检测: ${name}`);
            }
            if (visited.has(name)) return;
            
            visiting.add(name);
            
            const deps = this.dependencies.get(name) || [];
            deps.forEach(dep => {
                if (!this.modules.has(dep)) {
                    throw new Error(`找不到依赖模块: ${dep}`);
                }
                visit(dep);
            });
            
            visiting.delete(name);
            visited.add(name);
            sorted.push(name);
        };
        
        for (const name of this.modules.keys()) {
            visit(name);
        }
        
        return sorted;
    }
    
    // 代码转换
    transform(code, name) {
        // 模拟Babel转换：ES6 -> ES5
        let transformed = code
            .replace(/const\s+/g, 'var ')
            .replace(/let\s+/g, 'var ')
            .replace(/=>\s*{/g, 'function() {')
            .replace(/=>\s*([^{])/g, 'function() { return $1; }');
        
        console.log(`转换模块 ${name}:`, transformed);
        return transformed;
    }
    
    // 打包
    bundle() {
        console.log('开始打包...');
        
        try {
            const sortedModules = this.resolveDependencies();
            console.log('依赖解析顺序:', sortedModules);
            
            let bundled = '(function() {\n';
            bundled += '  var modules = {};\n';
            bundled += '  var cache = {};\n\n';
            
            // 添加模块定义
            sortedModules.forEach(name => {
                const code = this.modules.get(name);
                const transformed = this.transform(code, name);
                bundled += `  modules['${name}'] = function() {\n`;
                bundled += `    ${transformed}\n`;
                bundled += `  };\n\n`;
            });
            
            // 添加模块加载器
            bundled += `  function require(name) {
    if (cache[name]) return cache[name];
    var module = { exports: {} };
    cache[name] = module.exports;
    modules[name].call(module.exports, module, module.exports, require);
    return cache[name];
  }
  
  // 启动入口模块
  require('main');
})();`;
            
            this.output = bundled;
            console.log('打包完成！');
            return bundled;
            
        } catch (error) {
            console.error('打包失败:', error.message);
            return null;
        }
    }
    
    getOutput() {
        return this.output;
    }
}

// 使用简单打包器
const bundler = new SimpleBundler();

// 添加模块
bundler.addModule('utils', `
  const add = (a, b) => a + b;
  const multiply = (a, b) => a * b;
  module.exports = { add, multiply };
`, []);

bundler.addModule('math', `
  const utils = require('utils');
  const calculate = (x, y) => {
    return utils.add(utils.multiply(x, 2), y);
  };
  module.exports = { calculate };
`, ['utils']);

bundler.addModule('main', `
  const math = require('math');
  console.log('计算结果:', math.calculate(5, 3));
`, ['math']);

const bundledCode = bundler.bundle();

console.log('\n' + '='.repeat(50) + '\n');

// 3. 代码压缩和优化
console.log('3. 代码优化演示：');

// 简单的代码压缩器
class SimpleMinifier {
    minify(code) {
        console.log('开始代码压缩...');
        
        let minified = code
            // 移除注释
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '')
            // 移除多余空白
            .replace(/\s+/g, ' ')
            .replace(/\s*([{}();,])\s*/g, '$1')
            // 简单变量重命名
            .replace(/\bfunction\b/g, 'function')
            .replace(/\breturn\b/g, 'return');
        
        const originalSize = code.length;
        const minifiedSize = minified.length;
        const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
        
        console.log(`压缩完成: ${originalSize} -> ${minifiedSize} bytes (减少${reduction}%)`);
        
        return minified;
    }
}

const minifier = new SimpleMinifier();
if (bundledCode) {
    const minifiedCode = minifier.minify(bundledCode);
    console.log('压缩后代码片段:', minifiedCode.substring(0, 100) + '...');
}

console.log('\n' + '='.repeat(50) + '\n');

// 4. Tree Shaking演示
console.log('4. Tree Shaking优化：');

class TreeShaker {
    constructor() {
        this.usedExports = new Set();
        this.modules = new Map();
    }
    
    addModule(name, exports, code) {
        this.modules.set(name, { exports, code });
        console.log(`添加模块 ${name}, 导出:`, exports);
    }
    
    markUsed(moduleName, exportName) {
        const key = `${moduleName}.${exportName}`;
        this.usedExports.add(key);
        console.log(`标记使用: ${key}`);
    }
    
    shake() {
        console.log('开始Tree Shaking...');
        
        const result = new Map();
        
        for (const [moduleName, moduleInfo] of this.modules) {
            const usedExportsInModule = moduleInfo.exports.filter(exp => {
                const key = `${moduleName}.${exp}`;
                return this.usedExports.has(key);
            });
            
            if (usedExportsInModule.length > 0) {
                result.set(moduleName, {
                    exports: usedExportsInModule,
                    code: this.generateOptimizedCode(moduleInfo.code, usedExportsInModule)
                });
                
                console.log(`保留模块 ${moduleName}, 使用的导出:`, usedExportsInModule);
            } else {
                console.log(`移除模块 ${moduleName} (未使用)`);
            }
        }
        
        return result;
    }
    
    generateOptimizedCode(originalCode, usedExports) {
        // 简化：只返回使用的函数
        const optimized = usedExports.map(exp => 
            `function ${exp}() { /* 优化后的${exp}代码 */ }`
        ).join('\n');
        
        return optimized;
    }
}

// 演示Tree Shaking
const treeShaker = new TreeShaker();

treeShaker.addModule('lodash', ['map', 'filter', 'reduce', 'find', 'forEach'], 'lodash完整代码...');
treeShaker.addModule('utils', ['debounce', 'throttle', 'deepClone'], 'utils完整代码...');

// 标记实际使用的函数
treeShaker.markUsed('lodash', 'map');
treeShaker.markUsed('lodash', 'filter');
treeShaker.markUsed('utils', 'debounce');

const optimizedModules = treeShaker.shake();
console.log('Tree Shaking结果:', Array.from(optimizedModules.keys()));

console.log('\n' + '='.repeat(50) + '\n');

// 5. 开发服务器和热更新
console.log('5. 开发服务器和热更新：');

// 模拟开发服务器
class DevServer {
    constructor() {
        this.files = new Map();
        this.watchers = new Map();
        this.clients = new Set();
    }
    
    addFile(path, content) {
        this.files.set(path, {
            content,
            lastModified: Date.now()
        });
        console.log(`添加文件: ${path}`);
    }
    
    updateFile(path, newContent) {
        if (!this.files.has(path)) {
            console.log(`文件不存在: ${path}`);
            return;
        }
        
        const file = this.files.get(path);
        file.content = newContent;
        file.lastModified = Date.now();
        
        console.log(`文件更新: ${path}`);
        this.notifyClients('file-changed', { path, content: newContent });
    }
    
    watch(path, callback) {
        if (!this.watchers.has(path)) {
            this.watchers.set(path, new Set());
        }
        this.watchers.get(path).add(callback);
        console.log(`开始监听: ${path}`);
    }
    
    notifyClients(event, data) {
        console.log(`通知客户端: ${event}`, data.path);
        
        // 模拟热更新
        if (event === 'file-changed') {
            this.performHotUpdate(data);
        }
    }
    
    performHotUpdate(data) {
        console.log('执行热更新...');
        
        // 模拟不同类型文件的热更新策略
        if (data.path.endsWith('.css')) {
            console.log('CSS热更新: 直接替换样式');
        } else if (data.path.endsWith('.js')) {
            console.log('JS热更新: 重新执行模块');
            // 模拟模块重新加载
            this.reloadModule(data.path, data.content);
        } else {
            console.log('其他文件更新: 刷新页面');
        }
    }
    
    reloadModule(path, content) {
        console.log(`重新加载模块: ${path}`);
        
        // 模拟模块状态保持
        const moduleState = this.extractModuleState(path);
        console.log('保存模块状态:', moduleState);
        
        // 模拟执行新代码
        console.log('执行新模块代码...');
        
        // 模拟恢复状态
        console.log('恢复模块状态...');
    }
    
    extractModuleState(path) {
        // 模拟提取React组件状态等
        return {
            componentState: { count: 5 },
            localVariables: { temp: 'value' }
        };
    }
}

// 演示开发服务器
const devServer = new DevServer();

devServer.addFile('/src/App.js', `
  const App = () => {
    const [count, setCount] = useState(0);
    return <div>Count: {count}</div>;
  };
`);

devServer.addFile('/src/styles.css', `
  .app { background: white; }
`);

// 模拟文件监听
devServer.watch('/src/App.js', (changes) => {
    console.log('App.js changed:', changes);
});

// 模拟文件更新
setTimeout(() => {
    devServer.updateFile('/src/App.js', `
    const App = () => {
      const [count, setCount] = useState(0);
      return <div>Updated Count: {count}</div>;
    };
  `);
}, 100);

setTimeout(() => {
    devServer.updateFile('/src/styles.css', `
    .app { background: lightblue; }
  `);
}, 200);

console.log('\n' + '='.repeat(50) + '\n');

// 6. 代码质量工具
setTimeout(() => {
    console.log('6. 代码质量工具：');
    
    // 简单的ESLint模拟
    class SimpleLinter {
        constructor() {
            this.rules = {
                'no-unused-vars': true,
                'no-console': false,
                'prefer-const': true,
                'semi': true
            };
        }
        
        lint(code) {
            const issues = [];
            
            // 检查未使用的变量
            if (this.rules['no-unused-vars']) {
                const varPattern = /(?:var|let|const)\s+(\w+)/g;
                const variables = [];
                let match;
                
                while ((match = varPattern.exec(code)) !== null) {
                    variables.push(match[1]);
                }
                
                variables.forEach(variable => {
                    const usagePattern = new RegExp(`\\b${variable}\\b`, 'g');
                    const matches = code.match(usagePattern);
                    if (matches && matches.length <= 1) {
                        issues.push({
                            rule: 'no-unused-vars',
                            message: `'${variable}' is defined but never used`,
                            severity: 'error'
                        });
                    }
                });
            }
            
            // 检查console语句
            if (this.rules['no-console']) {
                const consolePattern = /console\.\w+/g;
                const matches = code.match(consolePattern);
                if (matches) {
                    matches.forEach(() => {
                        issues.push({
                            rule: 'no-console',
                            message: 'Unexpected console statement',
                            severity: 'warning'
                        });
                    });
                }
            }
            
            // 检查const使用
            if (this.rules['prefer-const']) {
                const letPattern = /let\s+(\w+)\s*=\s*[^;]+;/g;
                let match;
                
                while ((match = letPattern.exec(code)) !== null) {
                    const variable = match[1];
                    const reassignPattern = new RegExp(`${variable}\\s*=`, 'g');
                    const reassignments = code.match(reassignPattern);
                    
                    if (reassignments && reassignments.length === 1) {
                        issues.push({
                            rule: 'prefer-const',
                            message: `'${variable}' is never reassigned. Use 'const' instead`,
                            severity: 'warning'
                        });
                    }
                }
            }
            
            return issues;
        }
        
        format(issues) {
            if (issues.length === 0) {
                return '✓ No linting errors found';
            }
            
            const formatted = issues.map(issue => 
                `${issue.severity.toUpperCase()}: ${issue.message} (${issue.rule})`
            ).join('\n');
            
            return `Found ${issues.length} issue(s):\n${formatted}`;
        }
    }
    
    // 演示代码检查
    const linter = new SimpleLinter();
    
    const testCode = `
    let unusedVar = 'never used';
    let count = 0;
    count = count + 1;
    console.log(count);
    let name = 'John';
  `;
    
    const issues = linter.lint(testCode);
    console.log('代码检查结果:');
    console.log(linter.format(issues));
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 7. 工程化最佳实践
    console.log('7. 工程化最佳实践：');
    
    console.log(`
现代前端工程化最佳实践：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏗️ 构建配置：
• 开发环境：快速构建，热更新，Source Map
• 生产环境：代码压缩，Tree Shaking，分包优化
• 测试环境：覆盖率报告，并行测试

📦 包管理：
• 使用lockfile锁定版本（package-lock.json）
• 定期更新依赖，检查安全漏洞
• 区分开发依赖和生产依赖
• 避免重复依赖，使用peerDependencies

🔍 代码质量：
• ESLint + Prettier 代码规范
• Pre-commit hooks 提交前检查
• 单元测试 + 集成测试
• 代码覆盖率监控

⚡ 性能优化：
• 代码分割和懒加载
• 图片优化和压缩
• CDN和缓存策略
• Bundle分析和优化

🔧 开发体验：
• 热模块替换(HMR)
• TypeScript类型检查
• 自动化测试
• CI/CD流水线

🎯 部署策略：
• 多环境配置管理
• 渐进式部署
• 回滚机制
• 监控和日志

推荐工具链：
┌─────────────┬─────────────┬─────────────┐
│ 类别        │ 推荐工具    │ 备选方案    │
├─────────────┼─────────────┼─────────────┤
│ 构建工具    │ Vite        │ Webpack     │
│ 包管理器    │ pnpm        │ npm/yarn    │
│ 代码检查    │ ESLint      │ JSHint      │
│ 代码格式化  │ Prettier    │ Beautify    │
│ 测试框架    │ Vitest      │ Jest        │
│ 类型检查    │ TypeScript  │ Flow        │
│ Git Hooks   │ Husky       │ lint-staged │
│ CI/CD       │ GitHub Actions│ Jenkins   │
└─────────────┴─────────────┴─────────────┘
`);
    
}, 500);