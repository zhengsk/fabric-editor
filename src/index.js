import './style/index.scss';
import Vue from 'vue';
import fabricEditor from './fabric-editor.js';

import plate from './assets/images/plate.png';
import pattern from './assets/images/pattern.jpg';

window.onload = () => {
    const editor = new Vue({
        el: '#app',
        data: () => {
            return {};
        },

        computed: {
            editor() {
                return this.$refs.editor;
            }
        },

        components: {
            fabricEditor
        },

        mounted() {
            console.info('App mouted');
            // debugger;
            this.editor.setPlate(plate);
            this.editor.addImage(pattern, {
                width: 500,
                height: 500
            });
        },
    });

    window.editor = editor.editor;

    window.exportTemplate = () => {
        console.info(JSON.stringify(window.editor.exportTemplate()));
    }

    window.importTemplate = () => {
        window.editor.importTemplate({ "objects": [{ "type": "image", "originX": "left", "originY": "top", "left": 103.5, "top": 433.5, "width": 500, "height": 500, "fill": "rgb(0,0,0)", "stroke": null, "strokeWidth": 0, "strokeDashArray": null, "strokeLineCap": "butt", "strokeLineJoin": "miter", "strokeMiterLimit": 10, "scaleX": 0.54, "scaleY": 0.54, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "clipTo": null, "backgroundColor": "", "fillRule": "nonzero", "globalCompositeOperation": "source-atop", "transformMatrix": null, "skewX": 0, "skewY": 0, "crossOrigin": "", "cropX": 0, "cropY": 0, "src": "http://localhost:8081/assets/a329837c3c707b7c4469fd7d433cbc7c.jpg", "filters": [] }, { "type": "image", "originX": "left", "originY": "top", "left": 742.87, "top": 433.71, "width": 500, "height": 500, "fill": "rgb(0,0,0)", "stroke": null, "strokeWidth": 0, "strokeDashArray": null, "strokeLineCap": "butt", "strokeLineJoin": "miter", "strokeMiterLimit": 10, "scaleX": 0.53, "scaleY": 0.53, "angle": 151.82, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "clipTo": null, "backgroundColor": "", "fillRule": "nonzero", "globalCompositeOperation": "source-atop", "transformMatrix": null, "skewX": 0, "skewY": 0, "crossOrigin": "", "cropX": 0, "cropY": 0, "src": "http://localhost:8081/assets/a329837c3c707b7c4469fd7d433cbc7c.jpg", "filters": [] }, { "type": "image", "originX": "left", "originY": "top", "left": 403, "top": 564, "width": 500, "height": 500, "fill": "rgb(0,0,0)", "stroke": null, "strokeWidth": 0, "strokeDashArray": null, "strokeLineCap": "butt", "strokeLineJoin": "miter", "strokeMiterLimit": 10, "scaleX": 0.9, "scaleY": 0.55, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "clipTo": null, "backgroundColor": "", "fillRule": "nonzero", "globalCompositeOperation": "source-atop", "transformMatrix": null, "skewX": 0, "skewY": 0, "crossOrigin": "", "cropX": 0, "cropY": 0, "src": "http://localhost:8081/assets/a329837c3c707b7c4469fd7d433cbc7c.jpg", "filters": [] }, { "type": "textbox", "originX": "left", "originY": "top", "left": 431.5, "top": 629.9, "width": 380, "height": 45.2, "fill": "rgb(0,0,0)", "stroke": null, "strokeWidth": 1, "strokeDashArray": null, "strokeLineCap": "butt", "strokeLineJoin": "miter", "strokeMiterLimit": 10, "scaleX": 1, "scaleY": 1, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "clipTo": null, "backgroundColor": "", "fillRule": "nonzero", "globalCompositeOperation": "source-atop", "transformMatrix": null, "skewX": 0, "skewY": 0, "text": "Double click to editor.", "fontSize": 40, "fontWeight": "normal", "fontFamily": "Times New Roman", "fontStyle": "normal", "lineHeight": 1.16, "underline": false, "overline": false, "linethrough": false, "textAlign": "center", "textBackgroundColor": "", "charSpacing": 0, "minWidth": 20, "styles": {} }, { "type": "textbox", "originX": "left", "originY": "top", "left": 811.91, "top": 340.2, "width": 338.43, "height": 45.2, "fill": "#FFFFFF", "stroke": null, "strokeWidth": 1, "strokeDashArray": null, "strokeLineCap": "butt", "strokeLineJoin": "miter", "strokeMiterLimit": 10, "scaleX": 1, "scaleY": 1, "angle": 84.85, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "clipTo": null, "backgroundColor": "", "fillRule": "nonzero", "globalCompositeOperation": "source-atop", "transformMatrix": null, "skewX": 0, "skewY": 0, "text": "I'm love it. 很好！", "fontSize": 40, "fontWeight": "normal", "fontFamily": "Times New Roman", "fontStyle": "normal", "lineHeight": 1.16, "underline": false, "overline": false, "linethrough": false, "textAlign": "center", "textBackgroundColor": "", "charSpacing": 0, "minWidth": 20, "styles": {} }], "backgroundImage": { "type": "image", "originX": "left", "originY": "top", "left": 0, "top": 0, "width": 1000, "height": 1000, "fill": "rgb(0,0,0)", "stroke": null, "strokeWidth": 0, "strokeDashArray": null, "strokeLineCap": "butt", "strokeLineJoin": "miter", "strokeMiterLimit": 10, "scaleX": 1, "scaleY": 1, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "clipTo": null, "backgroundColor": "", "fillRule": "nonzero", "globalCompositeOperation": "source-over", "transformMatrix": null, "skewX": 0, "skewY": 0, "crossOrigin": "", "cropX": 0, "cropY": 0, "src": "http://localhost:8081/assets/82d6651dbb8fa4b7aa4ec21230ed2acb.png", "filters": [] } });
    }

    window.addImage = () => {
        window.editor.addImage(pattern, {
            width: 500,
            height: 500
        });
    }

    window.addText = () => {
        window.editor.addText();
    }
}