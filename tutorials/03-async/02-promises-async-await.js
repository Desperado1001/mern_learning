/**
 * JavaScript Promise和async/await - 现代异步编程
 * 重点：Promise原理、错误处理、并发控制、async/await最佳实践
 */

console.log('=== Promise和async/await ===\n');

// 1. Promise基础概念和状态
console.log('1. Promise基础状态：');

// Promise的三种状态：pending, fulfilled, rejected
function demonstratePromiseStates() {
    // 立即resolved的Promise
    const resolvedPromise = Promise.resolve('成功值');
    console.log('已解决的Promise:', resolvedPromise);
    
    // 立即rejected的Promise
    const rejectedPromise = Promise.reject(new Error('失败原因'));
    console.log('已拒绝的Promise:', rejectedPromise);
    
    // 异步Promise
    const pendingPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            Math.random() > 0.5 ? resolve('延迟成功') : reject(new Error('延迟失败'));
        }, 100);
    });
    
    console.log('待定的Promise:', pendingPromise);
    
    // 处理Promise结果
    pendingPromise
        .then(result => console.log('异步Promise结果:', result))
        .catch(error => console.log('异步Promise错误:', error.message));
}

demonstratePromiseStates();

// 防止未捕获的Promise拒绝
rejectedPromise.catch(() => {}); // 静默处理

console.log('\n' + '='.repeat(50) + '\n');

// 2. Promise链式调用和错误处理
setTimeout(() => {
    console.log('2. Promise链式调用：');
    
    // 模拟API调用
    function fetchUser(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (id > 0) {
                    resolve({ id, name: `用户${id}`, email: `user${id}@example.com` });
                } else {
                    reject(new Error('无效的用户ID'));
                }
            }, Math.random() * 100);
        });
    }
    
    function fetchUserPosts(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 1, title: '第一篇文章', userId },
                    { id: 2, title: '第二篇文章', userId }
                ]);
            }, Math.random() * 100);
        });
    }
    
    function fetchPostComments(postId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 1, content: '很好的文章！', postId },
                    { id: 2, content: '学到了很多', postId }
                ]);
            }, Math.random() * 100);
        });
    }
    
    // Promise链式调用
    fetchUser(1)
        .then(user => {
            console.log('获取用户:', user);
            return fetchUserPosts(user.id);
        })
        .then(posts => {
            console.log('获取文章:', posts);
            // 获取第一篇文章的评论
            return fetchPostComments(posts[0].id);
        })
        .then(comments => {
            console.log('获取评论:', comments);
        })
        .catch(error => {
            console.error('链式调用错误:', error.message);
        })
        .finally(() => {
            console.log('Promise链执行完成');
        });
        
}, 200);

// 3. Promise并发控制
setTimeout(() => {
    console.log('\n' + '='.repeat(50) + '\n');
    console.log('3. Promise并发控制：');
    
    // 模拟异步任务
    function createAsyncTask(name, delay, shouldFail = false) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldFail) {
                    reject(new Error(`${name} 失败`));
                } else {
                    resolve(`${name} 完成`);
                }
            }, delay);
        });
    }
    
    const tasks = [
        createAsyncTask('任务1', 100),
        createAsyncTask('任务2', 200),
        createAsyncTask('任务3', 150),
        createAsyncTask('任务4', 80),
        createAsyncTask('任务5', 300, true) // 这个任务会失败
    ];
    
    // Promise.all - 所有成功才成功
    console.log('=== Promise.all 演示 ===');
    const startTime1 = Date.now();
    
    Promise.all(tasks.slice(0, 4)) // 排除失败的任务
        .then(results => {
            const endTime = Date.now();
            console.log('Promise.all 成功:', results);
            console.log(`耗时: ${endTime - startTime1}ms`);
        })
        .catch(error => {
            console.log('Promise.all 失败:', error.message);
        });
    
    // Promise.allSettled - 等待所有完成，不论成败
    setTimeout(() => {
        console.log('\n=== Promise.allSettled 演示 ===');
        const startTime2 = Date.now();
        
        Promise.allSettled(tasks)
            .then(results => {
                const endTime = Date.now();
                console.log('Promise.allSettled 结果:');
                results.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        console.log(`任务${index + 1}: 成功 - ${result.value}`);
                    } else {
                        console.log(`任务${index + 1}: 失败 - ${result.reason.message}`);
                    }
                });
                console.log(`耗时: ${endTime - startTime2}ms`);
            });
    }, 100);
    
    // Promise.race - 第一个完成的结果
    setTimeout(() => {
        console.log('\n=== Promise.race 演示 ===');
        
        Promise.race(tasks.slice(0, 4))
            .then(result => {
                console.log('Promise.race 最快完成:', result);
            })
            .catch(error => {
                console.log('Promise.race 最快失败:', error.message);
            });
    }, 200);
    
}, 500);

