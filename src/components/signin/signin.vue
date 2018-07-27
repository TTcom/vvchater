<template>
	<div>

        <success :successtext="successmsg" v-if="successsignon"></success>
        <success :successtext="signinsuccessmsg" v-if="successssiginin"></success>
        <error :errortext="errortext" v-if="iserror"></error>
		<div class="login" :class="{height450:!isSignin}">
			<h2>
				<span v-if="isSignin">欢迎登录聊天平台</span><span v-if="!isSignin">欢迎注册聊天平台</span>
			</h2>
		    <div class="logininput">
		    	 <input type="text"   @keydown="notallownull($event)"    @keyup="debounce($event)" maxlength="11"  placeholder="请输入用户名" v-model="username"/>
		    </div>
		    <div class="usererro">
		       <span  v-if="isSignin && isnothaveuser">用户名未注册</span><span v-if="ishaveuser">该用户名已存在,请重新输入</span><span v-if="isnulluser">用户名不可为空且不可小于2位</span>
		    </div>
		    <div class="logininput marginbottom0">
		    	   <input type="password"  @keydown="notallownull($event)"  @keyup="testpassword($event)" @focus="getfocus"   maxlength="13"  placeholder="请输入6至13位密码" v-model="password"/>
		    </div>
		    <div class="usererro">
		    	<span v-if="isnullpassword">密码不可为空</span>
		    	<span v-if="issurelength">密码不可小于6位</span>
		    	<span v-if="iserrorpassword">密码错误,请重新输入</span>
		    </div>			
		    <div class="logininput marginbottom0" v-if="!isSignin">
		    	   <input type="password" maxlength="13" @keydown="notallownull($event)"  @keyup="testpassword($event)"  @focus="isnotcommon=false"    placeholder="请再输一遍密码" v-model="passwordagain"/>
		    </div>
		    <div class="usererro" v-if="!isSignin">
		    	<span v-if="isnotcommon && !isSignin">请输入一致的密码</span>
		    </div>	
	
		    <div class="logininput">
		    	  <button type="button" @click="sinonorin"><span v-if="isSignin">登录</span><span v-if="!isSignin">注册</span></button>
		    </div>
		    <div class="nouser">
		    	   <span v-if="isSignin">没有账号？</span><span v-if="!isSignin">已有账号？</span><span class="cblack" @click="signup"><span v-if="isSignin">注册</span><span v-if="!isSignin">登录</span></span>
		    </div>
	 </div>
	</div>
	
	
</template>

