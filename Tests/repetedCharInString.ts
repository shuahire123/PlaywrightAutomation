function RepetedCharInString(str:string):void{
let result:Map<string,number>= new Map();
for(let char of str)
{
    /* if(char===" ")
    {
        continue;
    } */
    result.set(char,(result.get(char)||0)+1);
}
for(let [key,value] of result)
{
    if(value >1)
    {
        console.log(`Charchter ${key} is repeted ${value} times `);
    }
}
}
RepetedCharInString("shubham gorakh ahire");
