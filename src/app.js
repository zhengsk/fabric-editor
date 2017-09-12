import './style/index.scss';

import { fabric } from 'fabric';

console.info(fabric);

var canvas = new fabric.Canvas('editor', {
    controlsAboveOverlay: true,
    borderColor: 'red',
    borderScaleFactor: 90,
});

fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: '#ff00ff',
    cornerColor: '#ff0000',
    cornerStyle: 'circle',
});

var rect = new fabric.Rect({
    left: 0,
    top: 0,
    fill: 'red',
    width: 800,
    height: 800
});

canvas.centerObject(rect);

import img from './assets/images/pattern.jpg';
import imgInvert from './assets/images/mask-shose-invert.png';

fabric.Image.fromURL(img, function(oImg) {
    oImg.set({
        scaleX: 1 / 2,
        scaleY: 1 / 2,
        top: 250 / 2,
        left: 250 / 2,
    });
    canvas.add(oImg);

    oImg.viewportCenter();
});

canvas.setOverlayImage(imgInvert, canvas.renderAll.bind(canvas), {
    // Needed to position overlayImage at 0/0
    originX: 'left',
    originY: 'top'
});


canvas.add(rect);


setTimeout(() => {
    // console.info(canvas.toJSON());
    console.info(canvas);
}, 2000);