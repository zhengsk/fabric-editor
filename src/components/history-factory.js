/**
 *
 */
function History(options) {
    this.queue = [];
    this.current = -1;
    this.enable = true;
    this.maxLength = options.length || 80;
    this.throttle = options.throttle || 300; // ms
    this.onChange = options.onChange;
}

// item = {
//     action: 'change',
//     currentElement: 'element',
//     data: 'JSON Data',
// }

History.prototype.add = function(item) {
    if (!this.enable) { // Disable.
        return false;
    }

    if (item.data === this.queue[this.current.data]) { // Same history data as previous.
        return false;
    }

    clearTimeout(this.timer);

    const action = () => {
        if (this.current !== this.queue.length - 1) {
            this.queue.splice(this.current, this.queue.length - this.current);
        }

        if (this.queue.length >= this.maxLength) {
            this.queue.shift();
            this.current--;
        }

        this.queue.push(item);
        this.current++;

        console.log('History set:', 0 + this.current, ' / ', this.queue.length);

        this.onChange(item);
        return item;
    };

    this.timer = setTimeout(action, this.throttle);
};

History.prototype.prev = function() {
    this.current = Math.max(0, this.current - 1);
    const item = this.queue[this.current];

    console.log('History prev:', 0 + this.current, '/', this.queue.length);
    return item;
};

History.prototype.next = function() {
    this.current = Math.min(this.current + 1, this.queue.length - 1);
    const item = this.queue[this.current];

    console.log('History next:', 0 + this.current, '/', this.queue.length);
    return item;
};

History.prototype.clear = function() {
    this.queue = [];
    this.current = -1;
};

export default History;