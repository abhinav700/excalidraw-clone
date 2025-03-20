import { resolve } from "path";

// console.log(config());

const JWT_SECRET= process.env.JWT_SECRET ?? "";

console.log('-------DEBUGGING------\n\n\n')
console.log(process.env.JWT_SECRET);
console.log('-------DEBUGGING------\n\n\n')

export {JWT_SECRET}