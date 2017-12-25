const fabricText = {
    methods: {
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
                textAlign: 'center',
            }, options);

            var textElement = new fabric.Textbox(text, opts);
            this.fabric.add(textElement);

            this.setElementCenter(textElement);

            if (select) {
                this.setActiveElement(textElement);
            }
            return textElement;
        },

        /**
         * 修改字体样式
         */
        changeText(prop, value, element) {
            element = this.getElement(element);
            if (element) {
                element.set(prop, value);

                element.setCoords();
                this.renderAll();
                // this.makeSnapshot('Modify Text:', prop);
                this.fireChange('Modify Text:', prop);
            }
        },

        /**
         * 修改文字大小
         * @param {Number} value - 字体大小
         * @param {Object} [element]
         */
        setTextSize(value, element) {
            this.changeText('fontSize', value, element);
        },

        /**
         * 修改文字颜色
         * @param {Number} value - 字体大小
         * @param {Object} [element]
         */
        setTextColor(value, element) {
            this.changeText('fill', value, element);
        },

        /**
         * 设置文本字体
         * @param {string} familyname
         */
        setFontFamily(familyname, element) {
            this.changeText('fontFamily', familyname, element);
        },
    }
};
export default fabricText;