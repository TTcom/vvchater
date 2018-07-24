<template>
	<div class="motai">
	<div class="success">
		  <div class="progressbaranimate">
		    
		      <progress :value="speed"  max="100"></progress>
		      <div class="progresstext"><span class="speed">{{speed}}%</span></div>
		    </div>

		<div class="signonsuccess">
			{{sendtext}}
		</div>
		
	</div>
	</div>
</template>

<script>
	export default{
		props:{
			sendtext:{
				type:String,
				default:"发送中"
			},
			speed:{
				type:Number,
				default:0
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
		top: 0;left: 0;bottom: 30%;right: 0;
		z-index: 9991;
		background-color: white;
	.progressbaranimate{
		position: relative;
		width:200px;
		margin:auto;
		padding-top: 40px;
        padding-bottom: 10px;
		progress {
	    width: 200px;
	    border: 1px solid #0064B4;  
	    }
	    .progresstext{
	    	text-align: center;
	    	.speed{
	    	font-size: 13px;
	    	line-height: 30px;
	        }
	    }
	   
		progress::-webkit-progress-bar { background: white; }
        progress::-webkit-progress-value  { background: dodgerblue; }
	}
	.signonsuccess{
		font-size: 16px;
		text-align: center;
	}
}	
	
	
</style>