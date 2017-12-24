import './style/index.scss';
import Vue from 'vue';
import fabricEditor from './fabric-editor.js';

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

                this.editor.renderByPlate().each(context => {
                    if (!context.appended) {
                        document.body.appendChild(context.canvas);
                        context.appended = true;
                    }
                })

                // this.editor.renderAllShose().each(context => {
                //     if (!context.appended) {
                //         document.body.appendChild(context.canvas);
                //         context.appended = true;
                //     }
                // });
            },

            onElementSelectChange(element, action) {
                // console.info(element, action, element && this.editor.getElementBounding());
                // this.editor.getElementBounding()
                // console.info(this.editor.getElementBounding().top);
                // console.info(element.getBoundingRect());
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

    window.plateGo = step => {
        const index = window.editor.currentPlate;
        window.editor.currentPlate = (index + step + window.editor.plates.length) % window.editor.plates.length;
    }


    window.addImage = () => {
        window.editor.addImage('http://qn-us.fenglinghudong.com/editor-images/pattern-01.jpg', {
            width: 500,
            height: 500
        });
    }

    window.changePlateColor = () => {
        window.editor.setPlateColor('red');
    };

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