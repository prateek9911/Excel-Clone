
 function infixEvaluation(exp){
    let values = [];
    let operators = [];
    
    let i = 0;
    while(i!=exp.length){
       let ch = exp.charAt(i);
       console.log(i+"  " + ch + "\\");
       let x = parseInt(ch); 
       
       
       if(ch == '('){
           let str ="";
           i++;
           while(exp.charAt(i)!=')'){
               ch = exp.charAt(i);
               str+=ch;
               i++;
           }
           values.push(infixEvaluation(str));
       }
       
       else{
       if(0<=x && x<=9){
           values.push(x-48);
       } 
       
       else if(ch == '+' || ch == '-' ||ch ==  '*' ||ch ==  '/'){
           if(operators.length==0){
               operators.push(ch);
               
           }
           
           else if(ch=='+' ||ch== '-'){
               if(operators[operators.length-1] == '*' || operators[operators.length-1] == '/'){
                   let op = operators.pop();
                   let a = parseInt(values.pop());
                   let b = parseInt(values.pop());
                   if(op=='*'){
                       let c = b*a;
                       values.push(c);
                   }else{
                       let c = b/a;
                       values.push(c);
                   }
                   

               }   
               operators.push(ch);
           }else if(ch=='/' || ch=='*'){
               if(operators[operators.length-1] == '*' || operators[operators.length-1] == '/'){
                   let op = operators.pop();
                   let a = parseInt(values.pop());
                   let b = parseInt(values.pop());
                   if(op=='*'){
                       let c = b*a;
                       values.push(c);
                   }else{
                       let c = b/a;
                       values.push(c);
                   }
           }
           operators.push(ch);
       }
    }
   
}

i++;
   }
while(operators.length!=0){
   let op = operators.pop();
   let a = parseInt(values.pop());
   let b = parseInt(values.pop());
   if(op=='*'){
       let c = b*a;
       values.push(c);
   }
   if(op=='+'){
       let c = b+a;
       values.push(c);
   }if(op=='-'){
       let c = b-a;
       values.push(c);
   }
   if(op=='/'){
       let c = b/a;
       values.push(c);
   }
}

let ans = values[values.length-1]; 
return ans;

}
let str = "10 + 20"
let a = infixEvaluation(str);
console.log(a);