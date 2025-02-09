<template>
    <div class="site">
        <!--顶部导航-->
        <Nav :blogName="siteInfo.blogName" :categoryList="categoryList" />
        <!--首页大图 只在首页且pc端时显示-->
        <div class="m-mobile-hide">
            <Header v-if="$route.name === 'home'" />
        </div>
        <!--    波浪纹特效-->
        <div id="waves">
            <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                <defs>
                    <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                </defs>
                <g class="parallax">
                    <use xlink:href="#gentle-wave" x="48" y="0" />
                    <use xlink:href="#gentle-wave" x="48" y="3" />
                    <use xlink:href="#gentle-wave" x="48" y="5" />
                    <use xlink:href="#gentle-wave" x="48" y="7" />
                </g>
            </svg>
        </div>

        <div class="main" :style="'margin-top: ' + top + 'rem'">
            <div class="m-padded-tb-big">
                <div class="ui container">
                    <div class="ui stackable grid">
                        <!--左侧-->
                        <div class="three wide column m-mobile-hide">
                            <Introduction :class="{ 'm-display-none': focusMode }" />
                        </div>
                        <!--中间-->
                        <div class="ten wide column">
                            <!-- 这里，缓存路由，主要是home组件 -->
                            <keep-alive include="Home">
                                <router-view />
                            </keep-alive>
                        </div>
                        <!--右侧-->
                        <div class="three wide column m-mobile-hide">
                            <RandomBlog :randomBlogList="randomBlogList" :class="{ 'm-display-none': focusMode }" />
                            <Tags :tagList="tagList" :class="{ 'm-display-none': focusMode }" />
                            <!--只在文章页面显示目录-->
                            <Tocbot v-if="$route.name === 'blog'" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--私密文章密码对话框-->
        <BlogPasswordDialog />

        <!--APlayer-->
        <div class="m-mobile-hide">
            <meting-js :server="siteInfo.playlistServer" :id="siteInfo.playlistId" type="playlist" fixed="true" theme="#25CCF7" v-if="siteInfo.playlistServer && siteInfo.playlistId"></meting-js>
        </div>
        <!--回到顶部-->
        <el-backtop style="box-shadow: none; background: none; z-index: 9999">
            <img src="/img/paper-plane.png" style="width: 40px; height: 40px" />
        </el-backtop>
        <!--底部footer-->
        <!-- <Footer :siteInfo="siteInfo" :badges="badges" :newBlogList="newBlogList" :hitokoto="hitokoto" /> -->
    </div>
</template>

<script>
import { getHitokoto, getSite } from '@/api/index'
import Nav from '@/components/index/Nav'
import Header from '@/components/index/Header'
import Footer from '@/components/index/Footer'
import Introduction from '@/components/sidebar/Introduction'
import Tags from '@/components/sidebar/Tags'
import RandomBlog from '@/components/sidebar/RandomBlog'
import Tocbot from '@/components/sidebar/Tocbot'
import BlogPasswordDialog from '@/components/index/BlogPasswordDialog'
import { mapState } from 'vuex'
import { SAVE_CLIENT_SIZE, SAVE_INTRODUCTION, SAVE_SITE_INFO, RESTORE_COMMENT_FORM } from '@/store/mutations-types'

export default {
    name: 'Index',
    components: { Header, BlogPasswordDialog, Tocbot, RandomBlog, Tags, Nav, Footer, Introduction },
    data() {
        return {
            siteInfo: {
                blogName: '',
                webTitleSuffix: '',
                playlistServer: '',
                playlistId: ''
            },
            categoryList: [],
            tagList: [],
            randomBlogList: [],
            badges: [],
            newBlogList: [],
            hitokoto: {}
        }
    },
    computed: {
        ...mapState(['focusMode']),
        top: function () {
            return this.$route.name === 'home' ? 0 : 3
        }
    },
    watch: {
        //路由改变时，页面滚动至顶部
        '$route.path'() {
            this.scrollToTop()
        }
    },
    created() {
        this.getSite()
        this.getHitokoto()
        //从localStorage恢复之前的评论信息
        this.$store.commit(RESTORE_COMMENT_FORM)
    },
    mounted() {
        //保存可视窗口大小
        this.$store.commit(SAVE_CLIENT_SIZE, { clientHeight: document.body.clientHeight, clientWidth: document.body.clientWidth })
        window.onresize = () => {
            this.$store.commit(SAVE_CLIENT_SIZE, { clientHeight: document.body.clientHeight, clientWidth: document.body.clientWidth })
        }
    },
    methods: {
        getSite() {
            getSite().then((res) => {
                if (res.code === 200) {
                    this.siteInfo = res.data.siteInfo
                    this.badges = res.data.badges
                    this.newBlogList = res.data.newBlogList
                    this.categoryList = res.data.categoryList
                    this.tagList = res.data.tagList
                    this.randomBlogList = res.data.randomBlogList
                    this.$store.commit(SAVE_SITE_INFO, this.siteInfo)
                    this.$store.commit(SAVE_INTRODUCTION, res.data.introduction)
                    document.title = this.$route.meta.title + this.siteInfo.webTitleSuffix
                }
            })
        },
        //获取一言
        getHitokoto() {
            getHitokoto().then((res) => {
                this.hitokoto = res
            })
        }
    }
}
</script>

<style scoped>
.site {
    display: flex;
    min-height: 100vh; /* 没有元素时，也把页面撑开至100% */
    flex-direction: column;
}

.main {
    z-index: 40;
    /*margin-top: 40px;*/
    flex: 1;
    background-color: var(--grey-1);
}

.main .ui.container {
    width: 1400px !important;
    margin-left: auto !important;
    margin-right: auto !important;
}

.ui.grid .three.column {
    padding: 0;
}

.ui.grid .ten.column {
    padding-top: 0;
}

.m-display-none {
    display: none !important;
}

.waves {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 15vh;
    margin-bottom: -0.6875rem;
    min-height: 3.125rem;
    max-height: 9.375rem;

    /*    +mobile() {
          height: 10vh;
        }*/
}
/* Animation */
.parallax > use {
    /*    cubic-bezier自定义函数设置播放的快慢节奏
        infinite循环播放*/
    animation: wave 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}

.parallax > use:nth-child(1) {
    animation-delay: -2s;
    animation-duration: 7s;
    fill: #fdfdfd;
    opacity: 0.7;
}

.parallax > use:nth-child(2) {
    animation-delay: -3s;
    animation-duration: 10s;
    fill: #fdfdfd;
    opacity: 0.5;
}

.parallax > use:nth-child(3) {
    animation-delay: -4s;
    animation-duration: 13s;
    fill: #fdfdfd;
    opacity: 0.3;
}

.parallax > use:nth-child(4) {
    animation-delay: -5s;
    animation-duration: 20s;
    fill: var(--grey-1);
    /*fill: #efefef;*/
}

@keyframes wave {
    0% {
        transform: translate3d(-90px, 0, 0);
    }

    100% {
        transform: translate3d(85px, 0, 0);
    }
}
</style>
