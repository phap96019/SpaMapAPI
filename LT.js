const LocationAround = (point) => {
  const P = 40075 //chu vi trái đất 40.075km
  const T = 360 / P //Mỗi góc alpha ứng với 1km => cứ mỗi 1km kinh-vĩ tuyến thì gốc alpha sẽ lệch đi T°
  const Space = 2 //Khoảng cách giữa 2 điểm cần tìm 2km => Bán kính quét bằng 1
  const A = {
    lat: point.lat + 20 * T,
    lng: point.lng - 20 * T,
  }
  //Hàm này trả về tọa độ chuẩn nếu vĩ độ hoặc lnginh độ vượt quá mức trong tính toán
  function realPoint(point) {
    if (point.lat > 90) point.lat = 180 - point.lat;
    if (point.lat < -90) point.lat = -180 - point.lat;
    if (point.lng > 180) point.lng = 360 - point.lng;
    if (point.lng < -180) point.lng = 360 + point.lng;
    point.lat = Number(point.lat.toFixed(7));
    point.lng = Number(point.lng.toFixed(7));
    return point;
  }
  realPoint(A); //Chuyển lại tọa độ chuẩn nếu sai
  let arr = [];
  //Từ A tìm các tọa độ còn lại, duyệt từ trái qua phải, từ trên xuống dưới
  for (let i = 0; i < 2 * 20 / Space + 1; i++) {
    for (let j = 0; j < 2 * 20 / Space + 1; j++) {
      arr.push({
        lat: A.lat - (Space * i * T),
        lng: A.lng + (Space * j * T)
      });
    }
  }
  arr.map((point) => {
    realPoint(point);
  })
  return arr;
}

function initMap() {

}

function exportToJsonFile(jsonData) {
  let dataStr = JSON.stringify(jsonData);
  let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  let exportFileDefaultName = 'data.json';
  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

function ShowMap() {

  let point = { lat: 10.8155068, lng: 106.4284086 };
  const lat = document.getElementById('lat').value;
  const lng = document.getElementById('lng').value;
  point.lat = Number(lat);
  point.lng = Number(lng);
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: point,
  });
  // The marker, positioned at point
  //Tọa độ đưa vào

  const marker = new google.maps.Marker({
    position: point,
    map: map,
  });

  const arr = LocationAround(point);
  // arr.map((point) => {
  //   const marker = new google.maps.Marker({
  //     position: point,
  //     map: map,
  //   });
  // })

  //TẠO HÌNH VUÔNG .........................................
  const triangleCoords = [];
  triangleCoords.push(arr[0]);
  triangleCoords.push(arr[20]);
  triangleCoords.push(arr[440]);
  triangleCoords.push(arr[420]);

  // Construct the polygon.
  const bermudaTriangle = new google.maps.Polygon({
    paths: triangleCoords,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
  });
  bermudaTriangle.setMap(map);
}

function Download() { //Download file json gồm các địa điểm hình vuông
  let point = { lat: 10.8155068, lng: 106.4284086 };
  const lat = document.getElementById('lat').value;
  const lng = document.getElementById('lng').value;
  point.lat = Number(lat);
  point.lng = Number(lng);
  const arr = LocationAround(point);
  exportToJsonFile(arr);
}

const getLocations = async (point) => {
  const token = 'EAAAAZAw4FxQIBAPM6xR994iZB7IsjvPQw81dwh5ROyZBK0tOmTgySBKwL9C2V2tDlnGvrl0wHTZCzjzHo37PahaSpdaN4IYv5a4J1uCGPH3ZB0yxC9nL0tKiU75qZAtfZCR1pkJBv3LuqXnzsMp2B1Gq62vpEeATZA0akWeetwqouQZDZD'
  const lat = point.lat
  const lng = point.lng;
  const distance = 1500;
  const limit = 100;
  const url = `https://graph.facebook.com/v8.0/search?type=place&access_token=${token}&q="clinic"&fields=name,checkins,website,page{id,fan_count,name,link,about,location{city,latitude,longitude,street},phone}&center=${lat},${lng}&distance=${distance}&limit=${limit}`
  let result = await fetch(url)
    .then(response => response.json())
    .then(data => {
      let result = data.data;
      return result;
    })
    .catch(function (error) {
      throw error;
    });
  return (result);
}

