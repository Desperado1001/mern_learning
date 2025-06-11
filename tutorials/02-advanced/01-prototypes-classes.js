/**
 * JavaScript原型链和类 - 面向对象编程
 * 重点：原型链机制、构造函数、ES6类语法、继承实现
 */

console.log('=== JavaScript面向对象编程 ===\n');

// 1. 原型链基础概念
console.log('1. 原型链基础：');

// 每个函数都有prototype属性
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// 在原型上添加方法
Person.prototype.sayHello = function() {
    return `Hello, I'm ${this.name}`;
};

Person.prototype.getAge = function() {
    return this.age;
};

// 创建实例
const person1 = new Person('Alice', 25);
const person2 = new Person('Bob', 30);

console.log('实例方法调用:', person1.sayHello());
console.log('原型方法共享:', person1.sayHello === person2.sayHello); // true

// 原型链查找机制
console.log('原型链查找:');
console.log('person1.name:', person1.name);              // 实例属性
console.log('person1.sayHello:', typeof person1.sayHello); // 原型方法
console.log('person1.toString:', typeof person1.toString); // Object.prototype方法

console.log('\n' + '='.repeat(50) + '\n');

// 2. 原型链继承机制
console.log('2. 原型链继承：');

// 父类构造函数
function Animal(species) {
    this.species = species;
    this.alive = true;
}

Animal.prototype.breathe = function() {
    return `${this.species} is breathing`;
};

Animal.prototype.move = function() {
    return `${this.species} is moving`;
};

// 子类构造函数
function Dog(name, breed) {
    Animal.call(this, 'Canine'); // 调用父类构造函数
    this.name = name;
    this.breed = breed;
}

// 设置原型链继承
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// 子类特有方法
Dog.prototype.bark = function() {
    return `${this.name} is barking`;
};

// 方法重写
Dog.prototype.move = function() {
    return `${this.name} the dog is running`;
};

const myDog = new Dog('Buddy', 'Golden Retriever');

console.log('继承的属性:', myDog.species);
console.log('继承的方法:', myDog.breathe());
console.log('重写的方法:', myDog.move());
console.log('子类方法:', myDog.bark());

// 原型链检查
console.log('instanceof检查:');
console.log('myDog instanceof Dog:', myDog instanceof Dog);
console.log('myDog instanceof Animal:', myDog instanceof Animal);
console.log('myDog instanceof Object:', myDog instanceof Object);

console.log('\n' + '='.repeat(50) + '\n');

// 3. ES6 Class语法
console.log('3. ES6 Class语法：');

class Vehicle {
    constructor(brand, model, year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.isRunning = false;
    }
    
    // 实例方法
    start() {
        this.isRunning = true;
        return `${this.brand} ${this.model} started`;
    }
    
    stop() {
        this.isRunning = false;
        return `${this.brand} ${this.model} stopped`;
    }
    
    // getter方法
    get info() {
        return `${this.year} ${this.brand} ${this.model}`;
    }
    
    // setter方法
    set status(running) {
        this.isRunning = running;
    }
    
    // 静态方法
    static compare(vehicle1, vehicle2) {
        return vehicle1.year - vehicle2.year;
    }
}

// 继承
class Car extends Vehicle {
    constructor(brand, model, year, doors) {
        super(brand, model, year); // 调用父类构造函数
        this.doors = doors;
    }
    
    // 方法重写
    start() {
        const result = super.start(); // 调用父类方法
        return `${result} with ${this.doors} doors`;
    }
    
    // 子类特有方法
    honk() {
        return `${this.brand} ${this.model} is honking`;
    }
}

const myCar = new Car('Toyota', 'Camry', 2022, 4);
console.log('Class实例:', myCar.info);
console.log('继承方法:', myCar.start());
console.log('子类方法:', myCar.honk());

// 静态方法调用
const anotherCar = new Car('Honda', 'Civic', 2020, 4);
console.log('静态方法比较:', Vehicle.compare(myCar, anotherCar));

console.log('\n' + '='.repeat(50) + '\n');

// 4. 私有字段和方法 (ES2022)
console.log('4. 私有字段和方法：');

class BankAccount {
    // 私有字段
    #balance = 0;
    #accountNumber;
    
    constructor(accountNumber, initialBalance = 0) {
        this.#accountNumber = accountNumber;
        this.#balance = initialBalance;
    }
    
    // 私有方法
    #validateAmount(amount) {
        return amount > 0 && typeof amount === 'number';
    }
    
    // 公共方法
    deposit(amount) {
        if (this.#validateAmount(amount)) {
            this.#balance += amount;
            return `Deposited ${amount}. New balance: ${this.#balance}`;
        }
        return 'Invalid amount';
    }
    
    withdraw(amount) {
        if (this.#validateAmount(amount) && amount <= this.#balance) {
            this.#balance -= amount;
            return `Withdrew ${amount}. New balance: ${this.#balance}`;
        }
        return 'Invalid amount or insufficient funds';
    }
    
    get balance() {
        return this.#balance;
    }
    
    get accountInfo() {
        return `Account ${this.#accountNumber}: Balance ${this.#balance}`;
    }
}

