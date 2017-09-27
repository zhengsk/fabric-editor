import HistoryFactory from './history-factory';

export default {
    props: {
        historyChange: {
            type: Function
        }
    },
    methods: {
        undo() {
            if (this.history.current > 0) {
                const snapshot = this.history.prev();
                const data = JSON.parse(snapshot.data);
                return this.importPlateString(data).then(() => {
                    // Set current element.
                    if (snapshot.currentElment !== null) {
                        const element = this.getElementFromIndex(snapshot.currentElment);
                        this.setCurrentElement(element);
                    }
                });
            }
        },

        redo() {
            if (this.history.current < this.history.queue.length - 1) {
                const snapshot = this.history.next();
                const data = JSON.parse(snapshot.data);
                return this.importPlateString(data).then(() => {
                    // Set current element.
                    if (snapshot.currentElment !== null) {
                        const element = this.getElementFromIndex(snapshot.currentElment);
                        this.setCurrentElement(element);
                    }
                });
            }
        },

        /**
         * 添加快照
         */
        makeSnapshot(actionName) {
            this.history.add({
                action: actionName || 'no Named',
                currentElment: this.getIndexFromElement(),
                data: this.exportPlateString(),
            });
        },
        /**
         *  历史快照功能开关
         */
        toggleSnapshot(enable) {
            if (enable === undefined) {
                enable = !this.history.enable;
            } else {
                this.history.enable = enable;
            }
        },

        /**
         * 重置历史快照
         */
        resetSnapshot() {
            this.history.clear();
            this.makeSnapshot();
        },

        /**
         * 历史记录发生变化发生事件
         */
        onSnapshot(item) {
            this.$emit('snapshot', item, this.history);
        }
    },

    mounted() {
        const self = this;
        this.history = new HistoryFactory({
            maxLength: 80,
            throttle: 600,
            onChange: self.onSnapshot,
        });

        this.$nextTick(() => {
            const fabric = this.fabric;
            fabric.on("object:added", (e) => {
                if (this.history.enable) {
                    this.makeSnapshot('add');
                }
            });

            fabric.on("object:modified", (e) => {
                if (this.history.enable) {
                    this.makeSnapshot('modify');
                }
            });
        })
    }
}