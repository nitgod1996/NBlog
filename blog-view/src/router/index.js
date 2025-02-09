import Vue from 'vue'
import VueRouter from 'vue-router'
import getPageTitle from '@/util/get-page-title'

Vue.use(VueRouter)

const routes = [
    // 不需要登录
    /* {
		path: '/login',
		component: () => import('@/views/Login'),
		meta: {title: '登录'}
	}, */
    {
        path: '/',
        // 为什么重定向还要引入这个component呢，因为很多地方需要Index.vue初始化，比如导航等等
        // redirect相当于是自动帮我们点了一下首页
        component: () => import('@/views/Index'),
        redirect: '/home',
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('@/views/home/Home'),
                meta: { title: '首页' }
            },
            {
                path: '/archives',
                name: 'archives',
                component: () => import('@/views/archives/Archives'),
                meta: { title: '归档' }
            },
            {
                path: '/blog/:id',
                name: 'blog',
                component: () => import('@/views/blog/Blog'),
                meta: { title: '博客' }
            },
            {
                path: '/tag/:name',
                name: 'tag',
                component: () => import('@/views/tag/Tag'),
                meta: { title: '标签' }
            },
            {
                path: '/category/:name',
                name: 'category',
                component: () => import('@/views/category/Category'),
                meta: { title: '分类' }
            },
            {
                path: '/moments',
                name: 'moments',
                component: () => import('@/views/moments/Moments'),
                meta: { title: '动态' }
            },
            {
                path: '/friends',
                name: 'friends',
                component: () => import('@/views/friends/Friends'),
                meta: { title: '友人帐' }
            },
            {
                path: '/about',
                name: 'about',
                component: () => import('@/views/about/About'),
                meta: { title: '关于我' }
            }
        ]
    }
    // { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = new VueRouter({
    // Vue3中已换成createWebHistory()、createWebHashHistory()、createMemoryHistory()，主要是配置路由方式。
    // 一般开发的单页应用的URL都会带有#号的hash模式，如http://localhost:8080/#/home
    // 将路由模式设为history可以去除#。详细区别参照路由history模式介绍，https://router.vuejs.org/zh/guide/essentials/history-mode.html
    mode: 'history',
    // Vue3已移除，被作为 createWebHistory (其他 history 也一样)的第一个参数传递
    // process.env.BASE_URL是环境变量中的，默认是'/'
    base: process.env.BASE_URL,
    routes
})

//挂载路由守卫
// 当Router（路由）之间发生跳转时，会触发导航守卫。（url发生改变时就会触发导航守卫）
// （那相当于监听路由的函数）
router.beforeEach((to, from, next) => {
    // 路由切换的时候title对应切换
    document.title = getPageTitle(to.meta.title)
    next()
})

export default router
