/**
 * JavaScript事件循环机制 - 异步编程基础
 * 重点：单线程非阻塞模型、宏任务、微任务、调用栈分析
 */

console.log('=== JavaScript事件循环机制 ===\n');

// 1. 事件循环基础概念
console.log('1. 事件循环基础演示：');

console.log('1. 同步代码开始');

// 宏任务：setTimeout
setTimeout(() => {
    console.log('4. setTimeout (宏任务)');
}, 0);

// 微任务：Promise
Promise.resolve().then(() => {
    console.log('3. Promise.then (微任务)');
});

console.log('2. 同步代码结束');

// 输出顺序：1 -> 2 -> 3 -> 4
// 说明：同步代码先执行，然后微任务，最后宏任务

setTimeout(() => {
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 2. 详细的事件循环分析
    console.log('2. 复杂的事件循环分析：');
    
    console.log('开始');
    
    setTimeout(() => console.log('宏任务1'), 0);
    
    Promise.resolve().then(() => {
        console.log('微任务1');
        Promise.resolve().then(() => console.log('微任务2'));
    });
    
    setTimeout(() => console.log('宏任务2'), 0);
    
    Promise.resolve().then(() => console.log('微任务3'));
    
    console.log('结束');
    
    // 输出顺序：开始 -> 结束 -> 微任务1 -> 微任务3 -> 微任务2 -> 宏任务1 -> 宏任务2
    
}, 100);

console.log('\n' + '='.repeat(50) + '\n');

// 3. 不同类型任务的优先级
setTimeout(() => {
    console.log('3. 任务优先级演示：');
    
    // 立即执行函数，演示调用栈
    (function demonstrateTaskTypes() {
        console.log('=== 任务类型和优先级 ===');
        
        // 同步任务（调用栈）
        console.log('A: 同步任务1');
        
        // 宏任务1：setTimeout
        setTimeout(() => console.log('F: setTimeout'), 0);
        
        // 宏任务2：setImmediate (Node.js环境)
        if (typeof setImmediate !== 'undefined') {
            setImmediate(() => console.log('G: setImmediate'));
        }
        
        // 微任务1：Promise
        Promise.resolve().then(() => {
            console.log('D: Promise微任务');
            
            // 微任务中创建新的微任务
            Promise.resolve().then(() => console.log('E: 嵌套Promise微任务'));
        });
        
        // 微任务2：queueMicrotask
        queueMicrotask(() => console.log('C: queueMicrotask'));
        
        console.log('B: 同步任务2');
        
        // 执行顺序分析：
        // 1. 同步任务先执行：A -> B
        // 2. 微任务队列清空：C -> D -> E
        // 3. 宏任务执行：F -> G
    })();
    
}, 200);

// 4. 异步操作的执行模型对比
setTimeout(() => {
    console.log('\n' + '='.repeat(50) + '\n');
    console.log('4. 与多线程模型对比：');
    
    console.log(`
JavaScript单线程非阻塞 vs C/C++多线程：
┌─────────────────┬─────────────────┬─────────────────┐
│ 特性            │ JavaScript      │ C/C++ 多线程    │
├─────────────────┼─────────────────┼─────────────────┤
│ 线程模型        │ 单线程          │ 多线程          │
│ 并发方式        │ 事件驱动        │ 抢占式调度      │
│ 数据共享        │ 无共享问题      │ 锁机制          │
│ 上下文切换      │ 无开销          │ 有开销          │
│ 死锁风险        │ 无              │ 有              │
│ CPU密集型       │ 不适合          │ 适合            │
│ I/O密集型       │ 非常适合        │ 适合            │
└─────────────────┴─────────────────┴─────────────────┘
`);
    
    // JavaScript异步I/O模拟
    function simulateAsyncIO(name, delay) {
        console.log(`开始 ${name} 操作`);
        
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`完成 ${name} 操作`);
                resolve(`${name} 结果`);
            }, delay);
        });
    }
    
    // 并发执行多个I/O操作
    console.log('=== 并发I/O操作演示 ===');
    
    const startTime = Date.now();
    
    Promise.all([
        simulateAsyncIO('数据库查询', 100),
        simulateAsyncIO('文件读取', 150),
        simulateAsyncIO('网络请求', 120)
    ]).then(results => {
        const endTime = Date.now();
        console.log('所有操作完成:', results);
        console.log(`总耗时: ${endTime - startTime}ms (并发执行)`);
    });
    
}, 300);

