const fs = require('fs');


const data = JSON.parse(fs.readFileSync('clinic(0-435).json'));
// const data1 = JSON.parse(fs.readFileSync('Thammyvien(0-346).json'));
// const data2 = JSON.parse(fs.readFileSync('Thammyvien(347-440).json'));
// let data = data1.concat(data2);
console.log(data.length);

let sum = 0;
for (let i = 0; i < data.length; i++) {
  let temp = data[i];
  // console.log(data[i]);
  for (let j = i + 1; j < data.length; j++) {
    if (temp.id === data[j].id) {
      data.splice([j], 1)
      sum++;
    }
  }
}

console.log(sum);
console.log(data.length);

let saveData = JSON.stringify(data);
fs.writeFileSync('data(clinic).json', saveData);
