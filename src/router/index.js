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
		name: "Home",
		component: Home,
		children: [{
				path: "/user/info",
				name: "UserInfo",
				component: UserInfo,
			},
			{
				path: "/user/password",
				name: "UserPassword",
				component: UserPassword,
				props: true
			},{
				path: "/algorithm/info",
				name: "AlgorithmInfo",
				component: AlgorithmInfo,
			},{
				path: "/algorithm/run",
				name: "AlgorithmRun",
				component: AlgorithmRun,
			},{
				path: "/dataset/info",
				name: "DatasetInfo",
				component: DatasetInfo,
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
	mode: 'history',
	routes,
});

export default router;
