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
            const xx = transformImage({
                imageSrc: imageSrc,
                maskSrc: maskSrc,
                points: points, // 默认位置
            });
            return xx;
        },

        renderShose() {
            this.rendering.forEach(shoes => {
                // shoes picture.
                const picture = shoes.picture;
                const maskedImage = shoes.mask.map(mask => {
                    return this.getTransformImage(
                        this.plates[mask.plate].url,
                        mask.url,
                        mask.points
                    );
                });


                maskedImage.forEach(transform => {
                    document.body.appendChild(transform.canvas);

                    const image = new Image();
                    image.src = transform.canvas.toDataURL();
                    document.body.appendChild(image);
                });

                // render Shose @TODO
            });
        }
    },

    mounted() {
        this.renderShose();
        console.info('fabric-render');
    }


}