<template>
	<movable-area :scale-area="true" :style="{'width':'100vw','height':'100vh','backgroundColor':'#ebf7df','overflow':'hidden'}">
		<movable-view direction="all"  :inertia="true" :scale-min="0.001" :scale-max="4" :scale="true" :style="{'width':width,'height':height}">
			<image mode="aspectFit" :src="image" :style="{'width':width,'height':height}"></image>
		</movable-view>
	</movable-area>
</template>

<script>
	export default {
		data() {
			return {
				windowWidth: 0,
				windowHeight: 0,
				width: '100vw',
				height: '100vh',
				scale: 1,
				image: null
			}
		},
		onLoad(param) {
			this.image = param.path;
			// this.width = param.width + 'px';
			// this.height = param.height + 'px';
		},
		methods:{
		}
	}
</script>

<style>
	
</style>