// 4. async/await语法
setTimeout(() => {
    console.log('\n' + '='.repeat(50) + '\n');
    console.log('4. async/await 语法：');
    
    // 模拟数据库操作
    function queryDatabase(sql) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (sql.includes('SELECT')) {
                    resolve({ rows: [{ id: 1, name: '数据' }], count: 1 });
                } else if (sql.includes('INSERT')) {
                    resolve({ insertId: 123, affectedRows: 1 });
                } else {
                    reject(new Error('不支持的SQL语句'));
                }
            }, Math.random() * 100);
        });
    }
    
    // 使用async/await重写Promise链
    async function getUserData(userId) {
        try {
            console.log('开始获取用户数据...');
            
            // 并行执行多个查询
            const [userResult, postsResult] = await Promise.all([
                queryDatabase(`SELECT * FROM users WHERE id = ${userId}`),
                queryDatabase(`SELECT * FROM posts WHERE user_id = ${userId}`)
            ]);
            
            console.log('用户查询结果:', userResult);
            console.log('文章查询结果:', postsResult);
            
            // 串行执行依赖查询
            if (postsResult.count > 0) {
                const commentsResult = await queryDatabase(
                    `SELECT * FROM comments WHERE post_id = ${postsResult.rows[0].id}`
                );
                console.log('评论查询结果:', commentsResult);
            }
            
            return {
                user: userResult.rows[0],
                posts: postsResult.rows,
                message: '数据获取成功'
            };
            
        } catch (error) {
            console.error('数据获取失败:', error.message);
            throw new Error(`用户数据获取失败: ${error.message}`);
        }
    }
    
    // 调用async函数
    getUserData(1)
        .then(result => {
            console.log('最终结果:', result);
        })
        .catch(error => {
            console.error('最终错误:', error.message);
        });
        
}, 1000);

// 5. 错误处理最佳实践
setTimeout(() => {
    console.log('\n' + '='.repeat(50) + '\n');
    console.log('5. 错误处理最佳实践：');
    
    // 自定义错误类
    class APIError extends Error {
        constructor(message, statusCode, code) {
            super(message);
            this.name = 'APIError';
            this.statusCode = statusCode;
            this.code = code;
        }
    }
    
    class NetworkError extends Error {
        constructor(message) {
            super(message);
            this.name = 'NetworkError';
        }
    }
    
    // 模拟API调用
    function apiCall(endpoint, options = {}) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const random = Math.random();
                
                if (random < 0.2) {
                    reject(new NetworkError('网络连接失败'));
                } else if (random < 0.4) {
                    reject(new APIError('未授权访问', 401, 'UNAUTHORIZED'));
                } else if (random < 0.6) {
                    reject(new APIError('资源未找到', 404, 'NOT_FOUND'));
                } else {
                    resolve({ data: '成功响应', endpoint });
                }
            }, 100);
        });
    }
    
    // 错误处理包装器
    async function safeApiCall(endpoint, retries = 3) {
        let lastError;
        
        for (let i = 0; i < retries; i++) {
            try {
                const result = await apiCall(endpoint);
                console.log(`API调用成功 (尝试 ${i + 1}):`, result);
                return result;
                
            } catch (error) {
                lastError = error;
                console.log(`API调用失败 (尝试 ${i + 1}):`, error.message);
                
                // 网络错误可以重试，业务错误不重试
                if (error instanceof APIError && error.statusCode >= 400 && error.statusCode < 500) {
                    console.log('客户端错误，停止重试');
                    break;
                }
                
                // 最后一次尝试前等待
                if (i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
                }
            }
        }
        
        throw lastError;
    }
    
    // 使用错误处理包装器
    safeApiCall('/api/users')
        .then(result => {
            console.log('安全API调用成功:', result);
        })
        .catch(error => {
            if (error instanceof NetworkError) {
                console.error('网络错误:', error.message);
            } else if (error instanceof APIError) {
                console.error(`API错误 ${error.statusCode}:`, error.message);
            } else {
                console.error('未知错误:', error.message);
            }
        });
        
}, 1500);