<script>
import axios from 'axios';
import Success from 'base/success/success'
import Error from 'base/error/error'
import {http} from 'common/js/http'
    let timer
	export default{
		components:{
			Success,
			Error
		},
		data(){
		   return{
		   	  isSignin:true,
		   	  isplay:true,
		   	  username:"",
		   	  password:"",
		   	  passwordagain:"",
		   	  ishaveuser:false,
		   	  isnulluser:false,
		   	  isnullpassword:false,
		   	  isnotcommon:false,
		   	  successmsg:"注册成功",
		   	  signinsuccessmsg:"登陆成功",
		   	  successsignon:false,
		   	  isnothaveuser:false,
		   	  iserrorpassword:false,
		   	  successssiginin:false,
		   	  issurelength:false,
		   	  errortext:"用户已在别处登录",
		   	  iserror:false
		   }
		},
		created(){
	
	       this.getUserMessage()

		},
		methods:{
			  getUserMessage(){              //获取用户信息
	      		
	      		axios.post("chat/getUserInfo").then(res=>{
	      			
	      		    console.log(res);
	      		    if(res.data.code==1){
	      		    	 this.$router.replace({
								path:'/manage'
							})		
	      		    }else if(res.data.code==0){
	      		    	 this.$router.replace({
								path:'/chatting'
							})		
	      		    	 
	      		    }
	      		})
	      	},
		   notallownull(ev){   //限制输入空格
		   	if(ev.keyCode == 32)ev.returnValue = false;
		   },
           getfocus(){
           	this.isnullpassword=false;
           	this.issurelength=false;
           },
			userlogin(){    //聊天用户登录
				
				if(this.username==="" || this.username.length<2){
					this.isnulluser=true;
					return     
				}
				if(this.password===""){
					this.isnullpassword=true;
					return
				}				
				if(this.isnothaveuser){
					return
					
				}
			  let params = new URLSearchParams();
			      params.append('username', this.username);
			      params.append('password', this.password);
				axios({
				  method: 'post',
				  url: 'user/userlogin',
				  headers:{
				        'Content-type': 'application/x-www-form-urlencoded'
				    },
				  data:params
				}).then(res=>{
					console.log(res);
                      if(res.data.code===0){
                      	
                      	this.successssiginin=true;
						setTimeout(()=>{
							this.successssiginin=false;
							
							let value=JSON.stringify(this.username);
							sessionStorage.setItem("loginuser",value)
							
						this.$router.replace({
					   	  	 path:'/chatting'
					   	  })
						},2000)
                      	
                     }else if(res.data.code===1){
                      	this.iserrorpassword=true;
                     }else if(res.data.code===2){
                      	this.successssiginin=true;
						setTimeout(()=>{
							this.successssiginin=false;	
							this.$router.replace({
								path:'/manage'
							})		
						},2000)
                      }else if(res.data.code===4){
                      	
                      	     this.iserror=true;
		      				if(this.timer){
				  	  		   clearTimeout(this.timer)
				  	  		}
		      				this.timer=setTimeout(()=>{
		      					    this.iserror=false;
				  	  		},600);
                      	
                      }
				      
				})
			},
			testpassword(ev){
				if(this.password!=""){
				   this.isnullpassword=false
				   this.iserrorpassword=false
				   if(ev.keyCode==13){
					   	if(this.isSignin){
						   	   this.userlogin();
						}else{
							  this.userRegister();
						}
				    }
				 } 
			},
			iscommon(){   //判断用户是否存在
			  let params = new URLSearchParams();
			      params.append('username', this.username);
				axios({
				  method: 'post',
				  url: 'user/repeatuser',
				  headers:{
				        'Content-type': 'application/x-www-form-urlencoded'
				    },
				  data:params
				}).then(res=>{
					console.log(res);
					if(!this.isSignin){
						if(res.data.code===1){
							this.ishaveuser=true;
						}else{
							this.ishaveuser=false;
						}
					}else{
						if(res.data.code===0 && this.username!==""){
							this.isnothaveuser=true;
						}else{
							this.isnothaveuser=false;
						}
						
					}
				})
			},
			debounce(ev){   //请求节流
				if(this.username!=""){          
			 	   this.isnulluser=false;
			    }
				if(this.username===""){
					this.isnulluser=false;
			     //	this.isnothaveuser=false;
				}
				if(ev.keyCode==13){
					if(this.isSignin){
					   	   this.userlogin();
					}
				}
			     if(timer){
			       	clearTimeout(timer)
			       }
			       timer = setTimeout(()=>{
			           this.iscommon()
			       },700)
				
			},
			userRegister(){
				
				if(this.username=="" || this.username.length<2){
					this.isnulluser=true;
					return;
				}
				 if(this.password.length<6){
			   	 	this.issurelength=true;
			   	 	return;
			   	}				
				if(this.ishaveuser){return;}
				
				if(this.password==""){
					this.isnullpassword=true;
					return;
				}
			    if(this.passwordagain!=this.password){
                    this.isnotcommon=true;
			    	return;
			    }
			  let params = new URLSearchParams();
			      params.append('username', this.username);
			      params.append('password', this.password);
				axios({
				  method: 'post',
				  url: 'user/register',
				  headers:{
				        'Content-type': 'application/x-www-form-urlencoded'
				    },
				  data:params
				}).then(res=>{
					
					if(res.data.code===1){
						this.successsignon=true;
						setTimeout(()=>{
							this.successsignon=false;
							this.signup()
						},2000)
					}
					
				})
				
			},
			sinonorin(){
					if(this.isSignin){   //登陆

							this.userlogin();

					}else{       //注册
						
						   this.userRegister();
					}

				
			},
			clearall(){
				this.username="";
				this.password="";
				this.passwordagain="";
				this.issurelength=false;
				this.isnothaveuser=false;
				this.ishaveuser=false;
				this.isnullpassword=false;
				this.isnulluser=false;
				this.issurelength=false;
				this.iserrorpassword=false;
				this.isnotcommon=false;
			},
			contorlmusic(){
			   if(this.isplay){
			   	this.$refs.audier.pause();
			   	this.isplay=!this.isplay
			   }else{
			   	this.$refs.audier.play();
			   	this.isplay=!this.isplay
			   }
			},
			signup(){
					this.clearall();
			        this.isSignin=!this.isSignin
					
			
			}
		}
		
	}

