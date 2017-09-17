import HistoryFactory from './history-factory';

export default {
    methods: {
        undo() {
            const data = JSON.parse(this.history.prev().data);
            this.importTemplate(data);
        },

        redo() {
            const data = JSON.parse(this.history.next().data);
            this.importTemplate(data);
        }
    },

    mounted() {
        const self = this;
        this.history = new HistoryFactory({
            maxLength: 80,
            throttle: 500,
        });

        this.$nextTick(() => {
            const fabric = this.fabric;
            fabric.on("object:added", (e) => {
                this.history.add({
                    action: 'add',
                    currentElment: '',
                    data: this.exportTemplateString(),
                })
            });

            fabric.on("object:modified", (e) => {
                this.history.add({
                    action: 'modify',
                    currentElment: '',
                    data: this.exportTemplateString(),
                });
            });
        })
    }
}