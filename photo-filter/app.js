// Variables
const fullscreen = document.querySelector('.fullscreen');
const html = document.documentElement;
const filters = document.querySelectorAll('.filters input');
let filtersValues = [];
let image = document.querySelector('img');
let root = document.querySelector(':root');
const labels = document.querySelectorAll('label');
const results = document.querySelectorAll('output');
const resetBtn = document.querySelector('.btn-reset');
const nextPicBtn = document.querySelector('.btn-next');
const loadPic = document.querySelector('.btn-load--input');
const imageContainer = document.querySelector('.img-cont');
const canvas = document.querySelector('canvas');
const savePic = document.querySelector('.btn-save');
let dataURL = canvas.toDataURL("image/jpeg");
let date = new Date();
let hours = date.getHours();
let iterator = '1';
console.log(dataURL);

filters.forEach((filter, index) => {
  filtersValues.push(filter.value);
});
console.log(html.style);
//
// Event listeners
//


labels.forEach((label, index) => {
  label.addEventListener('input', (e) => {
    results[index].value = filters[index].value;
  });
});
filters.forEach(filter => {
  filter.addEventListener('input', applyFilter);
});
resetBtn.addEventListener('click', resetPicture);
nextPicBtn.addEventListener('click', nextPicture);
loadPic.addEventListener('change', loadPicture);
savePic.addEventListener('mouseover', drawImage);
savePic.addEventListener('click', savePicture);
//
// Functions
//

function savePicture() {
  console.log(canvas.toDataURL());
  let link = document.createElement('a');
  link.download = 'download.png';
  link.href = canvas.toDataURL();
  link.click();
  link.delete;
}

function applyFilter() {
  filters.forEach(filter => {
    root.style.setProperty(`--${filter.getAttribute('name')}`, `${filter.value}${filter.getAttribute('data-sizing')}`);
  });
}

function nextPicture() {
  let dayPeriod;
  if (hours >= 6 && hours < 12) {
    dayPeriod = 'morning';
  } else if (hours >= 12 && hours < 18) {
    dayPeriod = 'day';
  } else if (hours >= 18 && hours < 24) {
    dayPeriod = 'evening';
  } else if (hours >= 0 && hours < 6) {
    dayPeriod = 'night';
  }
  if (iterator < 10) {
    iterator = `0${iterator}`;
  } else if (iterator > 20) {
    iterator = '01';
  }
  let url = `https://github.com/rolling-scopes-school/stage1-tasks/blob/assets/images/${dayPeriod}/${iterator}.jpg?raw=true`;
  image.src = url;
  iterator = +iterator;
  iterator++;
  console.log(iterator);
}

function resetPicture() {
  labels.forEach((label, index) => {
    filters[index].value = filtersValues[index];
    results[index].value = filters[index].value;
    root.style.setProperty(`--${filters[index].getAttribute('name')}`, `${filters[index].value}${filters[index].getAttribute('data-sizing')}`);
  });
}

function loadPicture() {
  const file = loadPic.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    image.src = img.src;
  };
  reader.readAsDataURL(file);
}

function fullScreen(element) {
  if(element.requestFullscreen) {
      element.requestFullscreen();
  } else if(element.webkitrequestFullscreen) {
      element.webkitRequestFullscreen();
  } else if(element.mozRequestFullscreen) {
      element.mozRequestFullScreen();
  }
}
function fullScreenCancel() {
  if(document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
}
fullscreen.addEventListener('click', (e) => {
  fullScreen(html);
  fullScreenCancel();
});

function drawImage() {
  const img = new Image();
  const blurCoef = image.naturalHeight / image.height;
  let filterStr = window.getComputedStyle(image).filter;
  const blurValue = filterStr.slice(5, 6);
  filterStr = filterStr.replace(/blur.\dpx./, `blur(${blurValue * blurCoef}px)`);
  console.log(blurValue * blurCoef);
  img.setAttribute('crossOrigin', 'anonymous'); 
  img.src = image.src;
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.filter = filterStr;
    ctx.drawImage(img, 0, 0);
  };  
}
