const fs = require('fs');


const data = JSON.parse(fs.readFileSync('data03.json'));;
console.log(data.length);
let sum = 0;
for (let i = 0; i < data.length; i++) {
  let temp = data[i];
  // console.log(data[i]);
  for (let j = i + 1; j < data.length; j++) {
    if (temp.id === data[j].id) {
      data.splice([j], 1)
      sum++;
      console.log(temp);
    }
  }
}

console.log(sum);
console.log(data.length);
// console.log(data.length);
// let data02 = JSON.stringify(data);
// fs.writeFileSync('data03.json', data02);
