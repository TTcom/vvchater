<template>
	<div class="motai">
	<div class="success">
		  <div class="loadinganimate">
		    <img src="./loading.gif" class="loadingimg"/>
		    </div>

		<div class="signonsuccess">
			{{loadingtext}}
		</div>
		
	</div>
	</div>
</template>

<script>
	export default{
		props:{
			loadingtext:{
				type:String,
				default:"加载中"
			}
		}
	}
	
</script>

<style lang="scss">
	.motai{
		position: fixed;
		width: 100%;
		height: 100%;
		z-index: 9990;
		background-color: rgba(0,0,0,0);
	}
	.success{
		height: 150px;
		width: 370px;
		border: 1px solid #DCDCDC;
		border-radius: 5px;
		position: fixed;margin: auto;
		top: 0;left: 0;bottom: 0;right: 0;
		z-index: 9991;
		background-color: white;
	.loadinganimate{
		position: relative;
		width:40px;
		margin:auto;
		padding:20px 0;
		.loadingimg{
			width: 40px;height: 40px;
		}
	}
	.signonsuccess{
		font-size: 16px;
		text-align: center;
	}
}	
	
	
</style>