const CheckLocation = async (point) => { //Tìm kiếm các địa điểm xung quanh
  //Show MAP 

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: point,
  });

  const locationsSpa = await getLocations(point);
  const marker = new google.maps.Marker({
    position: point,
    map: map,
  });
  // Xuất ra danh sách chỉ gồm có vị trí
  // const a = locationsSpa.map((point) => {
  //   return {
  //     lat: point.page.location.latitude,
  //     lng: point.page.location.longitude,
  //   }
  // });
  // a.map((point) => {
  //   const marker = new google.maps.Marker({
  //     position: point,
  //     map: map,
  //   });
  // })
  return locationsSpa;
}


const AllSpaInOnePoint = async () => { //Hiển thị các spa xung quanh point
  let point = { lat: 10.8155068, lng: 106.4284086 };
  const lat = document.getElementById('lat').value;
  const lng = document.getElementById('lng').value;
  point.lat = Number(lat);
  point.lng = Number(lng);
  //==CHECK==
  point = { lat: 10.8155068, lng: 106.5904086 };
  //==Check==
  const locationsSpa = await CheckLocation(point);
}

// const AllSpa = async (point) => {
//   let pointTest = { lat: 10.8155068, lng: 106.4284086 };
//   const arr = LocationAround(pointTest);
//   console.log(arr);
//   //Với mỗi point quét spa 
//   let allSpa = [];
//   for (let i = 0; i < arr.length; i++) {
//     let point = arr[i];
//     // const spas = await getLocations(point);
//     // console.log(`Các spa tại địa điểm: ${i} là ${spas}`);
//     // for (let j = 0; j < spas.length; j++) {
//     //   allSpa.push(spas[j]);
//     // }
//   }
//   return allSpa;
// }
async function CheckAllLocationSpa() {
  let point = { lat: 10.800140, lng: 106.693650 };
  // const lat = document.getElementById('lat').value;
  // const lng = document.getElementById('lng').value;
  // point.lat = Number(lat);
  // point.lng = Number(lng);
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: point,
  });
  // The marker, positioned at point
  //Tọa độ đưa vào

  const marker = new google.maps.Marker({
    position: point,
    map: map,
  });

  const arr = LocationAround(point);
  // arr.map((point) => {
  //   const marker = new google.maps.Marker({
  //     position: point,
  //     map: map,
  //   });
  // })

  //TẠO HÌNH VUÔNG .........................................
  const triangleCoords = [];
  triangleCoords.push(arr[0]);
  triangleCoords.push(arr[20]);
  triangleCoords.push(arr[440]);
  triangleCoords.push(arr[420]);

  // Construct the polygon.
  const bermudaTriangle = new google.maps.Polygon({
    paths: triangleCoords,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
  });
  bermudaTriangle.setMap(map);

  const data = await fetch('./Data/Data().json')
    .then(response => response.json())
    .then(jsonResponse => { return jsonResponse })
  // const data = data1.concat(data2).concat(data3).concat(data4).concat(data5);
  // Xuất ra danh sách chỉ gồm có vị trí
  const a = data.map((point) => {
    return {
      lat: point.page.location.latitude,
      lng: point.page.location.longitude,
    }
  });
  a.map((point) => {
    const marker = new google.maps.Marker({
      position: point,
      map: map,
    });
  })
  console.log(data);
}


const AllSpa = async (point) => {
  let pointTest = { lat: 10.800140, lng: 106.693650 };
  const arr = LocationAround(pointTest);
  //Với mỗi point quét spa 
  let allSpa = [];
  for (let i = 436; i < arr.length; i++) {
    setTimeout(async () => {
      let point = arr[i];
      let spas = await getLocations(point);
      console.log(`Các spa tại địa điểm: ${i}`);
      console.log(spas);

      for (let j = 0; j < spas.length; j++) {
        allSpa.push(spas[j]);
      }
      console.log(allSpa);
    }, (i - 436) * 10000)
  }
  setTimeout(async () => {
    exportToJsonFile(allSpa);
  }, 10000 * 450);
}

// const DownloadAllSPa = async () => {
//   const data = await AllSpa();
//   console.log('data la: ....');
//   console.log(data);
// }