<template>
	<div>
        <div class="mannertitle">
           <div class="titleinner">
        	 <div>后台用户管理</div>  
        	 <div class="manngersinout" @click="mannersignout">退出</div>
          </div>
        </div>
        <error :errortext="errortext" v-if="iserror"></error>
        <loading :loadingtext="loadingtext" v-if="isloading"></loading>
        <success v-if="issuccess" :successtext="successtext"></success>
        <frame @sure="sure" @cannel="cannel" ref="frame"></frame>
        <div class="mannermain">
         <div class="content">
           <div class="usersearch">用户搜索</div>
           <div class="searchinput">
           	 <input type="text"  v-model="searchtext" @keyup="keysearch($event)"/>
           	 <button type="button" @click="searchuser(0)" >搜索</button>
           </div>
           <div class="margin10">
           </div>
          <div class="usersearch">用户列表</div>
         	<table>
         		<tr>
         			<td>姓名</td>
         			<td>密码</td>
         			<td>性别</td>
         			<td>年龄</td>
         			<td>身高</td>
         			<td>操作</td>
         		</tr>
         		<tr v-for="(item,i) in userarr">
         			<td>{{item.username}}</td>
         			<td><span>******</span></td>
         			<td>—</td>
         			<td>—</td>
         			<td>—</td>
         			<td>
         				<span class="cchange" @click="updateuser(item)">密码重置</span>
         				<span class="cdelet" @click="deletuser(item)">删除</span>
         			</td>
         		</tr>
         		
         	</table>
         	<paging ref="paginger"  @pages="pagingmessage"  :showItem="showItem" :allpage="allpage"></paging>
         </div>      
	
		</div>
	</div>

	</div>
</template>

