<template>
	<div  id="pages">
	    <ul class="pagination">
	       <li   @click=" current-- && goto(current)" :class="{not:current==1}"><a>上一页</a></li>
	        <li v-for="index in pages" @click="goto(index)" :class="{'active':current == index}" :key="index">
	          <a>{{index}}</a>
	        </li>
	        <li :class="{not:current==allpage}"  @click="current++ && goto(current)"><a>下一页</a></li>
	    </ul>
					         
	</div>
	
</template>

<script>
	export default{
		props:{
			showItem:{
				type:Number,
				default:1
			},
			allpage:{
				type:Number,
				default:1
			}
		},
		data(){
			return{
				current:1
			}
		},
		methods:{
			 goto(index){      //评论分页
	 	
			 	if(index>this.allpage){
			 		return false;
			 	}
			 	if(index<1){
			 		return false;
			 	}
		 	
		 	
	          if(index != this.current){
	          	this.current = index;           	
	          }
	          	console.log(this.current)
	        	this.$emit('pages',this.current)
	          	
            },			
		},
		 computed:{ 
		 	
           pages(){
                var pag = [];
                  if( this.current < this.showItem ){ //如果当前的激活的项 小于要显示的条数
                       //总页数和要显示的条数那个大就显示多少条
                       var i = Math.min(this.showItem,this.allpage);
                       while(i){
                           pag.unshift(i--); //pag数组头部添加数据
                       }
                   }else{ //当前页数大于显示页数了
                       var middle = this.current - Math.floor(this.showItem / 2 ),//从哪里开始
                        //Math.floor向下取整
                           i = this.showItem;
                       if( middle >  (this.allpage - this.showItem)  ){
                           middle = (this.allpage - this.showItem) + 1
                       }
                       while(i--){
                           pag.push( middle++ );
                       }
                   }
                 
                 return pag
               }
	   }
		
	}
	
</script>

<style lang="scss">
 .pagination li{
        display: inline-block;
        margin: 0 2px;
        
      }
      .pagination li a{
        padding:6px 15px;
        display:inline-block;
        border:1px solid #ddd;
        background:#fff;

        color:#0E90D2;
      }
      .pagination li a:hover{
        background:#eee;
      }
      .pagination li.active a{
        background:#0E90D2;
        color:#fff;
      }
     .not{pointer-events: none;}
     .not a{color: #dcdcdc !important;}
     #pages .pagination li{cursor: pointer;}
  	 #pages{margin-top: 20px;margin-bottom:-20px;text-align: right;font-size: 13px;}	
	
	
</style>