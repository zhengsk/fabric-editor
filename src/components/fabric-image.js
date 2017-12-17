const fabricImage = {
    methods: {
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
                this.fabric.add(image);
                this.setElementCenter(image);

                if (select) {
                    this.setActiveElement(image);
                }

                this.makeSnapshot('addImage');
                return image;
            });
        },

        /**
         * 是否水平翻转显示
         *
         * @param {Boolean} isFlip
         * @param {Object} [element]
         */
        flipX(isFlip, element) {
            element = this.getElement();
            if (isFlip === undefined) {
                isFlip = !element.flipX;
            }
            element.flipX = isFlip;

            element.setCoords();
            this.renderAll();
            this.makeSnapshot('Modify Image flipX');
        },

        /**
         * 是否垂直翻转显示
         *
         * @param {Boolean} isFlip
         * @param {Object} [element]
         */
        flipY(isFlip, element) {
            element = this.getElement();
            if (isFlip === undefined) {
                isFlip = !element.flipY;
            }
            element.flipY = isFlip;

            element.setCoords();
            this.renderAll();
            this.makeSnapshot('Modify Image flipY');
        },
    }
}

export default fabricImage;