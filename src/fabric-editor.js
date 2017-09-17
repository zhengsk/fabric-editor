import { fabric } from 'fabric';
import Vue from 'vue';

const fabricEditor = {
    name: 'fabric-editor',
    template: '<canvas></canvas>',
    props: {
        width: Number,
        height: Number,
    },

    data: () => {
        return {};
    },

    computed: {
        canvas() {
            return this.$el;
        },
    },

    methods: {
        setPlate(img) {
            const self = this;
            fabric.Image.fromURL(img, function(oImg) {
                // canvas.globalCompositeOperation = "source-out";
                self.editor.setBackgroundImage(oImg);

                // Add mask
                // fabric.Image.fromURL(shoesMask, function(mask) {
                //     mask.set({
                //         // globalCompositeOperation: 'difference',
                //         scaleX: 1,
                //         scaleY: 1,
                //         top: 0,
                //         left: 0,
                //         opacity: 1
                //     });


                //     // // Add pattern
                //     // fabric.Image.fromURL(pattern, function(oImg) {
                //     //     var filter = new fabric.Image.filters.BlendImage({
                //     //         image: oImg,
                //     //         mode: 'multiply',
                //     //         alpha: 1
                //     //     });
                //     //     mask.filters.push(filter);
                //     //     mask.applyFilters();

                //     // canvas.add(mask);
                //     //     mask.viewportCenter();

                //     //     canvas.renderAll();
                //     // });
                //     // window.mask = mask;

                //     canvas.renderAll();
                // });
                self.editor.renderAll();
            });
        },

        addImage() {

        },
    },

    mounted() {
        this.editor = new fabric.Canvas(this.$el, {
            width: this.width,
            height: this.height,
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
    }
}
Vue.component('fabric-editor', fabricEditor);

export default fabricEditor;