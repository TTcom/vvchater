<template>
	<div class="motai">
	<div class="success">
		  <div class="animate">
		    <img src="./error.png"/>
		    </div>

		<div class="signonsuccess">
			{{errortext}}
		</div>
		
	</div>
	</div>
</template>

<script>
	export default{
		props:{
			errortext:{
				type:String,
				default:"失败"
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
	.animate{
		position: relative;
		width:60px;
		margin:auto;
		padding:20px 0;
		img{
			width: 60px;height: 60px;
		}
		
	}
	.signonsuccess{
		font-size: 16px;
		text-align: center;
	}
}	
	
	
</style>