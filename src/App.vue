<template>
  <div id="app">
  	
 
  	 <router-view/>
    
  </div>
</template>

<script>
	import axios from 'axios'
	export default{
		created(){
//			     this.$router.replace({
//								     path:'/chatting'
//							     })		
			axios.post("chat/getUserInfo").then(res=>{
				        console.log(res);
	      		    if(res.data.code==3){
	      		    	this.$router.replace('/');
	      		    }else if(res.data.code==1){
	      		    	 this.$router.replace({
								      path:'/manage'
							    })		
	      		    }else if(res.data.code==0){
	      		    	 this.$router.replace({
								     path:'/chatting'
							     })		
	      		    	 
	      		    }
	      		})
			  
		}
	}
</script>
<style>
#app{
 	  background:url(../static/bgimg.jpg);
 	  position:fixed;
	  top: 0;
	  left: 0;
	  width:100%;
	  height:100%;
	 /* min-width: 1000px;*/
	  z-index:-10;
	  zoom: 1;
	  background-color: #fff;
	  background-repeat: no-repeat;
	  background-size: cover;
	  -webkit-background-size: cover;
	  -o-background-size: cover;
	  background-position: center 0;
 	  
 }

</style>