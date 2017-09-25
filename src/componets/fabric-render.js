import Promise from 'bluebird';
import CryptoJS from 'crypto-js';
import loadImage from '../utils/loadImage';
import transformImage from '../utils/transform-image';

const ContextStore = {};
const ImageStore = {};

export default {
    name: 'fabric-render',

    data: function() {
        return {
            "version": 1,
            "plates": [{
                "plate": require('../assets/images/shoes.png'), // 鞋面原图
                "template": "{json data}", // editor image
                "url": require('../assets/images/xx.png'), // 定制后的鞋面图片
            }, {
                "plate": require('../assets/images/shoes.png'), // 鞋面原图
                "template": "{json data}", // editor image
                "url": require('../assets/images/yy.jpg'), // 定制后的鞋面图片
            }],

            "rendering": [{
                    "picture": require('../assets/images/shoes.png'), // 鞋子照片
                    "mask": [{
                        "plate": 0,
                        "url": require('../assets/images/shoes-mask-01.png'),
                        "points": [
                            { x: 272, y: 111 },
                            { x: 940, y: -28 },
                            { x: 963, y: 703 },
                            { x: 306, y: 1114 },
                        ]
                    }, {
                        "plate": 1,
                        "url": require('../assets/images/shoes-mask-02.png'),
                        "points": [
                            { x: 272, y: 111 },
                            { x: 940, y: -28 },
                            { x: 963, y: 703 },
                            { x: 306, y: 1114 },
                        ]
                    }]
                },
                {
                    "picture": require('../assets/images/shoes-02.png'), // 鞋子照片
                    "mask": [{
                        "plate": 0,
                        "url": require('../assets/images/shoes-02-mask.png'),
                        "points": [
                            { x: 131, y: -33 },
                            { x: 1064, y: 104 },
                            { x: 987, y: 902 },
                            { x: 66, y: 1057 },
                        ]
                    }]
                },
            ],
        };
    },

    // props: {
    //     plates: Array,
    //     rendering: Array,
    // },

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
         */
        getBaseCanvas(picture) {
            const hash = CryptoJS.SHA1(picture).toString();

            if (!ContextStore[hash]) {
                ImageStore[hash] = loadImage(picture);
                ContextStore[hash] = ImageStore[hash].then(img => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 1000;
                    canvas.height = 1000;
                    ctx.drawImage(img, 0, 0);
                    return ctx;
                });
                return ContextStore[hash];
            } else {
                // 使用缓存图片
                return ContextStore[hash].then(ctx => {
                    ctx.clearRect(0, 0, 1000, 1000);
                    return ctx;
                }).then(ctx => {
                    return ImageStore[hash].then(img => {
                        ctx.drawImage(img, 0, 0);
                        return ctx;
                    });
                });
            };
        },

        /**
         * 渲染一张鞋子图片
         * @param {Object} rendering - 数据
         * @returns canvas.context 渲染完成图片上下文
         */
        renderShose(shoes) {
            // Get transformImages
            const maskedImages = Promise.mapSeries(shoes.mask, mask => {
                return this.getTransformImage(
                    this.plates[mask.plate].url,
                    mask.url,
                    mask.points
                );
            });

            return this.getBaseCanvas(shoes.picture).then(context => {
                return Promise.mapSeries(maskedImages, maskedImage => {
                    return maskedImage.promise;
                }).mapSeries(ctx => {
                    return context.drawImage(ctx.canvas, 0, 0);
                }).then(() => {
                    return context;
                });
            });
        },
        /**
         * 渲染所有图片
         * @returns [Array Promise] - canvas context.
         */
        renderAllShose() {
            return Promise.mapSeries(this.rendering, shoes => {
                return this.renderShose(shoes);
            });
        }
    },

    mounted() {
        console.info('fabric-render');
    }
}