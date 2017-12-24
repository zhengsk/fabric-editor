import { fabric } from 'fabric';

import fabricHistory from '../fabric-history';

// Object default value.
fabric.Object.prototype.set({
    transparentCorners: false,
    borderDashArray: [3, 3],
    borderColor: '#ff0000',
    borderScaleFactor: 1,

    cornerSize: 15,
    cornerColor: '#ff0000',
    cornerStrokeColor: '#ffffff',
    cornerStyle: 'circle',
});

export default {
    name: 'fabric-canvas',

    data() {
        return {
            fabric: null,
            currentElement: null,
        }
    },

    template: '<div><canvas></canvas></div>',

    mixins: [fabricHistory],

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
        /**
         * renderAll 重新渲染画布 fabric.renderAll 方法
         */
        renderAll() {
            this.fabric.renderAll();
        },

        getImageFromeURL(url, options = {}) {
            options.crossOrigin = 'Anonymous';
            return new Promise((resolve, reject) => {
                fabric.Image.fromURL(url, resolve, options);
            });
        },

        /**
         * 获取选中元素
         * @param {Boolean} [isAll = false] - 是否返回所有
         */
        getCurrentElement(isAll = false) {
            return this.fabric[isAll ? 'getActiveObjects' : 'getActiveObject']();
        },

        /**
         * 获取元素
         * @param {Object} [element]
         */
        getElement(element) {
            return element || this.getCurrentElement();
        },

        /**
         * 返回所有[指定类型]元素
         * @param {*} [elementType] - 元素类型
         */
        getAllElements(elementType, fabric) {
            fabric = fabric || this.fabric;
            return fabric.getObjects(elementType);
        },

        /**
         * 获取元素索引值
         * @param {Object} [element]
         * @returns {Number} - 索引值
         */
        getIndexFromElement(element) {
            element = this.getElement(element);
            if (element) {
                const elements = this.getAllElements();
                for (let i = 0, j = elements.length; i < j; i++) {
                    if (element === elements[i]) {
                        return i;
                    }
                }
            }
            return null;
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
                    this.setColor(options.plateColor);
                }

                // this.renderAll();
                this.fabric.renderAll();
                return image;
            });
        },

                /**
         * 内部方法，供setPlateColor使用
         * @param {String} color
         */
        addColorElement(color) {
            color = color !== undefined ? color : this.plateColor;
            const plateColor = new fabric.PlateColor({
                globalCompositeOperation: 'source-atop',
                selectable: false,
                evented: false,
                top: 0,
                left: 0,
                width: 1000,
                height: 1000,
                fill: color,
            });

            this.fabric.insertAt(plateColor, 0);
        },

        /**
         * 设置鞋面底色
         * @param {String} color - 颜色
         * @param {Object} plateIndex - 鞋面
         */
        setColor(color) {
            let element = this.getAllElements('plate-color');
            if (color) {
                if(element.length) {
                    element[0].setColor(color);
                } else {
                    this.addColorElement(color);
                }
            } else {
                if(element.length) {
                    this.deleteElement(element[0]);
                }
            }

            this.plate.plateColor = color;
            this.renderAll();
            // this.makeSnapshot('plateColor change');
        },


        /**
         * 导出画布模板数据
         */
        exportPlate() {
            return this.fabric.toJSON();
        },

        /**
         * 导出画布模板数据字符串
         */
        exportPlateString() {
            return JSON.stringify(this.exportPlate());
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

        this.fabric.on("object:added", (e) => {
            // if (this.history.enable) {
                this.makeSnapshot('add');
            // }
        });

        this.fabric.on("object:modified", (e) => {
            // if (this.history.enable) {
                this.makeSnapshot('modify');
            // }
        });
    }
}