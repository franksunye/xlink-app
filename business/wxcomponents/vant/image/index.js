import { VantComponent } from '../common/component';
import { button } from '../mixins/button';
VantComponent({
    mixins: [button],
    classes: ['custom-class', 'loading-class', 'error-class', 'image-class'],
    props: {
        src: {
            type: String,
            observer() {
                this.setData({
                    error: false,
                    loading: true,
                });
            },
        },
        round: Boolean,
        width: null,
        height: null,
        radius: null,
        lazyLoad: Boolean,
        useErrorSlot: Boolean,
        useLoadingSlot: Boolean,
        showMenuByLongpress: Boolean,
        fit: {
            type: String,
            value: 'fill',
        },
        webp: {
            type: Boolean,
            value: false,
        },
        showError: {
            type: Boolean,
            value: true,
        },
        showLoading: {
            type: Boolean,
            value: true,
        },
        ...(typeof plus !== 'undefined' ? {
            'data-event': {
                type: Object,
            }
        } : {})
    },
    data: {
        error: false,
        loading: true,
        viewStyle: '',
    },
    methods: {
        onLoad(event) {
            this.setData({
                loading: false,
            });
            this.$emit('load', event.detail);
        },
        onError(event) {
            this.setData({
                loading: false,
                error: true,
            });
            this.$emit('error', event.detail);
        },
        onClick(event) {
            this.$emit('click', event.detail);
            const isApp = typeof plus !== 'undefined';
            if(isApp && this['data-event']){
                let common = require('../../../resources/js/common.js');
                common.osg.report('click', this['data-event']);
            }
        },
    },
});
