/**
 *
 */
function History(options) {
    this.queue = [];
    this.current = -1;
    this.enable = true;
    this.maxLength = options.length || 80;
    this.disable = false;
    this.throttle = options.throttle || 300; // ms
}

History.prototype.init = function() {
    this.queue = [];
    this.current = -1;
    this.add();
};

// item = {
//     action: 'change',
//     currentElement: 'element',
//     data: 'JSON Data',
// }

History.prototype.add = function(item) {
    if (this.disable) {
        return false;
    }

    clearTimeout(this.timer);

    const action = () => {
        console.log("=== History.set");

        if (this.current !== this.queue.length - 1) {
            this.queue.splice(this.current, this.queue.length - this.current);
        }

        if (this.queue.length >= this.maxLength) {
            this.queue.shift();
            this.current--;
        }

        this.queue.push(item);
        this.current++;

        console.log("==> INFO : ");
        console.log(this.queue.length);
        console.log("===========");
        console.log("current: ", 0 + this.current);

        return item;
    };

    this.timer = setTimeout(action, this.throttle);
};

History.prototype.prev = function() {

    console.log("=== History.prev");

    this.current = Math.max(0, this.current - 1);
    const item = this.queue[this.current];

    console.log("==> INFO : ");
    console.log(item);
    console.log("===========");
    console.log("current: ", 0 + this.current);
    return item;
};

History.prototype.next = function() {

    console.log("=== History.next");

    this.current = Math.min(this.current + 1, this.queue.length);
    const item = this.queue[this.current];

    console.log("==> INFO : ");
    console.log(item);
    console.log("===========");
    console.log("current: ", 0 + this.current);
    return item;
};

History.prototype.clear = function() {
    this.init();
};

export default History;