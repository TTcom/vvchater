<template>
	<div v-show="ismannger">
		
        <div class="mannertitle">
           <div class="titleinner">
        	 <div>欢迎进入后台管理页面</div>  
        	 <div class="manngersinout" @click="mannersignout">退出</div>
          </div>
        </div>
        <error :errortext="errortext" v-if="iserror"></error>
        <loading :loadingtext="loadingtext" v-if="isloading"></loading>
        <success v-if="issuccess" :successtext="successtext"></success>
         <div>
         	<frame @sure="sure" @cannel="cannel" ref="frame"></frame>
         </div>
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
         		<tr v-for="(item,i) in userarr" v-if="item.authority!=1">
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
  	  		shownum:4,
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
  	  		ismannger:true,
  	  		udpwname:""
  	  	}
  	  },
  	  methods:{
  	  	mannersignout(){
  	  		axios.post("chat/signOut").then(res=>{
      			
      			if(res.data.code===0){
      				this.successtext="退出成功";
      				this.issuccess=true;
      				if(this.timer){
		  	  		   clearTimeout(this.timer)
		  	  		}
      				this.timer=setTimeout(()=>{
      					    this.issuccess=false;
         	                this.$router.replace('/');
		  	  		},1500);
      			}
      			
      		})
  	  	},
  	  	getUserMessage(){              //获取用户信息
      		
      		axios.post("chat/getUserInfo").then(res=>{

      		    if(res.data.code!=1){
      		    	this.$router.replace('/');
      		    	return;
      		    }else{
      		    	 this.ismannger=true;
      		    	 this.getusermessage(1);
      		    }
      		})
      	},
  	 
  	  	keysearch(ev){
	        if(ev.keyCode==13){
	        
		   	   this.searchuser(0);
		   	  }  	
		   	 if(this.searchtext==""){
		   	 	this.lookall()
		   	 }
  	  	},  	  	
  	  	testpassword(ev){
	        if(ev.keyCode==13){
		   	   this.searchuser(0)
		   	  }
  	  	},
  	  	searchuser(current){
            if(!this.searchpaging){
            	this.$refs.paginger.current=1;
            }
  	  		this.searchpaging=true;
  	  		if(this.searchtext==""){
  	  			return;
  	  		}else{
  	  		   this.loadingtext="搜索中"
  	  		   this.isloading=true;
  	  			
  	  	 		let params = new URLSearchParams();
			      params.append('username', this.searchtext);

			     if(current==0){
			     	params.append('currentPage', 1);
			     }else{
			     	 params.append('currentPage', current);
			     }
			        params.append('pageSize', 4);
	
				axios({
				  method: 'post',
				  url: 'user/findusers',
				  headers:{
				        'Content-type': 'application/x-www-form-urlencoded'
				    },
				  data:params
				}).then(res=>{
					this.isloading=false;
					console.log(res);
					  if(current==0){
					  	this.$refs.paginger.current=1;
					  }
					this.allpage=parseInt(res.data.message);
					this.userarr=res.data.data;
				})
	
  	  		}
  	  		
  	  	},
  	  	lookall(){
  	  		this.searchpaging=false;
  	  		this.getusermessage(1,2);
  	  		
  	  	},
  	  	uploaduser(){
  	  		
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
					console.log(res);
					this.username="";
					this.password="";
					this.indexid="";
					if(res.data.code===0){
		  	  			this.updateusermessage(this.$refs.paginger.current);
					}else if(res.data.code===1){
						this.isloading=false;
						if(this.timer){
		  	  				 clearTimeout(this.timer)
		  	  			}
		  	  			this.errortext="不可重置在线用户"
		  	  			this.iserror=true;
		  	  			this.timer=setTimeout(()=>{
		  	  				this.iserror=false;
		  	  			},1500)
						
					}
				})	
  	  		
  	  	},
  	  	updateusermessage(current){   //更新用户信息
  	  		
  	  	 		let params = new URLSearchParams();
			      params.append('pageSize', this.shownum);
			      params.append('currentPage', current);
				axios({
				  method: 'post',
				  url: 'user/findUsersByPage',
				  headers:{
				        'Content-type': 'application/x-www-form-urlencoded'
				    },
				  data:params
				}).then(res=>{
					this.allpage=parseInt(res.data.message);
					this.userarr=res.data.data;
                    this.isloading=false;
		  	  			if(this.timer){
		  	  				 clearTimeout(this.timer)
		  	  			}
		  	  			this.successtext="更新成功"
		  	  			this.issuccess=true;
		  	  			this.timer=setTimeout(()=>{
		  	  				this.issuccess=false;
		  	  			},1500);
				})
  	  	},
  	  	updateuser(item){    //修改用户
  	  		this.username=item.username;
  	  		this.indexid=item.id;
  	  		this.uploaduser();
  	  		
  	  	},
  	  	pagingmessage(current){
  	  		if(this.searchpaging){
  	  			this.searchuser(current)
  	  		}else{
  	  			this.getusermessage(current)
  	  		}
  	  	},
  	  	getusermessage(current,index){    //分页

  	  	 		let params = new URLSearchParams();
			      params.append('pageSize', this.shownum);
			      params.append('currentPage', current);
				axios({
				  method: 'post',
				  url: 'user/findUsersByPage',
				  headers:{
				        'Content-type': 'application/x-www-form-urlencoded'
				    },
				  data:params
				}).then(res=>{
					console.log(res.data.data)
					this.allpage=parseInt(res.data.message);
					this.userarr=res.data.data;
					if(index===2){
						this.$refs.paginger.current=1;
					}
				})	
  	  	},
  	  	deletuser(item){
  	  		
  	  		    this.deleteid=item.id;
  	  		    this.$refs.frame.show();
  	  		
  	  	},
  	  	sure(){
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
					if(res.data.code===0){
		  	  			if(this.timer){
		  	  				 clearTimeout(this.timer)
		  	  			}
		  	  			this.successtext="删除成功"
		  	  			this.issuccess=true;
		  	  			this.timer=setTimeout(()=>{
		  	  				this.issuccess=false;
		  	  			},1500);
		  	  			if(this.searchpaging){
  	  			           this.searchuser(0)
			  	  		}else{
					  	  		this.lookall();
			  	  		}
		  	  			
					}else if(res.data.code===3){
						
		  	  			if(this.timer){
		  	  				 clearTimeout(this.timer)
		  	  			}
		  	  			this.errortext="不可删除在线用户"
		  	  			this.iserror=true;
		  	  			this.timer=setTimeout(()=>{
		  	  				this.iserror=false;
		  	  			},1500)
					}else if(res.data.code===1){
						
		  	  			if(this.timer){
		  	  				 clearTimeout(this.timer)
		  	  			}
		  	  			this.errortext="用户不存在"
		  	  			this.iserror=true;
		  	  			this.timer=setTimeout(()=>{
		  	  				this.iserror=false;
		  	  			},1500)
					}

				});
  	  		
  	  	},
  	  	cannel(){
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
.content{
	min-height: 500px;
	width: 1000px;
	border: 1px solid #DCDCDC;
	margin: auto;
	margin-top: 20px;
	padding: 15px;
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
	
	
	
	
</style>