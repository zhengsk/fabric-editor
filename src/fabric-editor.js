import Promise from 'bluebird';
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
        return {
            currentElement: null, // 当前选中元素
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
            this.editor.renderAll();
        },

        /**
         * context 画布上小文
         */
        context() {
            return this.editor.canvas.getContext('2d');
        },

        getImageFromeURL(url, options) {
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
                this.editor.setBackgroundImage(image);
                this.renderAll();
                return image;
            });
        },

        /**
         * addImage 添加图片
         * @param {String} imgSrc  - 图片地址
         * @param {Object} options - fabric image 参数
         */
        addImage(imgSrc, options = {}, select = true) {
            return this.getImageFromeURL(imgSrc, options).then(image => {
                image.set({
                    globalCompositeOperation: 'source-atop',
                    scaleX: 1,
                    scaleY: 1,
                    top: 0,
                    left: 0,
                    opacity: 1
                });
                this.editor.add(image);
                this.setElementCenter(image);

                if (select) {
                    this.setActiveElement(image);
                }
                return image;
            });
        },

        /**
         * addText 添加文本元素
         * @param {String} text - 文字内容
         * @param {Object} options - 元素参数配置
         */
        addText(text, options = {}, select = true) {
            text = text || 'Double click to editor.';
            const opts = Object.assign({
                globalCompositeOperation: "source-atop",
                width: 380,

            }, options);

            var textElement = new fabric.Textbox(text, opts);
            this.editor.add(textElement);

            this.setElementCenter(textElement);

            if (select) {
                this.setActiveElement(textElement);
            }
            return textElement;
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
            }
        },

        /**
         * 向前一步层级
         * @param {Object} element
         */
        forwardElement(element) {
            element = element || this.getElement();
            if (element) {
                this.editor.bringForward(element);
            }
            return element;
        },

        /**
         * 置顶层级
         * @param {Object} element
         */
        frontElment(element) {
            element = element || this.getElement();
            if (element) {
                this.editor.bringToFront(element);
            }
            return element;
        },

        /**
         * 向后一步层级
         * @param {Object} element
         */
        backwardElement(element) {
            element = element || this.getElement();
            if (element) {
                this.editor.sendBackwards(element);
            }
            return element;
        },

        /**
         * 置底层级
         * @param {Object} element
         */
        backElement(element) {
            element = element || this.getElement();
            if (element) {
                this.editor.sendToBack(element);
            }
            return element;
        },

        /**
         * 设置当前元素
         * @param {Object} element - 要设置的元素
         * @param {Event} event - 事件对象
         */
        setCurrentElement(element, event) {
            this.editor.setActiveObject(element, event);
            return element;
        },

        /**
         * 获取选中元素
         * @param {Boolean} [isAll = false] - 是否返回所有
         */
        getCurrentElement(isAll = false) {
            return this.editor[isAll ? 'getActiveObjects' : 'getActiveObject']();
        },

        /**
         * 返回所有[指定类型]元素
         * @param {*} [elementType] - 元素类型
         */
        getAllElements(elementType) {
            return this.getObjects(elementType);
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
            this.editor.setActiveObject(element);
            return element
        },

        /**
         * 取消选中元素
         * @param {Object} e
         */
        unActiveElement(e) {
            this.editor.discardActiveObject(e);
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
            return this.editor.toDataURL(options);
        },

        /**
         * importTemplate 导入模板数据
         * @param {JSON} data - 模板数据
         * @param {Function} reviver - Method for further parsing of JSON elements, called after each fabric object created.
         */
        importTemplate(data, reviver) {
            return new Promise((resolve, reject) => {
                this.editor.loadFromJSON(data, resolve, reviver);
            });
        },

        /**
         * exportTemplate 导出模板数据
         */
        exportTemplate() {
            return this.editor.toJSON();
        }
    },

    mounted() {
        this.editor = new fabric.Canvas(this.$el, {
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
    }
}
Vue.component('fabric-editor', fabricEditor);

export default fabricEditor;