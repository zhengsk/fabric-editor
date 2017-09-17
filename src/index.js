import './style/index.scss';
import Vue from 'vue';
import fabricEditor from './fabric-editor.js';

import plate from './assets/images/plate.png';
import pattern from './assets/images/pattern.jpg';

window.onload = () => {
    const editor = new Vue({
        el: '#app',
        data: () => {
            return {};
        },

        computed: {
            editor() {
                return this.$refs.editor;
            }
        },

        components: {
            fabricEditor
        },

        mounted() {
            console.info('App mouted');
            // debugger;
            this.editor.setPlate(plate);
            this.editor.addImage(pattern);
        },
    });
}