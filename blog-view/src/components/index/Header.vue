<template>
    <!--  首页的背景图部分-->
    <!--  ref是一个标记，vue可以通过this.$refs.*** 进行DOM操作，访问元素节点对象-->
    <!--  如this.$refs.header.style.height-->
    <header ref="header">
        <div class="view fix">
            <div class="bg1" style="background-image: url('https://gcore.jsdelivr.net/gh/nitgod1996/images/one piece/bg1.jpg')"></div>
            <div class="bg2" style="background-image: url('https://gcore.jsdelivr.net/gh/nitgod1996/images/one piece/bg2.jpg')"></div>
            <div class="bg3" style="background-image: url('https://gcore.jsdelivr.net/gh/nitgod1996/images/one piece/bg3.jpg')"></div>
        </div>
        <!-- data-word：HTML5新属性data-*，用于存储自定义数据，可以在JavaScript中利用-->
        <div class="text-malfunction" data-word="Ninglidashen1996">Ninglidashen1996</div>
        <!-- 向下的箭头 -->
        <div class="wrapper">
            <i class="ali-iconfont icon-down" @click="scrollToMain"></i>
        </div>
    </header>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Header',
    data() {
        return {}
    },
    computed: {
        // 引入state中的clientSize对象
        // vuex中mapState函数的用法↓
        // https://vuex.vuejs.org/zh/guide/state.html#mapstate-%E8%BE%85%E5%8A%A9%E5%87%BD%E6%95%B0
        ...mapState(['clientSize'])
    },
    watch: {
        // watch的用法，侦听单个嵌套属性：
        // https://cn.vuejs.org/api/options-state.html#watch
        // 监听可视窗口大小，控制header的height
        'clientSize.clientHeight'() {
            this.setHeaderHeight()
        }
    },
    mounted() {
        /**
         * 因为bg3.jpg比较小，通常会比bg1.jpg先加载，显示出来会有一瞬间bg1显示一半，bg3显示一半，为了解决这个问题，增加这个判断，让bg1加载完毕后再显示bg3
         * HTML中使用img标签的原因：我个人想用div作为图片的载体，而只有img标签有图片加载完毕的onload回调，所以用一个display: none的img人柱力来加载图片
         * 当img中的src加载完毕后，会把图片缓存到浏览器，后续在div中用background url的形式将直接从浏览器中取出图片，不会下载两次图片
         */
        /*			this.$refs.imgbg1.onload = () => {
				this.loaded = true
			}*/
        this.setHeaderHeight()
        // 鼠标初始进入的x坐标值
        let startingPoint
        const header = this.$refs.header
        header.addEventListener('mouseenter', (e) => {
            startingPoint = e.clientX
        })
        // 鼠标离开header时，重置percentage时背景变回bg1
        header.addEventListener('mouseout', (e) => {
            header.classList.remove('moving')
            header.style.setProperty('--percentage', 0.5)
        })
        header.addEventListener('mousemove', (e) => {
            let percentage = (e.clientX - startingPoint) / window.outerWidth + 0.5
            header.style.setProperty('--percentage', percentage)
            header.classList.add('moving')
        })
    },
    methods: {
        //根据可视窗口高度，动态改变首图大小
        setHeaderHeight() {
            this.$refs.header.style.height = this.clientSize.clientHeight + 'px'
        },
        //平滑滚动至正文部分
        scrollToMain() {
            window.scrollTo({ top: this.clientSize.clientHeight, behavior: 'smooth' })
        }
    }
}
</script>

<style scoped>
header {
    --percentage: 0.5; /*自定义变量*/
    user-select: none;
}
.view {
    /*		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;*/
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    /*--percentage是CSS的自定义变量，通过var()使用，此处为0.5
    calc是用于计算的函数，transform用于动画，以上均是CSS3新增
    因此一下属性含义：右移500px
    */
    transform: translatex(calc(var(--percentage) * 100px));
}

.view div {
    background-position: center center;
    background-size: cover; /*将图片等比放大直至完全覆盖背景*/
    position: absolute;
    width: 110%;
    height: 100%;
}

.view .bg1 {
    z-index: 10;
    /*鼠标左右移动时，通过控制percentage控制图片的透明度，进而控制图片的显示*/
    opacity: calc(1 - (var(--percentage) - 0.5) / 0.5);
}

.view .bg2 {
    z-index: 20;
    opacity: calc(1 - (var(--percentage) - 0.25) / 0.25);
}

.view .bg3 {
    left: -10%; /*不设置-10%的话鼠标右移时左边会有空白*/
}

header .view,
header .bg1,
header .bg2 {
    /*transition：让样式转变平滑过渡*/
    /*动画效果，all:所有属性都过渡 0.2s内完成 ease-in：以慢速开始*/
    transition: all 0.2s ease-in;
}

header.moving .view,
header.moving .bg1,
header.moving .bg2 {
    transition: none;
}

.text-malfunction {
    position: fixed;
    top: 50%;
    left: 50%;
    /*scale放大倍数*/
    transform: translate(-50%, -50%) scale(2.5);
    font-size: 34px;
    font-family: cursive;
    color: transparent;
}

.text-malfunction:before,
.text-malfunction:after {
    /*attr()获取对应属性的属性值*/
    /*content 属性与 :before 及 :after 伪元素配合使用，来插入内容。*/
    content: attr(data-word);
    position: absolute;
    top: 0;
    height: 36px;

    /*滤镜属性*/
    filter: contrast(200%);
}

.text-malfunction:before {
    left: 0;
    color: #0fffff;
    /*text-shadow: 1px 0 0 #0fffff;*/
    z-index: 30;
    animation: malfunctionAni 0.95s infinite;
}

.text-malfunction:after {
    left: -1px;
    top: 1px;
    /*color: pink;*/
    color: plum;
    /*text-shadow: 0 1px 0 pink;*/
    z-index: 40;
    mix-blend-mode: lighten;
    animation: malfunctionAni 1.1s infinite 0.2s;
    text-shadow: 6px 2px 2px #333;
}

@keyframes malfunctionAni {
    10% {
        top: -0.4px;
        left: -1.1px;
    }
    20% {
        top: 0.4px;
        left: -0.2px;
    }
    30% {
        left: 0.5px;
    }
    40% {
        top: -0.3px;
        left: -0.7px;
    }
    50% {
        left: 0.2px;
    }
    60% {
        top: 1.8px;
        left: -1.2px;
    }
    70% {
        top: -1px;
        left: 0.1px;
    }
    80% {
        top: -0.4px;
        left: -0.9px;
    }
    90% {
        left: 1.2px;
    }
    100% {
        left: -1.2px;
    }
}

.wrapper {
    position: absolute;
    width: 100px;
    bottom: 150px;
    left: 0;
    right: 0;
    margin: auto;
    font-size: 26px;
    z-index: 100;
}

.wrapper i {
    font-size: 60px;
    opacity: 0.5;
    cursor: pointer;
    position: absolute;
    top: 55px;
    left: 20px;
    animation: opener 0.5s ease-in-out alternate infinite;
    transition: opacity 0.2s ease-in-out, transform 0.5s ease-in-out 0.2s;
}

.wrapper i:hover {
    opacity: 1;
}

@keyframes opener {
    100% {
        top: 65px;
    }
}
</style>
