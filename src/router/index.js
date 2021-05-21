import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import User from "../views/User.vue";
import Room from "../views/Room.vue";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const ifNotAuthenticated = (to, from, next) => {
	if (!localStorage.getItem("isLogin")) {
		next();
		return;
	}
	next("/");
};

const ifAuthenticated = (to, from, next) => {
	if (localStorage.getItem("isLogin")) {
		next();
		return;
	}
	next("/login");
};

const routes = [
	{
		path: "/",
		name: "DashBoard",
		component: Dashboard,
		beforeEnter: ifAuthenticated,
		meta: {
			title: "Dashboard",
		},
	},
	{
		path: "/user",
		name: "User",
		component: User,
		beforeEnter: ifAuthenticated,
		meta: {
			title: "Người dùng",
		},
	},
	{
		path: "/room",
		name: "Room",
		component: Room,
		beforeEnter: ifAuthenticated,
		meta: {
			title: "Danh sách phòng",
		},
	},
	{
		path: "/login",
		name: "Login",
		component: Login,
		beforeEnter: ifNotAuthenticated,
		meta: {
			title: "Đăng nhập",
		},
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;
