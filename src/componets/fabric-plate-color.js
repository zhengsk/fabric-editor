import { fabric } from 'fabric';

fabric.PlateColor = fabric.util.createClass(fabric.Rect, {
    type: 'plate-color',

    initialize: function(element, options) {
        this.callSuper('initialize', element, options);
        options && this.set('name', options.name);
    },

    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'));
    }
});

fabric.PlateColor.fromObject = function(object, callback) {
    object = Object.assign({}, object, {
        selectable: false,
        evented: false,
    });

    const instance = new fabric.PlateColor(object);
    callback && callback(instance);
    return instance;
};

export default fabric.PlateColor;