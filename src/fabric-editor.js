import Promise from 'bluebird';
import { fabric } from 'fabric';
import Vue from 'vue';

import './components/fabric-plate-color';

import fabricFactory from './components/fabric-factory';
// import fabricHistory from './components/fabric-history';
import fabricImage from './components/fabric-image';
import fabricText from './components/fabric-text';
import fabricRender from './components/fabric-render';

import fabricCanvas from './components/fabric-canvas/fabric-canvas';

const fabricEditor = {
    name: 'fabric-editor',
    template: `
        <div>
            <canvas v-if="!plates.length"></canvas>
            <fabric-canvas
                v-else
                v-for="(plate, index) in plates"
                v-show="index === currentPlate"
                ref="fabric"
                :plate="plate"
                :options="fabricOptions"
                :key="index"
            ></fabric-canvas>
        </div>
    `,
    mixins: [fabricImage, fabricText, fabricRender],
    props: {
        width: Number,
        height: Number,
    },

    data: () => {
        return {
            currentElement: null, // 当前选中元素
            currentPlate: null, // 当前编辑面板索引
            plate: 0, // 当前编辑面板对象
            plates: [], // 所有鞋面面板
        };
    },

    components: {
        'fabric-canvas': fabricCanvas,
    },

    computed: {
        canvas() {
            return this.$el;
        },

        // 当前fabric实例
        fabric() {
            return this.$refs.fabric[this.currentPlate].fabric;
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

        setPlateData() {
            if (typeof this.currentPlate === 'number') {
                this.plate = this.plates[this.currentPlate];
            } else {
                this.plate = false;
            }
        },

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
        setPlate(imgSrc, options = {}) {
            this.clear();
            return this.getImageFromeURL(imgSrc, options).then(image => {
                this.context.globalCompositeOperation = "source-out";
                // this.fabric.setBackgroundImage(image);

                if (options.plateColor) {
                    this.setPlateColor(options.plateColor);
                }

                this.renderAll();
                return image;
            });
        },

        addPlateElement(color) {
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

        /**
         * 切换不同的鞋面编辑
         * @param {Number} index - 鞋面索引值
         */
        switchPlate(index) {
            const plateDatas = this.plates[index];
            this.$emit('plateChange'); // Set hisotry instance.

            Promise.try(() => {
                if (plateDatas.template) { // 使用模板
                    return this.importPlate(plateDatas.template);
                } else { // 初始编辑
                    return this.setPlate(plateDatas.plate, {
                        plateColor: plateDatas.plateColor
                    });
                }
            }).then(() => {
                // SwitchPlate only make effect when history is empty.
                // this.makeSnapshot('switchPlate', true);
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
            element = element || this.currentElement;
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
            // this.fabric.clear();
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
            // this.toggleSnapshot(false);
            return new Promise((resolve, reject) => {
                this.fabric.loadFromJSON(data, resolve, reviver);

                if(!this.plateColor && (!data[0] || !data[0].type === "plate-color")) {
                    this.fabric.add
                }
            }).finally(() => {
                // this.toggleSnapshot(true);
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

            const self = this;
            plates.forEach(plate => { // two-way-binding for plateColor.
                let plateColor = plate.plateColor;
                Object.defineProperty(plate, "plateColor", {
                    get : function(){
                        return plateColor;
                    },
                    set : function(newValue){
                        if (plateColor !== newValue) {
                            plateColor = newValue;
                            self.setPlateColor(plateColor);
                        };
                    },
                    enumerable : true,
                    configurable : true
                });
            });

            this.$nextTick(() => {
                this.plates = plates;
                this.rendering = data.rendering;
                debugger;
                if (plate !== false) {
                    if (this.currentPlate === plate) {
                        this.switchPlate(plate);
                    } else {
                        this.currentPlate = plate;
                    }
                }

                this.clearContextStore();
                // this.toggleSnapshot(true);
            });
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
        currentPlate(val, oldVal) { // 编辑鞋面变化
            // 保存模板数据
            if (oldVal !== null) {
                this.plates[oldVal].template = this.exportPlate();
            }

            if (val !== null) {
                // this.switchPlate(val);
            }

            this.setPlateData();
        },

        plates: 'setPlateData',
    },

    mounted() {
        this.$on('snapshot', () => {
            if (this.fabric.size()) {
                this.plates[this.currentPlate].url = this.exportDataURL();
            } else {
                this.plates[this.currentPlate].url = null;
            }
        });
    }
}
Vue.component('fabric-editor', fabricEditor);

export default fabricEditor;