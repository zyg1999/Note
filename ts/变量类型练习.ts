//类型注解 若传入参数与指定参数类型或个数不符会报错
function greeter(person:string){//给person函数的参数添加: string类型注解
    return 'Hello'+person;
}
let user ='Mike';
document.body.innerHTML=greeter(user);

//接口
//使用接口来描述一个拥有firstName和lastName字段的对象,两个类型内部的结构兼容那么这两个类型就是兼容的
interface Person{
    firstName:String,
    lastName:string
}
function greeter(person:Person){
    return 'Hello,'+person.firstName+" "+person.lastName;
}
let user={firstName:"Jane",lastName:'User'};
document.body.innerHTML=greeter(user);

//类
class Student{
    fullName:string;
    constructor(public firstName:string,public middleInitial:string,public lastName:string){//在构造函数的参数上使用public等同于创建了同名的成员变量
        this.fullName=firstName+" "+middleInitial+" "+lastName;
        console.log(this.fullName);
    }
}
interface Person{
    firstName:string;
    lastName:string;
}
function greeter(person:Person){
    return "Hello,"+person.firstName+" "+person.lastName;
}
let user=new Student("Jane","M·","user");
document.body.innerHTML=greeter(user);

let o={
    a:'1',
    b:2
}
//对象解构指定类型
let {a, b}: {a: string, b: number} = o;

//默认值  在属性为undefined时使用默认值
function keepWholeObject(wholeObject: { a: string, b?: number }) {
    let { a, b = 1001 } = wholeObject;
}


//接口
interface LableeldValue{
    lable:string;
}

function printfLable(lableledObj:LableeldValue){
    console.log(lableledObj.lable);
}

let myObj={size:10,lable:'lalala'};
printfLable(myObj);

//可选属性 在可选属性名字定义后加？
interface SquareConfig{
    width:number;
    color?:string;
}
function creatSquaer(config:SquareConfig):{color:string;area:number}{
    let newSquare = {color:"black",area:100};
    if(config.color){
        newSquare.color=config.color;
    }
    if(config.width){
        newSquare.area=config.width*config.width;
    }
    return newSquare;
}
let mySquare=creatSquaer({width:20});

//只读属性 readonly
interface myreadOnly{
    readonly a:number;
    b:number;
}
let p:myreadOnly={a:1,b:2};
p.a=5;//error
//最简单判断该用readonly还是const的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用const，若做为属性则使用readonly

//额外属性检查
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    let newSquare = {color:"black",area:100};
    if(config.color){
        newSquare.color=config.color;
    }
    if(config.width){
        newSquare.area=config.width*config.width;
    }
    return newSquare;
}

let mySquare = createSquare({ colour: "red", width: 100 });