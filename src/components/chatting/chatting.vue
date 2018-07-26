<template>
	<div>
		<success :successtext="successmsg" v-if="successsignout"></success>
	   <progressbar v-if="isprogressbar" :speed="speed" :sendtext="sendtext"></progressbar>
	<div class="containerss">
		  <div  class="box">
		  	 
		  	<div class="right">
		  		<div class="righttile gayslisttitle">
		  			<span class="fontweight rtalktitle">{{talktitle}}</span>
		  		</div>
		  		<div class="rightmiddle1">
		  		   
		  		   <div class="chatmessage" v-for="(item,i) in broadcast">
			  			<div class="messageuser" :class="{cblue:item.senderId!=userid}">
			  				<span>{{item.senderName}}</span>&ensp;<span>({{item.date}})</span>
			  			</div>
		  			    <div class="usermessage" v-if="!item.fileType">
		  			    	<p v-html="item.messageBody"></p> 
		  			    </div>
		  			    <div class="usermessage" v-if="item.fileType==1">
		  			    	<img :src="item.messageBody"/>
		  			    </div>
		  			    <div class="usermessage" v-if="item.fileType==2">
		  			    	<a :href="item.messageBody" target="_blank">{{item.filenames}}(点击下载)</a>
		  			    </div>
		  			    
		  		   </div>
		  			
		  		</div>

		  		<div style="height: 35%;">
		  			<div style="padding-left: 10px;height: 10%;border-top: 1px solid #d6d6d6;margin: 0 15px">
					          <div class="bbn">
									<input type="file"  @change="uploadpice" ref="picersss"  name="video" class="videos"  id="image"/>
									<div class="nn" > 
										<div class="isjiahao"> <img src="./upload.png" /> </div>
									</div>
								</div> 
		  			</div>
		  			<div style="height: 70%;padding: 0 15px;">
		  				<textarea  class="sendmessage" @keydown="testsend($event)"  id="textareaenter" v-model="sendmessage"></textarea>
		  				
		  			</div>
		  			<div class="bottombtn">
		  		        <span class="point">按下Ctrl+Enter换行</span>
		  				<button  type="button" class="sendbtn"   @click="websocketsend()">发送</button>
		  			</div>
		  		</div>
		  	</div>
		  	<div  class="gayslist" style="border: none;background-color: #2e3138;">
		  		<div class="rightlistitle gayslisttitlebordertop">
		  	  		
		  	  		<div style="padding: 0 10px;">
			          <div class="bbn11">
							<input type="file"  ref="picers"  @change="uploadpice(1)"  class="videos11"  id="image"/>
							<div class="nn11" > 
								<div class="isjiahao11"> <img  :src="userpicpath" class="usertouxiang"/> </div>
							</div>
						</div> 
		  	  			<span>{{username}}</span>
		  	  		</div>
		  	  	 <div class="titleright" @click="signout">
		  	    	<img src="./signout.png"  />
		  	    	<span>退出</span>
		  	    </div>

		  	    </div>
		  	   <div class="searchuser">
		  	    	<input type="text" v-model="searchuser" @keyup="testpassword($event)"  maxlength="13"  placeholder="用户搜索" />
		  	    	<img src="./search.png" v-show="!entersearch"/>
		  	    	<span class="clearsearch" v-show="entersearch" @click="cannelsearch">x</span>
		  	   </div>
		  	    
		  	 <div class="talkfriendlist">
		  	  	<div class="kefuone" :class="{cbgray:inlineindex==999}" @click="talkinbroad">
		  	  		<span class="fontweight positionrelative" >
		  	  			广播
		  	  		<span class="cred" v-show="isnewborad">{{broadcastnumber}}</span>
		  	  		</span>
		  	  	</div>		 
		  	  	
		       <div  v-for="(item,i) in userlist" v-if="item.username!=username" class="kefuone" :class="{cbgray:i==inlineindex}" @click="friendtalk(i,item)">
		  	  		<span class="positionrelative">
		  	  			{{item.username}}
		  	  		  <span class="cred" v-show="item.isnewmessage">{{item.messagenumber}}</span>
		  	  		</span>
		  	   </div>
		  	  </div>
		  	 <div class="messageprompt">
		  	  	<span>消息提示</span>
		  	  </div>
		  	  <div class="promptlist">
		  	  	<ul>
		  	  		<li v-for="item in promptlistarr" :class="{cpred:item.type==2}" >
		  	  			<span>{{item.username}}</span>
		  	  			<span class="pdate">{{item.date}}</span>
		  	  		</li>
		  	  	</ul>
		  	  	
		  	  </div>
		  	  <div>
		  	  	
		  	  </div>
		  	  
		  	  </div>

		  </div>
		
    </div>
		<router-view></router-view>
	</div>
	