// 6. 高级异步模式
setTimeout(() => {
    console.log('\n' + '='.repeat(50) + '\n');
    console.log('6. 高级异步模式：');
    
    // 并发限制器
    class ConcurrencyLimiter {
        constructor(limit) {
            this.limit = limit;
            this.running = 0;
            this.queue = [];
        }
        
        async add(asyncFn) {
            return new Promise((resolve, reject) => {
                this.queue.push({
                    asyncFn,
                    resolve,
                    reject
                });
                
                this.tryNext();
            });
        }
        
        async tryNext() {
            if (this.running >= this.limit || this.queue.length === 0) {
                return;
            }
            
            this.running++;
            const { asyncFn, resolve, reject } = this.queue.shift();
            
            try {
                const result = await asyncFn();
                resolve(result);
            } catch (error) {
                reject(error);
            } finally {
                this.running--;
                this.tryNext();
            }
        }
    }
    
    // 使用并发限制器
    const limiter = new ConcurrencyLimiter(2); // 最多同时运行2个任务
    
    async function heavyTask(id) {
        console.log(`任务 ${id} 开始`);
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200));
        console.log(`任务 ${id} 完成`);
        return `任务 ${id} 结果`;
    }
    
    // 添加多个任务
    const promises = [];
    for (let i = 1; i <= 6; i++) {
        promises.push(limiter.add(() => heavyTask(i)));
    }
    
    Promise.all(promises)
        .then(results => {
            console.log('所有限制任务完成:', results);
        });
    
    // 超时处理
    function withTimeout(promise, timeoutMs) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('操作超时')), timeoutMs);
        });
        
        return Promise.race([promise, timeoutPromise]);
    }
    
    // 使用超时
    const slowOperation = new Promise(resolve => {
        setTimeout(() => resolve('慢操作完成'), 2000);
    });
    
    withTimeout(slowOperation, 1000)
        .then(result => console.log('超时测试成功:', result))
        .catch(error => console.log('超时测试失败:', error.message));
        
}, 2000);

// 7. async/await vs Promise对比总结
setTimeout(() => {
    console.log('\n' + '='.repeat(50) + '\n');
    console.log('7. async/await vs Promise 对比：');
    
    console.log(`
async/await vs Promise 对比：
┌─────────────────┬─────────────────┬─────────────────┐
│ 特性            │ Promise         │ async/await     │
├─────────────────┼─────────────────┼─────────────────┤
│ 语法风格        │ 链式调用        │ 同步风格        │
│ 错误处理        │ .catch()        │ try/catch       │
│ 调试友好性      │ 较难            │ 容易            │
│ 条件执行        │ 复杂            │ 直观            │
│ 并发控制        │ Promise.all     │ Promise.all     │
│ 循环处理        │ 复杂            │ 直观            │
│ 兼容性          │ ES6+           │ ES8+            │
└─────────────────┴─────────────────┴─────────────────┘

最佳实践：
• 优先使用async/await，代码更清晰
• 并发操作使用Promise.all
• 错误处理使用try/catch包装
• 避免在循环中错误使用await
• 合理使用Promise.allSettled处理部分失败
• 实现超时和重试机制
• 注意异步函数的返回值总是Promise
`);
    
    // 常见陷阱演示
    console.log('=== 常见陷阱演示 ===');
    
    // 错误：在循环中串行执行异步操作
    async function badLoop() {
        const items = [1, 2, 3, 4, 5];
        const results = [];
        
        console.log('串行执行开始');
        const start = Date.now();
        
        for (const item of items) {
            const result = await new Promise(resolve => 
                setTimeout(() => resolve(item * 2), 100)
            );
            results.push(result);
        }
        
        console.log('串行执行结果:', results, `耗时: ${Date.now() - start}ms`);
    }
    
    // 正确：并行执行异步操作
    async function goodLoop() {
        const items = [1, 2, 3, 4, 5];
        
        console.log('并行执行开始');
        const start = Date.now();
        
        const results = await Promise.all(
            items.map(item => 
                new Promise(resolve => 
                    setTimeout(() => resolve(item * 2), 100)
                )
            )
        );
        
        console.log('并行执行结果:', results, `耗时: ${Date.now() - start}ms`);
    }
    
    badLoop().then(() => goodLoop());
    
}, 3000);