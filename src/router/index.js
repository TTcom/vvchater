import Vue from 'vue'
import Router from 'vue-router'
import Chatting from 'components/chatting/chatting'
import Signin from 'components/signin/signin'
import Manage from 'components/manage/manage'

Vue.use(Router)

const router=new Router({
   mode: 'history',
   base:"/chat",
  routes: [
//  {
//    path: '/',
//    redirect: '/signin'
//  },
    {
      path: '/',
      component: Signin,
      meta:{
      	title:"登录"
      }
    },
    {
      path: '/chatting',
      component:Chatting,
      meta:{
      	title:"聊天室"
      }
    },
    {
      path: '/manage',
      component:Manage,
      meta:{
      	title:"后台管理"
      }
      
    }
    
  ]

})

router.beforeEach((to,form,next) =>{ 
	
	if(to.meta.title){ 	
		document.title=to.meta.title 
	}
	
	next();
	
})
export default router;