</template>

<script>
	import axios from 'axios'
	import {http} from 'common/js/http'
	import Progressbar from 'base/progress/progress'
	import Success from 'base/success/success'
	export default{
      components:{
      	Progressbar,
      	Success
      },
      data(){
      	return{
      		username:"",
      		inlinefriend:[],
      		talkingfriend:[],
      		sendmessage:"",
      		userpicpath:"static/boy.jpg",
      		userlist:[],
      		broadcast:[],
      		inlineindex:999,
      		talktitle:"广播",
      		receiverId:"",
      		receiverName:"",
      		userid:"",
      		serverip:"",
      		filepath:"",
      		filenames:"",
      		picpath:"",
      		isprogressbar:false,
      		speed:0,
      		sendtext:"发送中",
      		successsignout:false,
      		successmsg:"退出成功",
      		broadarr:[],
      		isnewborad:false,
      		searchuser:"",
      		promptlistarr:[],
      	    searchuserlist:[],
      	    entersearch:false,
      	    broadcastnumber:0,

      	}
      },
      created(){
     	 sessionStorage.clear()
      	 this.getUserMessage();
      },  
      methods:{

      	testsend(ev){

      		 if( ev.ctrlKey && ev.keyCode == 13 )   
				{   
				     this.sendmessage=this.sendmessage+"\n";
				     console.log(this.sendmessage)
                    return;
				}
			
			if(ev.keyCode==13){
				if (window.event) {
					console.log(35235235)
					window.event.returnValue = false;
	                this.websocketsend();
	            }else{
	            	 console.log(35235235)
	               	  ev.preventDefault(); //for firefox
	               	  this.websocketsend();
	             }
			}

      	},
      	cannelsearch(){
      		this.entersearch=false;
      		this.searchuser="";
      		this.userlist=[];
      		this.userlist=this.searchuserlist.slice();
      		this.searchuserlist=[];
      	},
      	testpassword(ev){
				
				   if(ev.keyCode==13){
				   	  if(this.searchuser!=""){
				   	  	this.talkinbroad();
				   	  	this.entersearch=true;
                         var arr=[];
                         this.searchuserlist=this.userlist.slice();
                         this.userlist.forEach((value,i)=>{
                         	if(this.userlist[i].username.indexOf(this.searchuser)>=0){
                         		arr.push(this.userlist[i]);
                         		
                         	}
                         })
                          this.userlist=arr;
						  console.log(arr);
				   	  }
				  }
      	},
      	friendtalk(i,item){    //好友列表聊天
      		
      		var valuee=sessionStorage.getItem(item.username);
        	 	if(valuee){
        	 		  valuee=JSON.parse(valuee);
        	 	     this.broadcast=valuee;
        	        setTimeout(()=>{
      					var obj = document.getElementsByClassName('rightmiddle1')[0]
		                      obj.scrollTop= obj.scrollHeight;   
		  	  		},500);      			        	 	     
        	 	}else{
        	 		this.broadcast=[];
        	 	}
      	  	this.inlineindex=i;
      		this.receiverId=item.id;  //接受者的id
      		this.receiverName=item.username;
      		this.talktitle=item.username;
 		  	this.userlist.forEach((value,i)=>{
 		  	 	
 		  	 	 if(value.username==item.username){
 		  	 	 	value.isnewmessage=false;
 		  	 	 	value.messagenumber=0;
 		  	 	 }
 		  	})
      	},
      	talkinbroad(){   //广播聊天
      		this.inlineindex=999;
      		this.broadcastnumber=0;
      		this.talktitle="广播";
      		this.isnewborad=false;
      		console.log(this.broadarr)
      		if(this.broadarr.length>0){
      			let _arr =this.broadarr.slice()
      			this.broadcast=_arr;
        	        setTimeout(()=>{
      					var obj = document.getElementsByClassName('rightmiddle1')[0]
		                      obj.scrollTop= obj.scrollHeight;   
		  	  		},500);      			
      			
      		}else if(this.broadarr.length==0){
      			this.broadcast=[];
      		}
      	},
      	signout(){   //退出登录
      		
      		axios.post("chat/signOut").then(res=>{
      			
      			if(res.data.code===0){
      				this.websock.close();
      				this.$router.replace('/');
//    				this.successsignout=true;
//    				if(this.timer){
//		  	  		   clearTimeout(this.timer)
//		  	  		}
//    				this.timer=setTimeout(()=>{
//    					    this.websock.close();
//    					    this.successsignout=false;
//       	                this.$router.replace('/');
//		  	  		},1500);
      				
      			}
      		})
      	},
      	getUserMessage(){              //获取用户信息
      		
      		axios.post("chat/getUserInfo").then(res=>{
      			
      		    console.log(res);
      		    if(res.data.code===3){
      		    	this.$router.replace('/');
      		    	return;
      		    }
        	   this.username = res.data.data.user.username;
        	   if(res.data.data.user.picpath){
        	   	this.userpicpath = res.data.data.user.picpath;
        	   }
      		   this.userid=res.data.data.user.id;
      		   this.serverip=res.data.message;
      		   console.log("serverip"+this.serverip);      
      		   this.initWebSocket();
      		})
      	},
      	initWebSocket(){ //初始化weosocket
                //ws地址
                var ider=this.userid;
                var serverip=this.serverip;
  
              console.log("ttttserverip"+this.serverip);
                this.websock = new WebSocket("ws://"+serverip+":8081/chat/websocket/"+ider);
                this.websock.onopen = this.websockonopen;  //建立连接
                this.websock.onmessage=this.websockonmessage;    //数据接收
                this.websock.onclose = function () {
			        console.log("WebSocket连接关闭");
			    }
		        var _this=this;
		      	window.onbeforeunload = () => { 
		      	    _this.websock.close();
		      	}

        },
        websockonopen(){   //连接成功
        	console.log("WebSocket连接成功");
        },
        websockonmessage(event){   //接收消息
        	
        	 let message=JSON.parse(event.data);
        	 console.log(message);
        	 if(message.messageType==0){    //接收广播
        	
        	 if(this.talktitle!="广播"){
        	 	this.broadcastnumber+=1;
        	 	this.isnewborad=true;
        	 	this.broadarr.push(message);
        	 	console.log(this.broadarr);
        	 }else{
        	 	this.broadarr.push(message);
        	 	this.broadcast.push(message);
        	 	
        	 }
        	 setTimeout(()=>{
      			var obj = document.getElementsByClassName('rightmiddle1')[0]
		                  obj.scrollTop= obj.scrollHeight;   
		  	 },500);

        	 	console.log("广播"+this.broadcast)
        
        	 	
        	 }else if(message.messageType==2){    //接收新上线的人
        	 	
        	 	if(this.entersearch){
        	 		
        	 		  this.searchuserlist=JSON.parse(message.messageBody);
                      this.searchuserlist.forEach((value,i)=>{
                	  this.$set(value,"isnewmessage", false)
                	  this.$set(value,"messagenumber", 0)
                	 })
        	 	}else{
        	 		 this.userlist=JSON.parse(message.messageBody);
                      this.userlist.forEach((value,i)=>{
                	  this.$set(value,"isnewmessage", false);
                	  this.$set(value,"messagenumber", 0)
                	 })
        	 	}

                if(this.userlist[this.userlist.length-1].username==this.username){
                	return;
                }
                var username=this.userlist[this.userlist.length-1].username + "上线啦";
                this.promptlistarr.push({
                	"username":username,
                	"date":message.date,
                	"type":1
                })
                
        	 	console.log("promptlistarr"+this.promptlistarr)
        	 }else if(message.messageType==1){  //私聊
        	 	
        	 	
        	 	//获取
        	  if(message.senderName==this.username){   //如果发送者是当前用户	
        	 	var valuee=sessionStorage.getItem(message.receiverName);
        	 	if(valuee){
        	 		  valuee=JSON.parse(valuee);
        	 		  valuee.push(message);
        	 		  valuee=JSON.stringify(valuee);
		        	 		  sessionStorage.setItem(message.receiverName, valuee);
		        	 		  if(this.talktitle!=message.receiverName){
		        	 		  	
		        	 		  	 this.userlist.forEach((value,i)=>{
		        	 		  	 	
		        	 		  	 	 if(value.username==message.receiverName){
		        	 		  	 	 	
		        	 		  	 	 	value.isnewmessage=true;
		        	 		  	 	 	value.messagenumber+=1;
		        	 		  	 	 	
		        	 		  	 	 }
		        	 		  	 	
		        	 		  	 })
		        	 		  	
		        	 		  }else{
		        	 		  	  this.broadcast.push(message);
		        	 		  	
		        	 		  }
        	 	}else{
        	 		//第一次存储
        	 		 let arr=[];
        	 		 arr.push(message);
                     arr=JSON.stringify(arr);
                     sessionStorage.setItem(message.receiverName, arr);
                     if(this.talktitle!=message.receiverName){
		        	 		  	 this.userlist.forEach((value,i)=>{	        	 		  	 	
		        	 		  	 	 if(value.username==message.receiverName){
		        	 		  	 	 	value.isnewmessage=true;
		        	 		  	 	 	value.messagenumber+=1;
		        	 		  	 	 }
		        	 		  	 	
		        	 		  	 })
		        	 		  	
		        	 		  }else{
		        	 		  	  this.broadcast.push(message);
		        	 		  }
        	 	}
        	 	  setTimeout(()=>{
      					var obj = document.getElementsByClassName('rightmiddle1')[0]
		                      obj.scrollTop= obj.scrollHeight;   
		  	  		},500);        	 	
        	 	}else{   //如果发送者不是当前用户
        	 		
        	 	var valuee=sessionStorage.getItem(message.senderName);
        	 	if(valuee){   //如果存在
        	 		  valuee=JSON.parse(valuee);
        	 		  valuee.push(message);
        	 		  valuee=JSON.stringify(valuee);
		        	 		  sessionStorage.setItem(message.senderName, valuee);
		        	 		  if(this.talktitle!=message.senderName){
		        	 		  	
		        	 		  	 this.userlist.forEach((value,i)=>{
		        	 		  	 	
		        	 		  	 	 if(value.username==message.senderName){
		        	 		  	 	 	value.isnewmessage=true;
		        	 		  	 	 	value.messagenumber+=1;
		        	 		  	 	 }
		        	 		  	 	
		        	 		  	 })
		        	 		  	
		        	 		  }else{
		        	 		  	  this.broadcast.push(message);
		        	 		  	
		        	 		  }
        	 	}else{
        	 		//第一次存储
        	 		 let arr=[];
        	 		 arr.push(message);
                     arr=JSON.stringify(arr);
                     sessionStorage.setItem(message.senderName, arr);
                     if(this.talktitle!=message.senderName){
		        	 		  	 this.userlist.forEach((value,i)=>{	        	 		  	 	
		        	 		  	 	 if(value.username==message.senderName){
		        	 		  	 	 	value.isnewmessage=true;
		        	 		  	 	 	value.messagenumber+=1;
		        	 		  	 	 }
		        	 		  	 	
		        	 		  	 })
		        	 		  	
		        	 		  }else{
		        	 		  	  this.broadcast.push(message);
		        	 		  }
        	 	}
        	 	  setTimeout(()=>{
      					var obj = document.getElementsByClassName('rightmiddle1')[0]
		                      obj.scrollTop= obj.scrollHeight;   
		  	  		},500);        	 	
        	 		
        	 	}
        	 }else if(message.messageType==3){  //接收下线的人
        	 	 console.log("下线的人"+message)
        	      var id= message.offlineUserId;
        	      if(this.receiverId==id){
        	    
        	      	  this.talkinbroad();
        	      	  
        	      }
        	      this.userlist.forEach((value,i)=>{
        	      	  if(value.id==id){
        	      	  	sessionStorage.removeItem(value.username);
        	      	  	this.userlist.splice(i,1)
        	      	  }
        	      });   
               if(message.offlineUserName==this.username){
      					this.websock.close();
         	            this.$router.replace('/');
                	    return;
                }
                this.promptlistarr.push({
                	"username":message.offlineUserName+"下线啦",
                	"date":message.date,
                	"type":2
                })
        	 }	
        	 
        	 
        },
        websocketsend(){   //发送消息
 
       	    if(this.inlineindex==999){    //发送广播
       		   	
       		   if(this.filepath=="" && this.picpath==""){
		        	if(this.sendmessage==""){
		        		return;
		        	}else{
		        		var reg = new RegExp("\n", "g");
						this.sendmessage = this.sendmessage.replace(reg, "<br/>");
		        	}
	       		   	  var data={
	              	  "messageType":0,
	              	  "senderId":this.userid,
	              	  "senderName":this.username,
	              	  "messageBody":this.sendmessage
	                  }
       		   }else{
       		   	  if(this.filepath!=""){
       		   	  	 var data={
	              	  "messageType":0,
	              	  "fileType":2,
	              	  "senderId":this.userid,
	              	  "senderName":this.username,
	              	  "messageBody":this.filepath,
	              	  "filenames":this.filenames
	                  }
       		   	  }else if(this.picpath!=""){
       		   	  	 var data={
	              	  "messageType":0,
	              	  "fileType":1,
	              	  "senderId":this.userid,
	              	  "senderName":this.username,
	              	  "messageBody":this.picpath
	                  }
       		   	  }  
       		   }
            }else{          //私聊
            	console.log("发送私聊发送者id"+this.userid)
            	
            	if(this.filepath=="" && this.picpath==""){
			        	if(this.sendmessage==""){
			        		return;
			        	}else{
			        		var reg = new RegExp("\n", "g");
							this.sendmessage = this.sendmessage.replace(reg, "<br/>");
			        	}
	       		   	   var data={  
		              	  "messageType":1,
		              	  "senderId":this.userid,
		              	  "receiverId":this.receiverId,
		              	  "receiverName":this.receiverName,
		              	  "senderName":this.username,
		              	  "messageBody":this.sendmessage
		              }
       		   }else{
       		   	  if(this.filepath!=""){
       		   	  	 var data={
	              	  "messageType":1,
	              	  "fileType":2,
	              	  "senderId":this.userid,
		              "receiverId":this.receiverId,
		              "receiverName":this.receiverName,
		              "senderName":this.username,
	              	  "messageBody":this.filepath,
	              	  "filenames":this.filenames
	                  }
       		   	  }else if(this.picpath!=""){
       		   	  	 var data={
	              	  "messageType":1,
	              	  "fileType":1,
	              	  "senderId":this.userid,
		              "receiverId":this.receiverId,
		              "receiverName":this.receiverName,
		              "senderName":this.username,
	              	  "messageBody":this.picpath
	                  }
       		   	  }  
       		   }
              
             }
              data=JSON.stringify(data);
              console.log(data);
        	  this.websock.send(data);
        	  this.sendmessage="";
        	  this.filepath="";
        	  this.filenames="";
        	  this.picpath="";
        	  console.log(this.sendmessage)
        },
        callback1(progressEvent){
        	
        	this.isprogressbar=true;
        	console.log(progressEvent);
        	console.log(progressEvent.loaded);
        	console.log(progressEvent.total);
        	var numlength=progressEvent.loaded / progressEvent.total * 100;
        	console.log(numlength);
        	
        	this.speed=parseFloat(numlength.toFixed(2)) ;
        	if(this.speed==100){
        		this.sendtext="发送成功";
        		setTimeout(()=>{
        			this.isprogressbar=false;
        			this.sendtext="发送中";
        			this.speed=0;
        		},500)
        		
        	}
        	
        },
      	uploadpice(i){          //图片上传
      		if(i==1){
      			var inputDOM = this.$refs.picers;
      		}else{
      			var inputDOM = this.$refs.picersss;
      		}
			let hhh=inputDOM.files[0];
			
			let imagSize = hhh.size; //图片尺寸大小单位为（b字节）

			 inputDOM.value="";	 
				 var formData = new FormData(); 
		         
		          formData.append("file", hhh);
		          if(i==1){
		          	formData.append("id", this.userid);
		          }
				let httper="file/upload";      
				var _this=this;
				 axios({
		            url:httper,
		            method:'post',
		            onUploadProgress:function(progressEvent){ //原生获取上传进度的事件
		                if(progressEvent.lengthComputable){
		                    //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
		                    //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
		                    _this.callback1(progressEvent);
		                }
		            },
		            data:formData
		        }).then(res =>{
		           console.log(res);
		           if(res.data.code==2){
		         
		           	  _this.filepath=res.data.data.path;
		           	  _this.filenames=res.data.message;
		           	  _this.websocketsend();
		           }
		           if(res.data.code==1){
		           	   if(i==1){
		           	   	   _this.userpicpath=res.data.data.path;
		           	   }else{
		           	   	 _this.picpath=res.data.data.path;
		           	     _this.websocketsend();
		           	   }
		           }
		        }).then(error =>{
		            console.log(error)
		        })			
      	}
      	
      }
		
		
	}
	