<script>
import axios from 'axios';	
import Frame from 'base/frame/frame'
import Paging from 'base/Paging/Paging'
import Success from 'base/success/success'
import Error from 'base/error/error'
import Loading from 'base/loading/loading'
  export default{
  	  components:{
  	  	Frame,
  	  	Paging,
  	  	Success,
  	  	Error,
  	  	Loading
  	  },
  	  created(){
  		 this.getUserMessage();

  	  },
  	  data(){
  	  	return{
  	  		isdelet:false,
  	  		showItem:5,
  	  		allpage:0,
  	  		shownum:6,
  	  		userarr:[],
  	  		password:"",
  	  		indexid:"",
  	  		errortext:"失败",
  	  		iserror:false,
  	  		deleteid:"",
  	  		issuccess:false,
  	  		successtext:"成功",
  	  		searchtext:"",
  	  		isloading:false,
  	  		loadingtext:"",
  	  		searchpaging:false,
  	  		username:"",
  	  		udpwname:""
  	  	}
  	  },
  	  methods:{
  	  	
  	  	mannersignout(){     //管理员退出登录
  	  		axios.post("chat/signOut").then(res=>{
      			
      			if(res.data.code===0){
      				 this.$router.replace('/');
      			}
      			
      		})
  	  	},
  	  	getUserMessage(){     //获取用户信息
      		
      		axios.post("chat/getUserInfo").then(res=>{

                if(res.data.code===1){
                	this.getusermessage(1);
      		    	
      		   }else{
      		    	this.$router.replace('/');
      		   }
                
      		})
      	},
  	 
  	  	keysearch(ev){     //用户搜索按键事件
	        if(ev.keyCode==13){
	           
		   	   this.searchuser(1);
		   	  }  	
		   	 if(this.searchtext==""){    //如果搜索内容为空用户列表则恢复为所有用户
		   	 	this.lookall()
		   	 }
  	  	},  	  	
  	  	searchuser(current){    //用户模糊查询
  	  		
  	  		this.searchpaging=true;
  	  		if(this.searchtext==""){
  	  			return;
  	  		}else{
  	  			//显示加载状态
  	  		   this.loadingtext="获取中"
  	  		   this.isloading=true;
  	  			
  	  	 		let params = new URLSearchParams();
			         params.append('username', this.searchtext);
			     	 params.append('currentPage', current);
			        params.append('pageSize', this.shownum);
	
				axios({
				  method: 'post',
				  url: 'user/findusers',
				  headers:{
				        'Content-type': 'application/x-www-form-urlencoded'
				    },
				  data:params
				}).then(res=>{
					
					if(res.data.code==3){   //无管理员权限
						this.$router.replace('/');
						
					}else{
						this.isloading=false;
						console.log(res);
						  if(current==1){    //如果为第一页或第一次搜索
						  	this.$refs.paginger.current=1;
						  }
						 //获取总页数
						this.allpage=parseInt(res.data.message);
						//获取当前页用户信息
						this.userarr=res.data.data;
					}
				})
	
  	  		}
  	  		
  	  	},
  	  	lookall(){       //查看所有用户
  	  		
  	  		this.searchpaging=false;
  	  		//获取所有的用户并跳转到第一页
  	  		this.getusermessage(1);
  	  		
  	  	},
  	  	uploaduser(){      //重置用户密码
  	  		
  	  		    this.loadingtext="重置中"
  	  		    this.isloading=true;
  	  	 		let params = new URLSearchParams();
  	  	 		  params.append('id', this.indexid);
			      params.append('username', this.username);
			      params.append('password', 111111);
				axios({
				  method: 'post',
				  url: 'user/updateuser',
				  headers:{
				        'Content-type': 'application/x-www-form-urlencoded'
				    },
				  data:params
				}).then(res=>{
					//清除存储的用户的信息
					this.username="";
					this.password="";
					this.indexid="";
					if(res.data.code===0){   //重置成功
                        this.isloading=false;
		  	  			if(this.timer){
		  	  				 clearTimeout(this.timer)
		  	  			}
		  	  			this.successtext="重置成功"
		  	  			this.issuccess=true;
		  	  			this.timer=setTimeout(()=>{
		  	  				this.issuccess=false;
		  	  			},1500);
		  	  			
					}else if(res.data.code===1){   //不可重置在线用户
						this.isloading=false;
						if(this.timer){
		  	  				 clearTimeout(this.timer)
		  	  			}
		  	  			this.errortext="不可重置在线用户"
		  	  			this.iserror=true;
		  	  			this.timer=setTimeout(()=>{
		  	  				this.iserror=false;
		  	  			},1500)
						
					}else if(res.data.code==3){   //没有管理员权限
						this.$router.replace('/');
						
					 }

				})	
  	  		
  	  	},
  	  	updateuser(item){    //修改用户
  	  		this.username=item.username;
  	  		this.indexid=item.id;
  	  		this.uploaduser();
  	  		
  	  	},
  	  	pagingmessage(current){
  	  		//判断是否为模糊搜索查询
  	  		if(this.searchpaging){
  	  			this.searchuser(current)
  	  		}else{
  	  			this.getusermessage(current)
  	  		}
  	  	},
  	  	getusermessage(current){    //获取所有用户列表分页

  	  	 		let params = new URLSearchParams();
  	  	 		  //插入每页显示的条数
			      params.append('pageSize', this.shownum);
			      //插入显示的页数
			      params.append('currentPage', current);
				axios({
				  method: 'post',
				  url: 'user/findUsersByPage',
				  headers:{
				        'Content-type': 'application/x-www-form-urlencoded'
				    },
				  data:params
				}).then(res=>{
					
					if(res.data.code==3){     //如果没有管理员权限
						this.$router.replace('/');
					
					}else{
						console.log(res)
						this.allpage=parseInt(res.data.message);
						this.userarr=res.data.data;
						if(current==1){
							this.$refs.paginger.current=1;
						}
					}
				})	
  	  	},
  	  	deletuser(item){    //删除用户
  	  		
  	  		    this.deleteid=item.id;  //存储想要删除的用户的id
  	  		    //显示删除提示模态层
  	  		    this.$refs.frame.show();
  	  		
  	  	},
  	  	sure(){   //确认删除按钮操作
  	  		console.log("确认删除");
  	  		this.$refs.frame.hide();
  	  		let params = new URLSearchParams();
			      params.append('id',this.deleteid);
				axios({
				  method: 'post',
				  url: 'user/deletuser',
				  headers:{
				        'Content-type': 'application/x-www-form-urlencoded'
				    },
				  data:params
				}).then(res=>{
					
					console.log(res);
					if(res.data.code===0){        //删除成功
		  	  			if(this.timer){
		  	  				 clearTimeout(this.timer)
		  	  			}
		  	  			this.successtext="删除成功"
		  	  			this.issuccess=true;
		  	  			this.timer=setTimeout(()=>{
		  	  				this.issuccess=false;
		  	  			},1500);
		  	  			if(this.searchpaging){    //如果是在搜索的用户列表下删除用户则重新获取搜索的用户信息
		  	  				
  	  			           this.searchuser(1);
  	  			           
			  	  		}else{  //如果不是则获取所有的用户
					  	  		this.lookall();
			  	  		}
		  	  			
					}else if(res.data.code===3){      //如果删除的是在线的用户
						
		  	  			if(this.timer){
		  	  				 clearTimeout(this.timer)
		  	  			}
		  	  			this.errortext="不可删除在线用户"
		  	  			this.iserror=true;
		  	  			this.timer=setTimeout(()=>{
		  	  				this.iserror=false;
		  	  			},1500)
					}else if(res.data.code===1){      //如果删除的用户不存在
						
		  	  			if(this.timer){
		  	  				 clearTimeout(this.timer)
		  	  			}
		  	  			this.errortext="用户不存在"
		  	  			this.iserror=true;
		  	  			this.timer=setTimeout(()=>{
		  	  				this.iserror=false;
		  	  			},1500)
					}else if(res.data.code===4){    //如果没有删除用户的权限
						this.$router.replace('/');
					}

				});
  	  		
  	  	},
  	  	cannel(){    //取消删除用户
  	  		console.log("取消删除");
  	  		this.$refs.frame.hide();
  	  	}
  	  }
  	
  }


