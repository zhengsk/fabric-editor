import { fabric } from 'fabric';

import fabricHistory from '../fabric-history';
import fabricImage from '../fabric-image';
import fabricText from '../fabric-text';

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

    mixins: [fabricHistory, fabricImage, fabricText],

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
        fireChange() {
            // Emit change.
            this.$emit('canvas-change', ...arguments);
        },

        /**
         * renderAll 重新渲染画布 fabric.renderAll 方法
         */
        renderAll() {
            this.fabric.renderAll();
        },

        /**
         * 获取图片
         * @param {String} url
         * @param {*} options
         */
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
         * 设置元素画布居中
         * @param {*} element
         */
        setElementCenter(element) {
            const ele = element || this.getCurrentElement();
            if (ele) {
                ele.center();
                ele.setCoords();

                this.fireChange();
            }
        },

        /**
         * 设置选中元素
         * @param {Object} element
         */
        setActiveElement(element) {
            this.fabric.setActiveObject(element);
            this.renderAll();
            return element;
        },

        /**
         * 获取元素的边界位置
         *
         * @param {Object} element
         * @returns
         */
        getElementBounding(element) {
            element = element || this.currentElement || this.getCurrentElement();
            if (element) {
                element.setCoords();
                const bounding = element.getBoundingRect();
                bounding.centerX = bounding.left + bounding.width / 2;
                bounding.centerY = bounding.top + bounding.height / 2;
                return bounding;
            } else {
                return false;
            }
        },


        /**
         * setPlate 添加底图
         * @param {String} imgSrc - 图片地址
         * @param {Object} options - fabric image 参数
         */
        setPlate(imgSrc, options = {}) {
            return this.getImageFromeURL(imgSrc, options).then(image => {
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
            this.fireChange('plateColor change');
        },



        /**
         * 导入面板模板数据
         * @param {JSON} data - 模板数据
         * @param {Function} reviver
         */
        importTemplate(data, reviver) {
            // this.toggleSnapshot(false);
            return new Promise((resolve, reject) => {
                this.fabric.loadFromJSON(data, resolve, reviver);
            }).finally(() => {
                // this.toggleSnapshot(true);
            });
        },

        importTemplateString(data, reviver) {
            data = JSON.stringify(data);
            return this.importTemplate(data, reviver);
        },

        /**
         * 导出画布模板数据
         */
        exportTemplate() {
            return this.fabric.toJSON();
        },

        /**
         * 导出画布模板数据字符串
         */
        exportTemplateString() {
            return JSON.stringify(this.exportTemplate());
        },

        /**
         * 保存模板数据
         */
        saveTemplate() {
            this.plate.template = this.exportTemplate();
        },

        /**
         * Exports canvas element to a dataurl image. Note that when multiplier is used, cropping is scaled appropriately
         * @param {Object} [options] Options object
         * @param {String} [options.format=png] The format of the output image. Either "jpeg" or "png"
         * @param {Number} [options.quality=1] Quality level (0..1). Only used for jpeg.
         * @param {Number} [options.multiplier=1] Multiplier to scale by
         * @param {Number} [options.left] Cropping left offset.
         * @param {Number} [options.top] Cropping top offset.
         * @param {Number} [options.width] Cropping width.
         * @param {Number} [options.height] Cropping height.
         * @return {String} Returns a data: URL containing a representation of the object in the format specified by options.format
         */
        exportDataURL(options) {
            return this.fabric.toDataURL(options);
        },
    },

    mounted() {
        // 创建实例
        this.fabric = new fabric.Canvas(this.$el.firstChild, this.options);

        const datas = this.plate;

        // 初始化
        if (datas.template) { // 使用模板
            this.importTemplate(datas.template);
        } else { // 初始编辑
            this.setPlate(datas.plate, {
                plateColor: datas.plateColor
            });
        }

        const editor = this.$parent;

        // 设置当前选中的元素
        this.fabric.on("object:selected", (e) => {
            this.currentElement = e.target;
            editor.$emit('element-change', this.currentElement, 'selected');
        });

        this.fabric.on("selection:cleared", (e) => {
            this.currentElement = null;
            editor.$emit('element-change', this.currentElement, 'unselected');
        });

        this.fabric.on("object:rotating", (e) => {
            editor.$emit('element-change', this.currentElement, 'rotating');
        });

        this.fabric.on("object:scaling", (e) => {
            editor.$emit('element-change', this.currentElement, 'scaling');
        });

        this.fabric.on("object:moving", (e) => {
            editor.$emit('element-change', this.currentElement, 'moving');
        });


        // Change for canvas and history.
        this.fabric.on("object:added", (e) => {
            // if (this.history.enable) {
            //     this.makeSnapshot('add');
            // }
            editor.$emit('element-change', editor.currentElement, 'added');

            this.fireChange('added');
        });

        this.fabric.on("object:modified", (e) => {
            // if (this.history.enable) {
            //     this.makeSnapshot('modify');
            // }

            this.fireChange('modified');
        });




        // Bind fabric change.
        this.$on('canvas-change', () => {

            clearTimeout(this.timeout);

            // Delay 300ms.
            this.timeout = setTimeout(() => {
                if (this.fabric.size()) {
                    this.plate.url = this.exportDataURL();
                } else {
                    this.plate.url = null;
                }

                editor.$emit('snapshot', ...arguments);

                console.info('canvas change');
            }, 300);
        });
    }
}