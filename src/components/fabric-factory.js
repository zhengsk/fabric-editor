import { fabric } from 'fabric';

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

function fabricFactory(editor, element, options) {
    // 创建实例
    const fabricInstance = new fabric.Canvas(element, options);

    // 设置当前选中的元素
    fabricInstance.on("object:selected", (e) => {
        editor.currentElement = e.target;
        editor.$emit('element-change', editor.currentElement, 'selected');
    });

    fabricInstance.on("selection:cleared", (e) => {
        editor.currentElement = null;
        editor.$emit('element-change', editor.currentElement, 'unselected');
    });

    fabricInstance.on("object:rotating", (e) => {
        editor.$emit('element-change', editor.currentElement, 'rotating');
    });

    fabricInstance.on("object:scaling", (e) => {
        editor.$emit('element-change', editor.currentElement, 'scaling');
    });

    fabricInstance.on("object:moving", (e) => {
        editor.$emit('element-change', editor.currentElement, 'moving');
    });

    return fabricInstance;
};

export default fabricFactory;