</script>
<style lang="scss">
 @import "common/css/element.scss";	
   .chatheader{
   	background-color: #eee;width: 100%;
   	margin-bottom: 20px;
   }
 	.chatindex {
 		height:50px;
 		margin-bottom: 20px;
 		max-width: 1002px;
 		color: black;
 		font-size: 16px;
 		display: flex;
 		flex-direction: row;
 		justify-content: space-between;
 		align-items: center;
 		margin: auto;
 		padding: 0 20px;
 		img{
 			
 		}
 		.usertouxiang{
 			cursor: pointer;
 			width: 30px;
 		    height: 30px;
 			}
 		.logininout{
 			color: red;
 			font-size: 15px;
 			padding-left: 10px;
 			cursor: pointer;
 		}	
 	}
 	
 	.containerss {
 		max-width: 1100px;
 		margin: 0 auto;
 		padding: 0 20px;
 		position: fixed;
 		top: 10px;
 		bottom: 10px;
 		left: 0;
 		right: 0;
 		margin: auto;
 		
 	}
 	
 	.box {
 		width: 100%;
 		height: 100%;
 		background-color: #EEEEEE;
 		display: flex;
 		flex-direction: row;
 		justify-content: flex-start;
 		font-size: 15px;
 	}	
 	
 	.gayslist {
 		width: 30%;
 		border-right: 1px solid #DCDCDC;
 		display: flex;
 		flex-direction: column;
 		justify-content: flex-start;
 		.searchuser{
 			position: relative;
		    padding: 10px;
		    background-color: #2e3138;
		    height: 40px;
		    padding-top: 0px;
		    padding-bottom: 15px;
 			input{
 				    border: none;
				    outline: none;
				    height: 32px;
				    padding-top: 3px;
				    width: 100%;
				    background-color: black;
				    color: #a9abae;
				    border-radius: 3px;
				    text-indent: 8px;
 			}
 			img{
 				position: absolute;
			    right:13px;
			    top: 10px;
			    height: 21px;
			    width: 21px;
			    cursor: pointer;
 			}
 			.clearsearch{
 				position: absolute;
			    right: 15px;
			    top: 12px;
			    height: 18px;
			    width: 18px;
			    border-radius: 50%;
			    background-color: white;
			    color: black;
			    font-size: 14px;
			    text-align: center;
			    line-height: 16px;
			    cursor: pointer;
 			}
 		}
 	}
 	.talkfriendlist{
 		overflow: auto;
 		height: 60%;
        border-bottom: 1px solid #333b47;

 	}
 	.messageprompt{
 		height: 30px;
 		line-height: 30px;
 		width: 100%;
 		span{padding-left: 10px;color: white;}
 
 	}
 	.promptlist{
 		height: 23%;
 		overflow: auto;
 		ul li{
 			padding-left:10px ;padding-bottom: 5px;padding-top: 5px;font-size: 13px;
 			color:#5cb85c;
 			 .pdate{padding-left: 10px;}
 			}
 		.cpred{color: #f0ad4e;}
 	}
 	.rightlistitle {
 		font-size: 15px;
 		font-weight: bold;
 		width: 100%;
 		height: 10%;
 		background-color: #2e3138;
 		@include list(row,space-between,center,nowrap);
 		color:white;
 		font-size:15px;
 		img{
 			height: 35px;
 			width: 35px;
 			vertical-align: middle;
 			padding-right: 5px;
 		}
 	}
 	.titleright{
 		margin-right: 10px;
 		cursor: pointer;
 		img{
 			width: 20px;
 			height: 20px;
 		}
 	}
 	
 	textarea {
 		outline: none;
 		border: none;
 		resize: none;
 	}
 	
 	.kefuone {
 		padding-bottom: 15px;
 		padding-left: 30px;
 		padding-top: 15px;
 		color: white;
 		cursor: pointer;
 		.positionrelative{position: relative;}
 		img{
 				vertical-align: middle;
 			}
 		.cred{
 			position: absolute;
		    color: white;
		    height: 20px;
		    width: 20px;
		    background-color: red;
		    text-align: center;
		    line-height: 20px;
		    display: inline-block;
		    border-radius: 50%;
		    top: -4px;
            right: -23px;
 		}	
 	}
 	
 	.cbgray {
 		background-color: #333b47;
 	}
 	
 	.left {
 		padding-top: 10px;
 		width: 10%;
 		display: flex;
 		flex-direction: column;
 		justify-content: flex-start;
 		border-right: 1px solid #DCDCDC;
 		align-items: center;
 		background-color: #f2f2f2;
 	}
 	
 	.right {
 		width: 70%;
 		display: flex;
 		flex-direction: column;
 		justify-content: flex-start;
 	}
 	
 	.righttile {
 		height: 7%;
 		text-align: center;
 		font-size: 15px;
 		line-height: 40px;
 		.rtalktitle{
 		  display: inline-block;
 		  width:96%;
 		  border-bottom: 1px solid #d6d6d6;
 		}
 	}
 	
 	.sendmessage {
 		height: 100%;
 		width: 100%;
 		font-size: 15px;
 		background-color: #EEEEEE;
 	}
 	
 	.rightmiddle1 {
 		height: 58%;
 		overflow-y: auto;
 		padding: 15px;
 	}
 		
 	.bbn {
 		height: 20px;
 		width: 20px;
 		overflow: hidden;
 		color: #CCCCCC;
 		font-size: 18px;
 		position: relative;
 		text-align: center;
 		display: inline-block;
 		vertical-align: middle;
 		cursor: pointer;
 	}
 	.bbn input {
 		outline: none;
 	}
 	.videos {
 		width: 20px !important;
 		padding-left: 0px;
 		background-color: red;
 		height: 20px;
 		cursor: pointer;
 		outline: none;
 		border: none;
 		display: block;
 		opacity: 0;
 		position: absolute;
 		padding-top: 20px;
 		top: 0;
 		left: 0
 	}
 	
 	.nn {
 		cursor: pointer;
 		color: rgb(153, 153, 153);
 		cursor: pointer;
 		display: inline-block;
 		font-size: 12px;
 		height: 20px;
 		line-height: 20px;
 		min-width: 20px;
 		overflow: hidden;
 	}
 	
 	.isjiahao {
 		margin-bottom: 10px;
 	}
 	
 	.isjiahao img {
 		height: 20px;
 		width: 20px;
 	}
 	.bbn11 {
 		height: 35px;
 		width: 35px;
 		overflow: hidden;
 		color: #CCCCCC;
 		font-size: 18px;
 		position: relative;
 		text-align: center;
 		display: inline-block;
 		vertical-align: middle;
 		cursor: pointer;
 	}
 	
 	.bbn11 input {
 		outline: none;
 	}
 	
 	.videos11 {
 		width: 35px !important;
 		padding-left: 0px;
 		background-color: red;
 		height: 35px;
 		cursor: pointer;
 		outline: none;
 		border: none;
 		display: block;
 		opacity: 0;
 		position: absolute;
 		padding-top: 20px;
 		top: 0;
 		left: 0
 	}
 	
 	.nn11 {
 		cursor: pointer;
 		color: rgb(153, 153, 153);
 		cursor: pointer;
 		display: inline-block;
 		font-size: 12px;
 		height: 35px;
 		line-height: 35px;
 		min-width: 35px;
 		overflow: hidden;
 	}
 	
 	.isjiahao11 {
 		margin-bottom: 10px;
 	}
 	
 	.isjiahao11 img {
 		height: 35px;
 		width: 35px;
 	}

 	.bottombtn{
 		height: 15%;
        text-align: right; 
        padding-top: 7px;
       padding-right: 10px;
       .point{
       	font-size: 13px;
       	padding-right: 10px;
       	color: #989898;
       }
 	}
 	.sendbtn{
 		background-color: white;
	    width: 100px;
	    height: 30px;
	    text-align: center;
	    color: black;
	    outline: none;
	    border: 1px solid #989898;
	    border-radius: 3px;
	    cursor: pointer;
 	}
 	.fontweight{
 			font-weight: bold;
 	}
 	.messageuser{
 		color: green;
 		height: 20px;
 		line-height: 20px;
 		font-size: 14px;
 	}
 	.cblue{
 		color: deepskyblue;
 	}
 	.usermessage{
 		margin-top: 5px;
 		margin-bottom: 10px;
 		font-size: 14px;
 		color: black;
 		p{
 			line-height: 20px;
 			padding-left: 10px;
 		}
 		img{
 			max-width: 250px;
 		}
 	}
 	@media only screen and (max-width: 768px) {
 		.box {
 			height: auto;
 			flex-direction: column;
 		}
 		.left {
 			width: 100%;
 		}
 		.gayslist {
 			width: 100%;
 			flex-direction: column;
 			border-bottom: 1px solid #dcdcdc;
 		}
 		.kefuone {
 			padding: 10px;
 			
 		}
 		.right {
 			width: 100%;
 			height: 700px;
 		}
 		.sendmessage{
 			width: 96%;
 			padding: 0 2%;
 		}
 		.gayslisttitlebordertop{
 		   border-top: 1px solid #DCDCDC;	
 		}
 		
 	}
</style>