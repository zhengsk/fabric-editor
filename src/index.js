import './style/index.scss';
import Vue from 'vue';
import fabricEditor from './fabric-editor.js';

import pattern from './assets/images/pattern-01.jpg';

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

        methods: {
            onSnapShot(item) {
                console.info(item);
                this.editor.renderAllShose().each(context => {
                    if (!context.appended) {
                        document.body.appendChild(context.canvas);
                        context.appended = true;
                    }
                });
            },

            onElementSelectChange(element, action) {
                console.info(element, action, element && this.editor.getElementBounding());
            }
        },

        mounted() {
            console.info('App mouted');
            // this.editor.currentPlate = 0;
        },
    });

    window.editor = editor.editor;

    window.exportTemplate = () => {
        console.info(JSON.stringify(window.editor.exportTemplate()));
    }

    window.importTemplate = () => {
        window.editor.importTemplate(document.getElementById('templateString').textContent);
    }

    window.exportDataURL = () => {
        console.info(JSON.stringify(window.editor.exportDataURL()));
    }



    window.addImage = () => {
        window.editor.addImage(pattern, {
            width: 500,
            height: 500
        });
    }

    window.addText = () => {
        window.editor.addText();
    }

    window.changeTextBigger = () => {
        const element = window.editor.getCurrentElement();
        window.editor.setTextSize(element.fontSize + 5);
    }

    window.changeTextSmaller = () => {
        const element = window.editor.getCurrentElement();
        window.editor.setTextSize(element.fontSize - 5);
    }

    window.changeTextColor = () => {
        const element = window.editor.getCurrentElement();
        window.editor.setTextColor('#FF0000');
    }

    window.changeFontFamily = () => {
        const element = window.editor.getCurrentElement();
        window.editor.setFontFamily('Helvetica Neue');
    }

}