// 5. 事件循环的性能考量
setTimeout(() => {
    console.log('\n' + '='.repeat(50) + '\n');
    console.log('5. 事件循环性能分析：');
    
    // 阻塞事件循环的例子
    function blockingOperation(duration) {
        const start = Date.now();
        while (Date.now() - start < duration) {
            // 阻塞操作
        }
        return 'Blocking operation completed';
    }
    
    // 非阻塞操作
    function nonBlockingOperation(duration) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('Non-blocking operation completed');
            }, duration);
        });
    }
    
    console.log('=== 阻塞 vs 非阻塞演示 ===');
    console.log('开始演示...');
    
    // 设置一个定时器来检测事件循环是否被阻塞
    let counter = 0;
    const intervalId = setInterval(() => {
        console.log(`定时器触发: ${++counter}`);
        if (counter >= 5) {
            clearInterval(intervalId);
        }
    }, 50);
    
    // 阻塞操作（这会阻止定时器正常执行）
    setTimeout(() => {
        console.log('执行阻塞操作...');
        const result = blockingOperation(200); // 阻塞200ms
        console.log(result);
    }, 100);
    
    // 非阻塞操作
    setTimeout(() => {
        console.log('执行非阻塞操作...');
        nonBlockingOperation(200).then(result => {
            console.log(result);
        });
    }, 400);
    
}, 500);

// 6. 实际应用场景
setTimeout(() => {
    console.log('\n' + '='.repeat(50) + '\n');
    console.log('6. 实际应用场景：');
    
    // 任务调度器
    class TaskScheduler {
        constructor() {
            this.tasks = [];
            this.isRunning = false;
        }
        
        addTask(task, priority = 0) {
            this.tasks.push({ task, priority });
            this.tasks.sort((a, b) => b.priority - a.priority);
            
            if (!this.isRunning) {
                this.runTasks();
            }
        }
        
        async runTasks() {
            this.isRunning = true;
            
            while (this.tasks.length > 0) {
                const { task } = this.tasks.shift();
                
                try {
                    // 使用微任务来让出控制权
                    await new Promise(resolve => {
                        queueMicrotask(() => {
                            task();
                            resolve();
                        });
                    });
                } catch (error) {
                    console.error('任务执行错误:', error);
                }
            }
            
            this.isRunning = false;
        }
    }
    
    const scheduler = new TaskScheduler();
    
    // 添加不同优先级的任务
    scheduler.addTask(() => console.log('低优先级任务'), 1);
    scheduler.addTask(() => console.log('高优先级任务'), 10);
    scheduler.addTask(() => console.log('中优先级任务'), 5);
    
    // 批处理优化
    class BatchProcessor {
        constructor(batchSize = 10, delay = 100) {
            this.batch = [];
            this.batchSize = batchSize;
            this.delay = delay;
            this.timeoutId = null;
        }
        
        add(item) {
            this.batch.push(item);
            
            if (this.batch.length >= this.batchSize) {
                this.flush();
            } else if (!this.timeoutId) {
                this.timeoutId = setTimeout(() => this.flush(), this.delay);
            }
        }
        
        flush() {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
            
            if (this.batch.length > 0) {
                const currentBatch = [...this.batch];
                this.batch = [];
                
                // 使用微任务处理批次
                queueMicrotask(() => {
                    console.log('处理批次:', currentBatch);
                });
            }
        }
    }
    
    const processor = new BatchProcessor(3, 200);
    
    // 添加项目到批处理器
    setTimeout(() => {
        processor.add('项目1');
        processor.add('项目2');
        processor.add('项目3'); // 触发批处理
        processor.add('项目4');
        processor.add('项目5');
    }, 100);
    
}, 800);

// 7. 调试和监控事件循环
setTimeout(() => {
    console.log('\n' + '='.repeat(50) + '\n');
    console.log('7. 事件循环调试技巧：');
    
    console.log(`
调试技巧：
• 使用console.trace()跟踪调用栈
• Chrome DevTools的Performance面板
• 使用performance.now()测量时间
• 避免长时间运行的同步代码
• 合理使用requestAnimationFrame
• 监控内存使用情况

最佳实践：
• 将CPU密集型任务分解为小块
• 使用Web Workers处理复杂计算
• 合理使用防抖和节流
• 优化递归操作
• 注意定时器的清理
• 理解微任务和宏任务的执行时机
`);
    
    // 性能监控示例
    function performanceMonitor(fn, name) {
        return function(...args) {
            const start = performance.now();
            const result = fn.apply(this, args);
            const end = performance.now();
            console.log(`${name} 执行时间: ${(end - start).toFixed(2)}ms`);
            return result;
        };
    }
    
    // 监控一个函数的执行时间
    const monitoredFunction = performanceMonitor(
        () => {
            let sum = 0;
            for (let i = 0; i < 1000000; i++) {
                sum += i;
            }
            return sum;
        },
        '计算函数'
    );
    
    monitoredFunction();
    
}, 1200);