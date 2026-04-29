<script>
	export default {
		onLaunch: function() {
		},
		onShow: function() {
			uni.$emit('osg', 'appShow');
		},
		onHide: function() {
			uni.$emit('osg', 'appHide');
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
