<template>
	<div>
	<div class="frameindex" v-show="showflage">
		<div class="fcontent">
		<div class="framecontent">
			<div>
           	  <span class="editspan">密码：</span> <input type="text" @keyup="keyupdate($event)"  v-model="password" maxlength="13" class="mannerinput" />
            </div>
			<span class="config" @click="sure">确定</span>
			<span class="defal"  @click="cannel">取消</span>
		</div>
		</div>
	</div>	
	</div>
	
</template>

<script>
	
	export default{
		data(){
			return{
				showflage:false,
				password:""
			}
		},
		methods:{
			show(){
				this.showflage=true
			},
			hide(){
				this.showflage=false
			},
			cannel(){
				this.$emit('cannel')
			},
			sure(){
				this.$emit('sure')
			}
			
			
		}

	}
	
</script>

<style lang="scss">
	
	.frameindex{
		position: fixed;
		top: 0;bottom: 0;
		width: 100%;
		z-index: 997;
		background:rgba(0,0,0,0.3);
	}
	.fcontent{
		width: 100%;
		height: 100%;
		position: relative;
	}
	.framecontent{
		width: 290px;
		height: 100px;
		background-color: white;
		z-index: 999;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		text-align: center;
		p{
			height: 60px;
            line-height: 60px;  
		}
		.config{
			padding: 3px 15px;
			background-color: #00BFFF;
			color: white;
			font-size: 14px;
			border-radius:5px;
			margin: 0 5px;
			cursor: pointer;
		}
		.defal{
			@extend .config;
			background-color: red;

		}
		
	}
	
</style>