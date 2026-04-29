import { VantComponent } from '../common/component';
VantComponent({
    classes: ['info-class'],
    props: {
        dot: Boolean,
        info: null,
        size: null,
        color: String,
        customStyle: String,
        classPrefix: {
            type: String,
            value: 'van-icon',
        },
        name: String,
        ...(typeof plus !== 'undefined' ? {
            'data-event': {
                type: Object,
            }
        } : {})
    },
    methods: {
        onClick() {
            this.$emit('click');
            const isApp = typeof plus !== 'undefined';
            if(isApp && this['data-event']){
                let common = require('../../../resources/js/common.js');
                common.osg.report('click', this['data-event']);
            }
        },
    },
});
