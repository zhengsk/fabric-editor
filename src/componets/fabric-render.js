import loadImage from '../utils/loadImage';
import transformImage from '../utils/transform-image';

export default {
    name: 'fabric-render',

    data: function() {
        return {
            "version": 1,
            "plates": [{
                "plate": require('../assets/images/shoes.png'), // 鞋面原图
                "template": "{json data}", // editor image
                "url": require('../assets/images/xx.png'), // 定制后的鞋面图片
            }],

            "rendering": [{
                "picture": require('../assets/images/shoes.png'), // 鞋子照片
                "mask": [{
                    "plate": 0,
                    "url": require('../assets/images/shoes-mask.png'),
                    "points": [
                        { x: 272, y: 111 },
                        { x: 940, y: -28 },
                        { x: 963, y: 703 },
                        { x: 306, y: 1114 },
                    ]
                }]
            }],
        };
    },

    methods: {
        // 获取变形后的图片
        getTransformImage(imageSrc, maskSrc, points) {
            return transformImage({
                imageSrc: imageSrc,
                maskSrc: maskSrc,
                points: points, // 默认位置
                extend: 2, // 扩展三角形，处理缝隙问题
                hasDrag: false, // 开启拖拽∏
                hasDot: false, // 显示点
                hasRect: false, // 显示方格
                hasPic: true, // 显示图片
                count: 10, // 等分割数量,
                isMask: true, // 是否应用蒙版
            });
        },

        /**
         * 获取鞋子照片底图
         *
         */
        getBaseCanvas(picture) {
            return loadImage(picture).then(img => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 1000;
                canvas.height = 1000;
                ctx.drawImage(img, 0, 0);

                return ctx;
            });
        },

        renderShose() {
            this.rendering.forEach(shoes => {

                this.getBaseCanvas(shoes.picture).then(ctx => {
                    const maskedImage = shoes.mask.map(mask => {
                        return this.getTransformImage(
                            this.plates[mask.plate].url,
                            mask.url,
                            mask.points
                        );
                    });

                    maskedImage[0].promise.then(context => {
                        return ctx.drawImage(context.canvas, 0, 0);
                    });

                    document.body.appendChild(ctx.canvas);
                });

                // const image = new Image();
                // image.src = ctx.canvas.toDataURL();
                // document.body.appendChild(image);
            });

        }
    },

    mounted() {
        this.renderShose();
        console.info('fabric-render');
    }
}