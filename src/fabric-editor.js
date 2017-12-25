import Promise from 'bluebird';
import { fabric } from 'fabric';
import Vue from 'vue';

import './components/fabric-plate-color';
import fabricRender from './components/fabric-render';
import fabricCanvas from './components/fabric-canvas/fabric-canvas';

const fabricEditor = {
    name: 'fabric-editor',
    template: `
        <div>
            <fabric-canvas
                v-if="plates.length"
                v-for="(plate, index) in plates"
                v-show="currentPlate === index"
                ref="fabric"
                :plate="plate"
                :options="fabricOptions"
                :key="index"
            ></fabric-canvas>
        </div>
    `,
    mixins: [fabricRender],
    props: {
        width: Number,
        height: Number,
    },

    data: () => {
        return {
            currentElement: null, // 当前选中元素
            currentPlate: null, // 当前编辑面板索引

            plates: [], // 所有鞋面面板
        };
    },

    components: {
        'fabric-canvas': fabricCanvas,
    },

    computed: {
        // 所有fabricCanvas实例
        allFabricCanvas() {
            return this.$refs.fabric || [];
        },

        // 当前编辑面板对象
        plate() {
            if (typeof this.currentPlate === 'number') {
                return this.plates[this.currentPlate];
            }
            return null;
        },

        // 当前画布元素
        fabricCanvas() {
            return this.allFabricCanvas[this.currentPlate] || {};
        },

        // 当前fabric实例
        fabric() {
            return this.fabricCanvas.fabric;
        },

        // 面板实例参数
        fabricOptions() {
            return {
                width: this.width,
                height: this.height,
                controlsAboveOverlay: true,
                preserveObjectStacking: true,
                borderColor: 'red',
                borderScaleFactor: 90,
            }
        }
    },

    methods: {
        /**
         * renderAll 重新渲染画布 fabric.renderAll 方法
         */
        renderAll() {
            this.fabricCanvas.renderAll();
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
        setPlate(imgSrc, options = {}) {
            this.fabricCanvas.setPlate(imgSrc, options);
        },

        /**
         * 设置鞋面底色
         * @param {String} color - 颜色
         * @param {Object} plateIndex - 鞋面
         */
        setPlateColor(color, isAllCanvas = true) {
            // fabricCanvas
            let fabricCanvas = [this.fabricCanvas];
            if (isAllCanvas) {
                fabricCanvas = this.allFabricCanvas;
            }

            // Set plate color element.
            fabricCanvas.forEach(canvas => {
                canvas.setColor(color);
            });
        },

        /**
         * 添加图片元素
         */
        addImage(imgSrc, options = {}, select = true) {
            this.fabricCanvas.addImage(imgSrc, options, select);
        },

        /**
         * 添加文本元素
         */
        addText(text, options = {}, select = true) {
            this.fabricCanvas.addText(text, options, select);
        },

        /**
         * 修改文字大小
         */
        setTextSize(value, element) {
            this.fabricCanvas.setTextSize(value, element);
        },

        /**
         * 修改文字颜色
         */
        setTextColor(value, element) {
            this.fabricCanvas.setTextColor(value, element);
        },

        /**
         * 设置文本字体
         */
        setFontFamily(familyname, element) {
            this.fabricCanvas.setFontFamily(familyname, element);
        },

        /**
         * 设置元素画布居中
         * @param {*} element
         */
        setElementCenter(element) {
            this.fabricCanvas.setElementCenter(element);
        },

        /**
         * 设置元素(相对或绝对)角度
         * @param {Number} angle - 角度
         * @param {Boolean} relative - 是否相对角度
         */
        setElementAngle(angle, relative = false, element) {
            const ele = element || this.getCurrentElement();
            if (ele) {
                angle = relative ? (ele.angle + angle) : angle;
                ele.rotate(angle);
                ele.setCoords();
                this.renderAll();
                this.makeSnapshot('set Angle');
            }
        },

        /**
         * 向前一步层级
         * @param {Object} element
         */
        forwardElement(element) {
            element = this.getElement(element);
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
            element = this.getElement(element);
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
            element = this.getElement(element);
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
            element = this.getElement(element);
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
            return this.fabricCanvas.getCurrentElement(isAll);
        },

        /**
         * 返回所有[指定类型]元素
         * @param {*} [elementType] - 元素类型
         */
        getAllElements(elementType, fabricCanvas) {
            fabricCanvas = fabricCanvas || this.fabricCanvas;
            return fabricCanvas.getAllElements(elementType);
        },

        /**
         * 获取元素
         * @param {Object} [element]
         */
        getElement(element) {
            return this.fabricCanvas.getElement(element);
        },

        /**
         * 设置选中元素
         * @param {Object} element
         */
        setActiveElement(element) {
            return this.fabricCanvas.setActiveElement(element);
        },

        /**
         * 取消选中元素
         * @param {Object} e
         */
        deactiveElement(e) {
            this.fabric.discardActiveObject(e);
        },

        flipX(isFlip, element) {
            return this.fabricCanvas.flipX(isFlip, element);
        },

        flipY(isFlip, element) {
            return this.fabricCanvas.flipY(isFlip, element);
        },

        /**
         * 删除元素
         * @param {Object} [element] - 要删除的元素
         */
        deleteElement(element) {
            element = this.getElement(element);
            if (element) {
                this.fabric.remove(element);
                this.makeSnapshot('Remove element');
                return element;
            }
        },

        setZoom(val) {
            const center = this.fabric.getCenter();
            this.fabric.zoomToPoint(new fabric.Point(center.left, center.top), val);
        },

        /**
         * 获取元素的边界位置
         *
         * @param {Object} element
         * @returns
         */
        getElementBounding(element) {
            return this.fabricCanvas.getElementBounding(element);
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
         * 添加快照
         * @param {*} action
         */
        makeSnapshot(action) {
            this.fabricCanvas.makeSnapshot(action);
        },


        undo() {
            this.fabricCanvas.undo();
        },

        redo() {
            this.fabricCanvas.redo();
        },


        /**
         * 清除画布
         */
        clear() {
            // this.fabric.clear();
        },

        /**
         * 导入模板数据
         * @param {JSON} data - 模板数据
         * @param {Number} plate - 初始画布索引
         */
        importTemplate(data, plate = 0) {
            // this.clearHistory();
            // this.toggleSnapshot(false);
            // this.clear();

            this.currentPlate = null;

            if (typeof data === 'string') {
                data = JSON.parse(data);
            }

            this.version = data.version;

            const plates = data.plates.map(plate => {
                return Object.assign({}, plate, {
                    template: JSON.parse(plate.template)
                });
            });

            this.$nextTick(() => {
                this.plates = plates;
                this.rendering = data.rendering;

                if (plate !== false) {
                    this.currentPlate = plate;
                }

                // this.clearContextStore();
                // this.toggleSnapshot(true);
            });
        },

        /**
         * exportTemplate 导出模板数据
         */
        exportTemplate() {
            // 保存template
            this.allFabricCanvas.forEach(fabricCanvas => {
                fabricCanvas.saveTemplate();
            });

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
        currentPlate(val, oldVal) { // 编辑鞋面变化

        }
    },

    mounted() {
        this.$on('snapshot', () => {
            // if (this.fabric.size()) {
            //     this.plates[this.currentPlate].url = this.exportDataURL();
            // } else {
            //     this.plates[this.currentPlate].url = null;
            // }
        });
    }
}
Vue.component('fabric-editor', fabricEditor);

export default fabricEditor;