import { load } from '@tensorflow-models/coco-ssd';

const vid = document.getElementById('vid');
const btn = document.getElementById('btn');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let runInterval;
let model;
let isRun = false;
vid.width = 1280;
vid.height = 720;

async function init () {
  model = await load();
}

async function run () {
  const predictions = await model.detect(vid);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const font = '16px sans-serif';
  ctx.font = font;
  ctx.textBaseline = 'top';
  predictions.map(prediction => Object.assign({}, prediction, {rectColor: calculateRectColorByScore(prediction.score)}))
             .forEach(prediction => {
              const x = prediction.bbox[0];
              const y = prediction.bbox[1];
              const width = prediction.bbox[2];
              const height = prediction.bbox[3];
              // Draw the bounding box.
              ctx.strokeStyle = prediction.rectColor;
              ctx.lineWidth = 4;
              ctx.strokeRect(x, y, width, height);
              // Draw the label background.
              ctx.fillStyle = prediction.rectColor;
              const text = `${prediction.class}-${prediction.score}`;
              const textWidth = ctx.measureText(text).width;
              const textHeight = parseInt(font, 10); // base 10
              ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
              const xText = prediction.bbox[0];
              const yText = prediction.bbox[1];
              // Draw the text last to ensure it's on top.
              ctx.fillStyle = '#000000';
              ctx.fillText(text, xText, yText);
            });
}

function calculateRectColorByScore(score) {
  if (score > 0.9) {
    return '#00ff00';
  } else if (score > 0.7 && score <= 0.9) {
    return '#FFFF00';
  } else {
    return '#ff0000';
  }
}

function btnClick() {
  if (isRun) {
    isRun = false
    btn.innerText = 'Play';
    vid.pause();
    clearInterval(runInterval);
    return;
  };
  btn.innerText = 'Pause';
  isRun = true;
  vid.play();
  runInterval = setInterval(run, 500);
};

init();
btn.addEventListener('click', btnClick);