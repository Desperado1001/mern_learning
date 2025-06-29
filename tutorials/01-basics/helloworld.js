// 📄 hello-world.js
console.log("🎉 哇！我的第一个Node.js程序诞生了！");
console.log("今天是：", new Date().toLocaleDateString());
// 这段代码使用了 console.log() 来打印当前日期。具体来说：
// new Date() 创建一个新的日期对象，表示当前时间
// toLocaleDateString() 方法将日期转换为本地化的日期字符串格式
// 输出格式为 "今天是：YYYY/MM/DD"（具体格式会根据系统本地化设置而变）
// 这是一个简单的日期显示示例，常用于日志记录或用户界面显示。
console.log("🚀 准备开始MERN之旅！");
// 数据类型
console.log(typeof 123);
console.log(typeof "123");
console.log(typeof true);
console.log(typeof null); // object
console.log(typeof undefined); // undefined
console.log(typeof {}); // object
console.log(typeof []); // object
console.log(typeof function () {}); // function
console.log(typeof Symbol());
