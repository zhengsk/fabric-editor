// https://github.com/NodeSite/canvas-test/tree/master/src/Funny-demo/transform
import matrix from './matrix';
import Promise from 'bluebird';

function transformImage(options) {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    var opts = {
        width: 1000,
        height: 1000,
        imageSrc: '',
        maskSrc: '',
        points: null, // 默认位置
        extend: 2, // 扩展三角形，处理缝隙问题
        hasDrag: true, // 开启拖拽
        hasDot: true, // 显示点
        hasRect: false, // 显示方格
        hasPic: true, // 显示图片
        count: 10, // 等分割数量
    };

    Object.assign(opts, options);

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    canvas.width = opts.width;
    canvas.height = opts.height;

    var dots = opts.points,
        dotscopy, idots;

    if (!opts.imageSrc) {
        return canvas;
    }

    // mask
    var mask = new Image();
    mask.crossOrigin = "Anonymous";

    // image
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = opts.imageSrc;

    img.onload = function() {
        var img_w = img.width;
        var img_h = img.height;
        var left = (canvas.width - img_w);
        var top = (canvas.height - img_h);

        img.width = img_w;
        img.height = img_h;

        if (!opts.points || !opts.points.length) {
            dots = opts.points = [
                { x: left, y: top },
                { x: left + img_w, y: top },
                { x: left + img_w, y: top + img_h },
                { x: left, y: top + img_h }
            ];
        }

        //保存一份不变的拷贝
        dotscopy = [
            { x: left, y: top },
            { x: left + img_w, y: top },
            { x: left + img_w, y: top + img_h },
            { x: left, y: top + img_h }
        ];

        //获得所有初始点坐标
        idots = rectsplit(opts.count, dotscopy[0], dotscopy[1], dotscopy[2], dotscopy[3]);

        if (opts.maskSrc) {
            mask.onload = function() {
                render(opts.points);
            };
            mask.src = opts.maskSrc;
        } else {
            render(opts.points);
        }
    };

    // 绑定拖拽功能
    var unbindEvent = false;
    if (opts.hasDrag) {
        unbindEvent = bindDrag();
    }

    /**
     * 鼠标拖动事件绑定
     * @param e
     */
    function bindDrag() {
        var area;
        var dot, i;
        var qy = 80; //鼠标事件触发区域

        var actions = {
            mousedown: function(e) {
                if (!dots.length) return;
                area = getArea(e)
                for (i = 0; i < dots.length; i++) {
                    dot = dots[i];
                    if (area.t >= (dot.y - qy) && area.t <= (dot.y + qy) && area.l >= (dot.x - qy) && area.l <= (dot.x + qy)) {
                        break;
                    } else {
                        dot = null;
                    }
                }

                if (!dot) return;

                window.addEventListener('mousemove', actions.mousemove);
                window.addEventListener('mouseup', actions.mouseup);
            },

            mousemove: function(e) {
                var narea = getArea(e);
                var nx = narea.l - area.l;
                var ny = narea.t - area.t;

                dot.x += nx;
                dot.y += ny;

                area = narea;

                render();
            },

            mouseup: function() {
                window.removeEventListener('mousemove', actions.mousemove);
                window.removeEventListener('mouseup', actions.mouseup);
            }
        }
        window.addEventListener('mousedown', actions.mousedown);

        return function() {
            window.removeEventListener('mousedown', actions.mousedown);
        }
    }

    /**
     * 获取鼠标点击/移过的位置
     * @param e
     * @returns {{t: number, l: number}}
     */
    function getArea(e) {
        e = e || window.event;
        return {
            t: e.clientY - canvas.offsetTop + document.body.scrollTop + document.documentElement.scrollTop,
            l: e.clientX - canvas.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft
        }
    }

    /**
     * 画布渲染
     */
    function render() {
        var count = opts.count;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(mask, 0, 0);

        var ndots = rectsplit(count, dots[0], dots[1], dots[2], dots[3]);

        ndots.forEach(function(d, i) {
            //获取平行四边形的四个点
            var dot1 = ndots[i];
            var dot2 = ndots[i + 1];
            var dot3 = ndots[i + count + 2];
            var dot4 = ndots[i + count + 1];

            //获取初始平行四边形的四个点
            var idot1 = idots[i];
            var idot2 = idots[i + 1];
            var idot3 = idots[i + count + 2];
            var idot4 = idots[i + count + 1];

            if (opts.isMask) {
                ctx.globalCompositeOperation = 'source-atop';
            } else {
                ctx.globalAlpha = 0.8;
            }

            if (dot2 && dot3 && i % (count + 1) < count) {
                //绘制三角形的下半部分
                renderImage(idot3, dot3, idot2, dot2, idot4, dot4);

                //绘制三角形的上半部分
                renderImage(idot1, dot1, idot2, dot2, idot4, dot4, true);
            }

            if (opts.isMask) {
                ctx.globalCompositeOperation = 'source-over';
            } else {
                ctx.globalAlpha = 1;
            }

            // 显示圆点
            if (opts.hasDot) {
                ctx.save();
                ctx.fillStyle = "red";
                ctx.fillRect(d.x - 1, d.y - 1, 2, 2);
                ctx.save();
            }
        });
        ctx.restore();

        resolve(ctx);
    }

    /**
     * 计算矩阵，同时渲染图片
     * @param arg_1
     * @param _arg_1
     * @param arg_2
     * @param _arg_2
     * @param arg_3
     * @param _arg_3
     */
    function renderImage(arg_1, _arg_1, arg_2, _arg_2, arg_3, _arg_3, isUp) {
        var extend = opts.extend;
        ctx.save();
        //根据变换后的坐标创建剪切区域
        ctx.beginPath();
        if (isUp) { // 上半部分三角形
            ctx.moveTo(_arg_1.x - extend, _arg_1.y - extend);
            ctx.lineTo(_arg_2.x + extend, _arg_2.y - extend);
            ctx.lineTo(_arg_3.x + extend, _arg_3.y + extend);
        } else { // 下半部分三角形
            ctx.moveTo(_arg_1.x + extend, _arg_1.y + extend);
            ctx.lineTo(_arg_2.x + extend, _arg_2.y - extend);
            ctx.lineTo(_arg_3.x - extend, _arg_3.y - extend);
        }
        ctx.closePath();

        // 显示边线
        if (opts.hasRect) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            ctx.stroke();
        }
        ctx.clip();

        if (opts.hasPic) {
            //传入变换前后的点坐标，计算变换矩阵
            var result = matrix.getMatrix.apply(this, arguments);

            //变形
            ctx.transform(result.a, result.b, result.c, result.d, result.e, result.f);

            //绘制图片
            ctx.drawImage(img, idots[0].x, idots[0].y, img.width, img.height);
        }

        ctx.restore();
    }


    /**
     * 将abcd四边形分割成n的n次方份，获取n等分后的所有点坐标
     * @param n     多少等分
     * @param a     a点坐标
     * @param b     b点坐标
     * @param c     c点坐标
     * @param d     d点坐标
     * @returns {Array}
     */
    function rectsplit(n, a, b, c, d) {
        //ad向量方向n等分
        var ad_x = (d.x - a.x) / n;
        var ad_y = (d.y - a.y) / n;
        //bc向量方向n等分
        var bc_x = (c.x - b.x) / n;
        var bc_y = (c.y - b.y) / n;

        var ndots = [];
        var x1, y1, x2, y2, ab_x, ab_y;

        //左边点递增，右边点递增，获取每一次递增后的新的向量，继续n等分，从而获取所有点坐标
        for (var i = 0; i <= n; i++) {
            //获得ad向量n等分后的坐标
            x1 = a.x + ad_x * i;
            y1 = a.y + ad_y * i;
            //获得bc向量n等分后的坐标
            x2 = b.x + bc_x * i;
            y2 = b.y + bc_y * i;

            for (var j = 0; j <= n; j++) {
                //ab向量为：[x2 - x1 , y2 - y1]，所以n等分后的增量为除于n
                ab_x = (x2 - x1) / n;
                ab_y = (y2 - y1) / n;

                ndots.push({
                    x: x1 + ab_x * j,
                    y: y1 + ab_y * j
                })
            }
        }

        return ndots;
    }

    /**
     * 销毁
     */
    function destroy() {
        unbindEvent && unbindEvent(); // unbindEvent for drag.
        canvas = null;
        ctx = null;
    }

    /**
     * getPoints
     */
    function getPoints() {
        return dots;
    }

    return {
        canvas,
        destroy,
        getPoints,
        reRender: render,
        options: opts,
        promise: promise
    };
};

export default transformImage;