</script>

<style lang="scss">
	@import "common/css/element.scss";
.mannertitle{
	background-color: #DCDCDC;
	width:100%;
	.titleinner{
		@include list(row,space-between,center);
		height: 35px;
		font-size: 16px;
		color: black;
		width:1032px;
		margin:auto;
		padding: 0 15px;
	}
	.manngersinout{
		color: red;
		cursor: pointer;
	}
}
.mannermain{
	height: 100vh;
    overflow: auto;
    width: 100%;
    padding-right: 17px;	
.content{
	background-color: #fff;
    border: 1px solid #dcdcdc;
    min-height: 500px;
    padding: 15px;
    margin: auto;
    margin-top: 30px;
    width: 1000px;
    overflow: auto;
	.usersearch{
		font-size: 15px;
		margin:15px 0;
	}
	.lookall{
		text-align: right;
		height: 30px;
		line-height: 30px;
		color: darkblue;
		font-size: 13px;
		cursor: pointer;
	}
	.searchinput{
		input{width: 300px;border: none;outline: none;
		border: 1px solid #DCDCDC;border-radius: 5px;height: 25px;
		padding-left: 10px;
		}
	    button{width: 60px;outline: none;
	    border: none;background-color: lightskyblue;border-radius: 5px;
	    height: 25px;color: white;font-size: 15px;vertical-align: middle;
	    margin-left: 9px;cursor: pointer;
	    }
	}
	table{
		width: 100%;
		font-size: 13px;
		border-top: 1px solid #DCDCDC;
		border-bottom: 1px solid #DCDCDC;
	    tr{
	    	border-bottom:1px solid #DCDCDC;
	    	td{
	    		text-align: center;
	    		line-height: 40px;
	    	}
	    }
	}
	.cchange{
		color: #00BFFF;
		font-size: 13px;
		cursor: pointer;
	}
	.cdelet{
		color: red;
		font-size: 13px;
		margin-left: 10px;
		cursor: pointer;
	}
	.mannerinput{
		height: 25px;
		border: none;
		border: 1px solid #DCDCDC;
		border-radius: 5px;
		padding-left: 10px;
	}
	.mannerbtn{
		width: 100px;
		height: 27px;
		border: none;
		outline: none;
		background-color: lightskyblue;
		color: white;
		border-radius:5px ;
		cursor: pointer;
		margin-left: 9px;
	}
	.margin10{
		margin:30px 0;
	}
	.editspan{
		font-size: 13px;
	}
}	
	
}	
	
	
</style>