const account = new BankAccount('12345', 1000);
console.log('账户信息:', account.accountInfo);
console.log('存款操作:', account.deposit(500));
console.log('取款操作:', account.withdraw(200));
console.log('当前余额:', account.balance);

// 私有字段无法直接访问
// console.log(account.#balance); // SyntaxError

console.log('\n' + '='.repeat(50) + '\n');

// 5. Mixin模式 (多重继承的替代方案)
console.log('5. Mixin模式：');

// 创建Mixin
const Flyable = {
    fly() {
        return `${this.name} is flying`;
    },
    land() {
        return `${this.name} has landed`;
    }
};

const Swimmable = {
    swim() {
        return `${this.name} is swimming`;
    },
    dive() {
        return `${this.name} is diving`;
    }
};

// 基类
class Bird {
    constructor(name, species) {
        this.name = name;
        this.species = species;
    }
    
    eat() {
        return `${this.name} is eating`;
    }
}

// 混入功能
function mixin(target, ...sources) {
    sources.forEach(source => {
        Object.keys(source).forEach(key => {
            target.prototype[key] = source[key];
        });
    });
    return target;
}

// 创建具有多种能力的鸟类
const FlyingBird = mixin(Bird, Flyable);
const Duck = mixin(class extends Bird {}, Flyable, Swimmable);

const eagle = new FlyingBird('Eagle', 'Raptor');
const duck = new Duck('Duck', 'Waterfowl');

console.log('飞行鸟类:', eagle.fly());
console.log('水鸟游泳:', duck.swim());
console.log('水鸟飞行:', duck.fly());

console.log('\n' + '='.repeat(50) + '\n');

// 6. 工厂模式和建造者模式
console.log('6. 设计模式应用：');

// 工厂模式
class ShapeFactory {
    static createShape(type, ...args) {
        switch (type) {
            case 'circle':
                return new Circle(...args);
            case 'rectangle':
                return new Rectangle(...args);
            case 'triangle':
                return new Triangle(...args);
            default:
                throw new Error('Unknown shape type');
        }
    }
}

class Circle {
    constructor(radius) {
        this.radius = radius;
    }
    
    area() {
        return Math.PI * this.radius ** 2;
    }
}

class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    
    area() {
        return this.width * this.height;
    }
}

class Triangle {
    constructor(base, height) {
        this.base = base;
        this.height = height;
    }
    
    area() {
        return 0.5 * this.base * this.height;
    }
}

// 使用工厂创建对象
const shapes = [
    ShapeFactory.createShape('circle', 5),
    ShapeFactory.createShape('rectangle', 4, 6),
    ShapeFactory.createShape('triangle', 3, 8)
];

shapes.forEach((shape, index) => {
    console.log(`Shape ${index + 1} area:`, shape.area().toFixed(2));
});

// 建造者模式
class ComputerBuilder {
    constructor() {
        this.computer = {};
    }
    
    setCPU(cpu) {
        this.computer.cpu = cpu;
        return this;
    }
    
    setRAM(ram) {
        this.computer.ram = ram;
        return this;
    }
    
    setStorage(storage) {
        this.computer.storage = storage;
        return this;
    }
    
    setGPU(gpu) {
        this.computer.gpu = gpu;
        return this;
    }
    
    build() {
        return { ...this.computer };
    }
}

const computer = new ComputerBuilder()
    .setCPU('Intel i7')
    .setRAM('16GB')
    .setStorage('512GB SSD')
    .setGPU('RTX 3080')
    .build();

console.log('建造的电脑:', computer);

console.log('\n' + '='.repeat(50) + '\n');

// 7. 与C++面向对象对比总结
console.log('7. JavaScript OOP vs C++ OOP：');
console.log(`
特性对比：
┌─────────────────┬─────────────────┬─────────────────┐
│ 特性            │ C++             │ JavaScript      │
├─────────────────┼─────────────────┼─────────────────┤
│ 继承机制        │ 类继承          │ 原型继承        │
│ 多重继承        │ 支持            │ 通过Mixin实现   │
│ 私有成员        │ private关键字   │ #私有字段       │
│ 虚函数          │ virtual关键字   │ 自然支持重写    │
│ 构造函数        │ 类名相同        │ constructor     │
│ 静态成员        │ static关键字    │ static关键字    │
│ 抽象类          │ 纯虚函数        │ 约定俗成        │
│ 接口            │ 纯虚类          │ 约定俗成        │
└─────────────────┴─────────────────┴─────────────────┘

关键理解：
• JavaScript使用原型链实现继承
• Class语法是原型链的语法糖
• 理解原型链查找机制
• 掌握现代类特性（私有字段、静态方法）
• 灵活运用设计模式
• 注意this绑定在面向对象中的作用
`);