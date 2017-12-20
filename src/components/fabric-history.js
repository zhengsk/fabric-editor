import HistoryFactory from './history-factory';

let HistoryInstance = [];

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
                return this.importPlate(data).then(() => {
                    // Set current element.
                    if (snapshot.currentElment !== null) {
                        const element = this.getElementFromIndex(snapshot.currentElment);
                        this.setCurrentElement(element);
                    }

                    this.onSnapshot(data, 'undo');
                });
            }
        },

        redo() {
            if (this.history.current < this.history.queue.length - 1) {
                const snapshot = this.history.next();
                const data = JSON.parse(snapshot.data);
                return this.importPlate(data).then(() => {
                    // Set current element.
                    if (snapshot.currentElment !== null) {
                        const element = this.getElementFromIndex(snapshot.currentElment);
                        this.setCurrentElement(element);
                    }

                    this.onSnapshot(data, 'redo');
                });
            }
        },

        /**
         * 添加快照
         */
        makeSnapshot(actionName, ifEmpty = false) {
            if (ifEmpty !== true || this.history.queue.length === 0) {
                this.history.add({
                    action: actionName || 'no Named',
                    currentElment: this.getIndexFromElement(),
                    data: this.exportPlateString(),
                });
            }
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
         * 清楚所有历史记录实例
         */
        clearHistory() {
            HistoryInstance = [];
        },

        /**
         * 历史记录发生变化发生事件
         */
        onSnapshot(item, action) {
            this.$emit('snapshot', item, this.history, action);
        }
    },

    mounted() {
        const self = this;
        this.history = new HistoryFactory({
            maxLength: 80,
            throttle: 600,
            onChange: self.onSnapshot,
        });

        /**
         * On plate change switch history instance.
         */
        this.$on('plateChange', (index) => {
            index = index || this.currentPlate;

            if (!HistoryInstance[index]) { // If not exist;
                HistoryInstance[index] = new HistoryFactory({
                    maxLength: 80,
                    throttle: 600,
                    onChange: self.onSnapshot,
                });
            }

            this.history = HistoryInstance[index];

            this.$nextTick(() => {
                const fabric = this.fabric;

                if (!fabric.initForSnapshot) {
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

                    fabric.initForSnapshot = true;
                }
            });
        });


    }
}