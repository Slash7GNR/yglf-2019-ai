import { load } from '@tensorflow-models/coco-ssd';

const vid = document.getElementById('vid');
const title = document.getElementById('title');
const btn = document.getElementById('btn');
let model;
vid.width = 100;
vid.height = 100;

async function init () {

  // Load the model.
  model = await load();
}

init();

function write (str) {
  title.innerText = str;
}

async function run () {

  // Classify the image.
  const predictions = await model.detect(vid);

  var allPredictionClasses = [];
  for (var i=0;i<predictions.length; i++) {
    if (predictions[i] && predictions[i].class) {
      allPredictionClasses.push(predictions[i].class); 
    }
  }

  if (allPredictionClasses.length > 0) {
    write(allPredictionClasses.join(','));
  }

  // console.log('Predictions: ');
  // console.log(predictions);
  // if (predictions[0] && predictions[0].class) {
  //   write(predictions[0].class)
  // }

}

let isRun = false;
function btnClick() {
  if (isRun) return;
  isRun = true;
  btn.setAttribute('style', 'display: none');
  vid.play();
  setInterval(run, 100);
};
btn.addEventListener('click', btnClick);