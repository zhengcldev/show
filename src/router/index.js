import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/Login";
import Home from "@/views/Home";
import UserInfo from "@/views/user/UserInfo";
import UserPassword from "@/views/user/UserPassword";
import Error from "@/views/Error";
import AlgorithmInfo from "@/views/algorithm/AlgorithmInfo";
import AlgorithmRun from "@/views/algorithm/AlgorithmRun";
import DatasetInfo from "@/views/algorithm/DatasetInfo";
import UserCreate from "@/views/user/UserCreate";
import AlgorithmOffline from "@/views/algorithm/AlgorithmOffline";
import Welcome from "@/views/Welcome";


Vue.use(VueRouter);

const routes = [
    //登陆页
    {
        //路径
        path: "/login",
        //路由名称
        name: "Login",
        //组件名
        component: Login
    },
    {
        //首页
        path: "/home",
        name: "首页",
        component: Home,
        redirect: '/welcome',
        children: [{
            path: "/user/info",
            name: "个人信息",
            component: UserInfo,
        },
            {
                path: "/user/password",
                name: "修改密码",
                component: UserPassword,
                props: true
            },
            {
                path: "/user/create",
                name: "编辑用户",
                component: UserCreate,
            }, {
                path: "/algorithm/info",
                name: "查看论文",
                component: AlgorithmInfo,
            }, {
                path: "/algorithm/offline",
                name: "离线运行",
                component: AlgorithmOffline,
            }
            , {
                path: "/algorithm/run",
                name: "实时运行",
                component: AlgorithmRun,
            }, {
                path: "/dataset/info",
                name: "编辑数据",
                component: DatasetInfo,
            },
            {
                path: "/welcome",
                name: "欢迎",
                component: Welcome,
            }
        ]
    },
    {
        path: "/goHome/:name",
        redirect: "/home/:name"
    },
    {
        path: "/",
        redirect: "/login"
    },
    {
        //路径
        path: "*",
        //组件名
        component: Error
    },
];

const router = new VueRouter({
    mode: 'hash',
    routes,
});

export default router;
