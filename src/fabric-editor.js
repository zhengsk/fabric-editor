import Promise from 'bluebird';
import { fabric } from 'fabric';
import Vue from 'vue';

import fabricHistory from './componets/fabric-history.js';
import fabricImage from './componets/fabric-image.js';
import fabricText from './componets/fabric-text.js';
import fabricRender from './componets/fabric-render.js';


const fabricEditor = {
    name: 'fabric-editor',
    template: '<canvas></canvas>',
    mixins: [fabricImage, fabricText, fabricHistory, fabricRender],
    props: {
        width: Number,
        height: Number,
    },

    data: () => {
        return {
            currentElement: null, // 当前选中元素
            currentPlate: null, // 当前编辑面板索引
        };
    },

    computed: {
        canvas() {
            return this.$el;
        },
    },

    methods: {

        /**
         * renderAll 重新渲染画布 fabric.renderAll 方法
         */
        renderAll() {
            this.fabric.renderAll();
        },

        /**
         * context 画布上小文
         */
        context() {
            return this.fabric.canvas.getContext('2d');
        },

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
        setPlate(imgSrc, options) {
            return this.getImageFromeURL(imgSrc, options).then(image => {
                this.context.globalCompositeOperation = "source-out";
                this.fabric.setBackgroundImage(image);
                this.renderAll();

                this.history.add('setPlate');
                return image;
            });
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
                this.makeSnapshot('set Element Center');
            }
        },

        /**
         * 向前一步层级
         * @param {Object} element
         */
        forwardElement(element) {
            element = this.getElement();
            if (element) {
                this.fabric.bringForward(element);
                this.makeSnapshot('forwardElement');
            }
            return element;
        },

        /**
         * 置顶层级
         * @param {Object} element
         */
        frontElment(element) {
            element = this.getElement();
            if (element) {
                this.fabric.bringToFront(element);
                this.makeSnapshot('frontElment');
            }
            return element;
        },

        /**
         * 向后一步层级
         * @param {Object} element
         */
        backwardElement(element) {
            element = this.getElement();
            if (element) {
                this.fabric.sendBackwards(element);
                this.makeSnapshot('backwardElement');
            }
            return element;
        },

        /**
         * 置底层级
         * @param {Object} element
         */
        backElement(element) {
            element = this.getElement();
            if (element) {
                this.fabric.sendToBack(element);
                this.makeSnapshot('backElement');
            }
            return element;
        },

        /**
         * 设置当前元素
         * @param {Object} element - 要设置的元素
         * @param {Event} event - 事件对象
         */
        setCurrentElement(element, event) {
            this.fabric.setActiveObject(element, event);
            this.renderAll();
            return element;
        },

        /**
         * 获取选中元素
         * @param {Boolean} [isAll = false] - 是否返回所有
         */
        getCurrentElement(isAll = false) {
            return this.fabric[isAll ? 'getActiveObjects' : 'getActiveObject']();
        },

        /**
         * 返回所有[指定类型]元素
         * @param {*} [elementType] - 元素类型
         */
        getAllElements(elementType) {
            return this.fabric.getObjects(elementType);
        },

        /**
         * 获取元素
         * @param {Object} [element]
         */
        getElement(element) {
            return element || this.getCurrentElement();
        },

        /**
         * 设置选中元素
         * @param {Object} element
         */
        setActiveElement(element) {
            this.fabric.setActiveObject(element);
            this.renderAll();
            return element
        },

        /**
         * 取消选中元素
         * @param {Object} e
         */
        deactiveElement(e) {
            this.fabric.discardActiveObject(e);
        },

        /**
         * 删除元素
         * @param {Object} [element] - 要删除的元素
         */
        deleteElement(element) {
            element = this.getElement();
            if (element) {
                this.fabric.remove(element);
                this.makeSnapshot('Remove element');
                return element;
            }
        },

        /**
         * 获取元素的边界位置
         *
         * @param {Object} element
         * @returns
         */
        getElementBounding(element) {
            element = element || this.currentElement;
            if (element) {
                return element.getBoundingRect();
            }
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
         * 通过索引得到元素
         * @param {Number} index - 索引
         * @returns {Object} - element
         */
        getElementFromIndex(index) {
            return this.fabric.item(index);
        },

        /**
         * 清除画布
         */
        clear() {
            this.fabric.clear();
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

        /**
         * 导入面板模板数据
         * @param {JSON} data - 模板数据
         * @param {Function} reviver - Method for further parsing of JSON elements, called after each fabric object created.
         */
        importPlate(data, reviver) {
            this.toggleSnapshot(false);
            return new Promise((resolve, reject) => {
                this.fabric.loadFromJSON(data, resolve, reviver);
            }).finally(() => {
                this.toggleSnapshot(true);
            });
        },

        importPlateString(data, reviver) {
            data = JSON.stringify(data);
            return this.importPlate(data, reviver);
        },

        exportPlate() {
            return this.fabric.toJSON();
        },

        exportPlateString() {
            return JSON.stringify(this.exportPlate());
        },

        /**
         * 导入模板数据
         * @param {JSON} data - 模板数据
         * @param {Function} reviver - Method for further parsing of JSON elements, called after each fabric object created.
         */
        importTemplate(data, plate = 0) {
            this.toggleSnapshot(false);

            if (typeof data === 'string') {
                data = JSON.parse(data);
            }

            const plates = data.plates.map(plate => {
                return Object.assign({}, plate, {
                    template: JSON.parse(plate.template)
                });
            });

            this.version = data.version;
            this.plates = plates;
            this.rendering = data.rendering;

            if (plate !== false) {
                this.currentPlate = plate;
            }

            this.toggleSnapshot(true);
        },

        /**
         * exportTemplate 导出模板数据
         */
        exportTemplate() {
            // 保存当前template
            this.plates[this.currentPlate].template = this.exportPlate();

            const plates = this.plates.map(plate => {
                return Object.assign({}, plate, {
                    template: JSON.stringify(plate.template)
                });
            });

            return JSON.stringify({
                version: this.version,
                plates: plates,
                rendering: this.rendering,
            });
        },
    },

    watch: {
        currentPlate(val, oldVal) {
            // 保存模板数据
            if (oldVal !== null) {
                this.plates[oldVal].template = this.exportPlate();
            }

            const plateDatas = this.plates[val];
            if (plateDatas.template) { // 使用模板
                this.importPlate(plateDatas.template);
            } else { // 初始编辑
                this.clear();
                this.setPlate(plateDatas.plate);
            }
        }
    },

    mounted() {
        this.fabric = new fabric.Canvas(this.$el, {
            width: this.width,
            height: this.height,
            controlsAboveOverlay: true,
            preserveObjectStacking: true,
            borderColor: 'red',
            borderScaleFactor: 90,
        });

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

        this.$on('snapshot', () => {
            this.plates[this.currentPlate].url = this.exportDataURL();
        });

        // 设置当前选中的元素
        this.fabric.on("object:selected", (e) => {
            this.currentElement = e.target;
            this.$emit('element-change', this.currentElement, 'selected');
        });

        this.fabric.on("selection:cleared", (e) => {
            this.currentElement = null;
            this.$emit('element-change', this.currentElement, 'unselected');
        });

        this.fabric.on("object:rotating", (e) => {
            this.$emit('element-change', this.currentElement, 'rotating');
        });

        this.fabric.on("object:scaling", (e) => {
            this.$emit('element-change', this.currentElement, 'scaling');
        });

        this.fabric.on("object:moving", (e) => {
            this.$emit('element-change', this.currentElement, 'moving');
        });
    }
}
Vue.component('fabric-editor', fabricEditor);

export default fabricEditor;