<template>
	<div class="motai">
	<div class="success">
		  <div class="successanimate">
		    <img src="./duihao.png"/>
		    <div class="div11"></div>
		    </div>

		<div class="signonsuccess">
			{{successtext}}
		</div>
		
	</div>
	</div>
</template>

<script>
	export default{
		props:{
			successtext:{
				type:String,
				default:"成功"
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
	.successanimate{
		position: relative;
		width:100px;
		margin:auto;
		img{
			width: 100px;height: 100px;
		}
		.div11{
		  	position: absolute;width: 100px;height: 100px;animation: myfirst 1s forwards;
		    top: 0;
		    background:#fff;
		    left:0;
		   }
	}
	.signonsuccess{
		font-size: 15px;
		height: 15px;
		line-height: 15px;
		text-align: center;
	}
}	
	@keyframes myfirst
	{
	0%   {left: 0;}
	
	100% {left:100px;}
	}
	
	
	
</style>