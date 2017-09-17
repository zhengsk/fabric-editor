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



import shoes from './assets/images/shoes.png';
import shoesMask from './assets/images/shoes-mask.png';
import pattern from './assets/images/xx.png';

// Add shose
fabric.Image.fromURL(shoes, function(oImg) {
    // canvas.globalCompositeOperation = "source-out";
    canvas.setBackgroundImage(oImg);

    // Add mask
    fabric.Image.fromURL(shoesMask, function(mask) {
        mask.set({
            // globalCompositeOperation: 'difference',
            scaleX: 1,
            scaleY: 1,
            top: 0,
            left: 0,
            opacity: 1
        });

        window.mask = mask;

        // // Add pattern
        // fabric.Image.fromURL(pattern, function(oImg) {
        //     var filter = new fabric.Image.filters.BlendImage({
        //         image: oImg,
        //         mode: 'multiply',
        //         alpha: 1
        //     });
        //     mask.filters.push(filter);
        //     mask.applyFilters();

        canvas.add(mask);
        //     mask.viewportCenter();

        //     canvas.renderAll();
        // });
        // window.mask = mask;

        canvas.renderAll();
    });
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