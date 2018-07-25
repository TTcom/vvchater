<template>
  <div id="app">
  	
 
  	 <router-view/>
    
  </div>
</template>

<script>
	import axios from 'axios'
	export default{
		
		created(){
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