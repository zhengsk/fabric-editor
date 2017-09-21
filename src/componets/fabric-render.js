import transformImage from 'transform-image';

export default {
    name: 'fabric-render',

    data: function() {
        return {
            "version": 1,
            "plates": [{
                "plate": "plate url", // 鞋面图片
                "template": "{json data}", // editor image
                "url": "resultImageUrl"
            }],

            "rendering": [{
                "picture": "picture url", // 鞋子照片
                "mask": [{
                    "plate": 3,
                    "url": "mask url",
                    "points": [
                        [33, 44],
                        [500, 94],
                        [33, 800],
                        [799, 600]
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
            });
        },

        renderShose() {
            this.rendering.forEach(shoes => {
                const maskedImage = shoes.mask.forEach(mask => {
                    return this.getTransformImage(
                        this.plates[mask.plate],
                        mask.url,
                        mask.points
                    );
                });

                // render Shose @TODO
            });
        }
    },

    mounted() {

    }


}