</script>

<style lang="scss">
		body{background-color: #f6f6f6;}
		html，body,#mydiv,canvas{
		      width:100% ！importanrt;    
		      height:100% !important;
		}	
	  .login{
	  	z-index:2;
	  	width: 390px;
	  	height: 350px;
	  	background-color:white;
	  	border-radius: 5px;
       	position: fixed;
       	top:0;
       	left: 0;
       	bottom: 0;
       	right: 0;
       	margin: auto; 
       	transition: height .5s;	
       	overflow: hidden;
       	h2{
       		color: black;
       		font-size: 30px;
       		text-align: center;
       		height: 70px;
       		line-height: 70px;
       	}
       	.title{
       		height: 40px;
       		line-height: 40px;
       		text-align: center;
       		color: black;
       		font-size: 23px;
       		font-weight: bold;
       	}
       	.logininput{
       		text-align: center;
       		margin-top: 10px;
       		input{
       			height: 45px;
       			border: none;
       			outline: none;
       			width:80%;
       			background-color: white;
       			font-size: 15px;
       			border-bottom: 1px solid black;
       		}
       		button{
       			height: 40px;
       			background-color: #5cb85c;
       			color: white;
       			width:80%;
       			text-align: center;
       			border: none;
       			outline: none;
       			font-size: 15px;
       		    border-radius: 5px;
       		    cursor: pointer;
       		    transition: all .4s;
       		}
       		button:hover{
       			background-color: green;
       		}
       	}
       	.usererro{
       		color: red;
       		font-size: 14px;
       		width: 80%;
       		margin: auto;
       		height: 25px;
       		line-height: 25px;
       	}
       	.checkht{
       		width: 80%;
            margin: auto;
            margin-top: 10px;
       		input{
       			vertical-align: middle;
       		}
       		span{
       			font-size: 15px;
       			color: black;
       			margin-left: 10px;
       			vertical-align: middle;
       		}
       	}
       	.nouser{
       		text-align: center;
       		height: 30px;
       		line-height: 30px;
       		color: black;
       		font-size: 16px;
       		.cblack{
       			color: #0366d6;
       			cursor: pointer;
       			}
       	}
       	.marginbottom0{
       		margin-bottom: 10px;
       	}
       	.forgetpassword{
       		text-align: right;
       		width: 95%;
       		color: black;
       		height: 20px;
       		line-height: 20px;
       		span{
       			cursor: pointer;
       		}
       		
       	}
	  }
	  .height450{
	  	height: 440px;
	  }
	  .music{
	  	position: fixed;
	  	bottom:20px;
	  	right: 30px;
	  	z-index: 99;
	  	img{
	  		height: 30px;
	  		width: 30px;
	  	}
	  }
	  .animation{
	  	animation:mymove 3s linear infinite;
	  }
	  .audio{
	  
	  }
	  @keyframes mymove
			{
			  0%{transform:rotate(0deg);}
			  100%{transform:rotate(360deg);}
			}
	 @media only screen and (max-width: 450px) {
	 	.login{
	 		width: 340px;
	 	}
	 	
	 }
</style>