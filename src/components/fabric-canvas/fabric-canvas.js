import { fabric } from 'fabric';

export default {
    name: 'fabric-canvas',

    data() {
        return {
            fabric: null,
            currentElement: null,
        }
    },

    template: '<div><canvas></canvas></div>',

    props: {
        plate: {
            type: Object,
            default: {},
        },

        options: {
            type: Object,
            default: {},
        }
    },

    computed: {
        context() {
            return this.$el.firstChild.getContext('2d');
        },
    },

    methods: {
        getImageFromeURL(url, options = {}) {
            options.crossOrigin = 'Anonymous';
            return new Promise((resolve, reject) => {
                fabric.Image.fromURL(url, resolve, options);
            });
        },

        /**
         * setPlate 添加底图
         * @param {String} imgSrc - 图片地址
         * @param {Object} options - fabric image 参数
         */
        setPlate(imgSrc, options = {}) {
            // this.clear();
            return this.getImageFromeURL(imgSrc, options).then(image => {
                // this.fabric.canvas.getContext('2d').globalCompositeOperation = "source-out";
                this.fabric.setBackgroundImage(image);

                if (options.plateColor) {
                    this.setPlateColor(options.plateColor);
                }

                // this.renderAll();
                this.fabric.renderAll();
                return image;
            });
        },

        /**
         * 设置鞋面底色
         * @param {String} color - 颜色
         * @param {Object} plateIndex - 鞋面
         */
        setPlateColor(color) {
            let element = this.getAllElements('plate-color');
            if (color) {
                if(element.length) {
                    element[0].setColor(color);
                } else {
                    this.addPlateElement(color);
                }
            } else {
                if(element.length) {
                    this.deleteElement(element[0]);
                }
            }

            this.plate.plateColor = color;
            this.renderAll();
            this.makeSnapshot('plateColor change');
        },
    },

    mounted() {
        // 创建实例
        this.fabric = new fabric.Canvas(this.$el.firstChild, this.options);

        this.setPlate(this.plate.plate, {
            plateColor: this.plate.plateColor
        });

        const editor = this.$parent;
        // 设置当前选中的元素
        this.fabric.on("object:selected", (e) => {
            editor.currentElement = e.target;
            editor.$emit('element-change', editor.currentElement, 'selected');
        });

        this.fabric.on("selection:cleared", (e) => {
            editor.currentElement = null;
            editor.$emit('element-change', editor.currentElement, 'unselected');
        });

        this.fabric.on("object:rotating", (e) => {
            editor.$emit('element-change', editor.currentElement, 'rotating');
        });

        this.fabric.on("object:scaling", (e) => {
            editor.$emit('element-change', editor.currentElement, 'scaling');
        });

        this.fabric.on("object:moving", (e) => {
            editor.$emit('element-change', editor.currentElement, 'moving');
        });
    }
}