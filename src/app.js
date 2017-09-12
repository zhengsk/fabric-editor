import './style/index.scss';

import { fabric } from 'fabric';

console.info(fabric);

var canvas = window.canvas = new fabric.Canvas('editor', {
    controlsAboveOverlay: true,
    borderColor: 'red',
    borderScaleFactor: 90,
    preserveObjectStacking: true,
});

// Object default value.
fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: '#ff00ff',
    cornerColor: '#ff0000',
    cornerStrokeColor: '#ffffff',
    cornerStyle: 'circle',
});



import img from './assets/images/pattern.jpg';
import shoes from './assets/images/mask-shose.png';
import shoesInvert from './assets/images/mask-shose-invert.png';

// Add shose
fabric.Image.fromURL(shoes, function(oImg) {
    // canvas.globalCompositeOperation = "source-out";
    canvas.setBackgroundImage(oImg);


    // canvas.add(oImg);
    // oImg.viewportCenter();

    // Add Rect
    var rect = new fabric.Rect({
        globalCompositeOperation: 'source-atop',
        left: 0,
        top: 0,
        fill: 'red',
        width: 800,
        height: 800
    });
    canvas.centerObject(rect);
    canvas.add(rect);

    // Add pattern
    fabric.Image.fromURL(img, function(oImg) {
        oImg.set({
            globalCompositeOperation: 'source-atop',
            scaleX: 1 / 2,
            scaleY: 1 / 2,
            top: 250 / 2,
            left: 250 / 2,
        });
        canvas.add(oImg);
        oImg.viewportCenter();

        fabric.Image.fromURL(img, function(oImg) {
            oImg.set({
                globalCompositeOperation: 'source-atop',
                scaleX: 1 / 2,
                scaleY: 1 / 2,
                top: 50 / 2,
                left: 250 / 2,
            });
            canvas.add(oImg);
            // oImg.viewportCenter();
        });
    });

    // Add text
    var text = new fabric.Text('Honey,\nI\'m subtle', {
        globalCompositeOperation: 'source-atop',
        fill: '#0000FF',
        fontSize: 250,
        left: 0,
        top: 0,
        lineHeight: 1,
        originX: 'left',
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        statefullCache: true,
        scaleX: 0.4,
        scaleY: 0.4
    });
    canvas.add(text);
});


// canvas.setOverlayImage(shoesInvert, canvas.renderAll.bind(canvas), {
//     // Needed to position overlayImage at 0/0
//     originX: 'left',
//     originY: 'top'
// });


setTimeout(() => {
    // console.info(canvas.toJSON());
    console.info(canvas);
}, 2000);