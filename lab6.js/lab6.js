//Task 1
let a = 5;
let b= 10;

let sum = a + b;
let minus = a - b;
let multiplication = a * b;
let division = a / b;

console.log(sum);
console.log(minus);
console.log(multiplication);
console.log(division);

//Task 2

let firstName = "Іван";
let lastName = "Іванов";
let fullName = firstName +  " " + lastName;

console.log("Привіт, " + fullName + "!");

//Task 3
let age = 20;
if( age >= 18){
    console.log("Доступ дозволено")
}else
{
    console.log("Доступ заборонено")
}

//Task 4
for(let i = 0; i <= 10; i++){
    console.log(i);
}

//Task 5
function square(number) {
    return number * number;
}
console.log(square(5));

//Task 6
let fruit = ["апельсин", "банан", "виноград"];
fruit.push("манго");
console.log(fruit);