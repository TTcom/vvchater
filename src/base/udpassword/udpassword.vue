<template>
	<div>
	<div class="frameindex" v-show="showflage">
		<div class="fcontent">
		<div class="udpwframecontent">
			<div class="udpwtitle text-center">{{name}}—密码重置</div>
			<div class="udpwinput">
				<input type="password" v-model="password"  @focus="ispasswordnull=false" placeholder="请输入密码"/>
			</div>
			<div class="cred"  >
				<span v-show="ispasswordnull">密码不可为空，不可小于六位</span>
			</div>
			<div class="udpwinput">
				<input type="password" @keyup="keyupdate($event)" maxlength="13" v-model="passwordagin" @focus="isnotcommon=false"  placeholder="请再输一次密码"/>
			</div>
			<div class="cred"  >
				<span v-show="isnotcommon">两次密码不一致</span>
			</div>
			<div class="btmbtn">
			<span class="config" @click="sure">确定</span>
			<span class="defal"  @click="cannel">取消</span>
			</div>
		</div>
		</div>
	</div>	
	</div>
	
</template>

<script>
	
	export default{
		props:{
			name:{
				type:String,
				default:"李华"
			}
		},
		data(){
			return{
				showflage:false,
				password:"",
				passwordagin:"",
				ispasswordnull:false,
				isnotcommon:false
			}
		},
		methods:{
			keyupdate(ev){
	        if(ev.keyCode==13){
		   	   this.sure();
		   	  }  	  		
  	  	   },
			show(){
				this.showflage=true
			},
			hide(){
				this.password="";
				this.passwordagin="";
				this.showflage=false
			},
			cannel(){
				this.$emit('cannel')
			},
			sure(){
				if(this.password=="" || this.password.length<6){
					this.ispasswordnull=true;
					return
				} 
				if(this.passwordagin!=this.password){
					this.isnotcommon=true;
					return
				}
				this.$emit('sure',this.password)
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
	.udpwframecontent{
		width: 300px;
        height: 163px;
		background-color: white;
		z-index: 999;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		text-align: center;
		.udpwtitle{margin: 10px 0;}
		.udpwinput{   
			    input{
			      border: 1px solid #dcdcdc;
                  height: 20px;
                  padding-left: 10px;
                  outline: none;
                  width: 200px;
                  } 
                 }
		.cred{color: red;
		      font-size: 12px;
			  width: 200px;
			  text-align: left;
			  padding-left: 55px;
			  height: 20px;
			  line-height: 20px;
		}
		.btmbtn{
			margin-top: 10px;
		}
		.config{
			padding: 3px 26px;
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