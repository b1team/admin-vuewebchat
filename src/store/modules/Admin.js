import axios from "axios";

const state = {
	ad_users: null,
	ad_rooms: null,
	ad_messages: null,
	ad_bool: false,
	token: "",
	isLogin: false,
	user: {},
};

const getters = {
	ad_users: (state) => state.ad_users,
	ad_rooms: (state) => state.ad_rooms,
	ad_messages: (state) => state.ad_messages,
	ad_bool: (state) => state.ad_bool,
	isLogin: (state) => state.isLogin,
	token: (state) => state.token,
	user: (state) => state.user,
};

const actions = {
	ad_loadUsers({ commit }) {
		return new Promise((resolve, reject) => {
			axios({
				method: "get",
				url: "admin/user/all",
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			})
				.then((response) => {
					let data = response.data;
					commit("ad_users", data);
					resolve(response);
				})
				.catch((error) => {
					console.log("LOAD USER ERROR: ", error);
					localStorage.removeItem("token");
					reject(error);
				});
		});
	},

	ad_createUser({ commit }, user) {
		return new Promise((resolve, reject) => {
			axios({
				method: "post",
				url: "admin/user",
				data: user,
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			})
				.then((response) => {
					commit("success");
					resolve(response);
				})
				.catch((error) => {
					console.log("CREATE USER ERROR: ", error);
					reject(error);
				});
		});
	},

	ad_disableUser({ commit }, user_id) {
		return new Promise((resolve, reject) => {
			axios({
				method: "put",
				url: "admin/user?user_id=" + user_id,
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			})
				.then((response) => {
					commit("success");
					resolve(response);
				})
				.catch((error) => {
					console.log("DISABLE USER ERROR: ", error);
					reject(error);
				});
		});
	},

	ad_deleteUser({ commit }, user_id) {
		return new Promise((resolve, reject) => {
			axios({
				method: "delete",
				url: "admin/user?user_id" + user_id,
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				}
			})
			.then((response) => {
				commit("success");
				resolve(response);
			})
			.catch((err) => {
				console.log("DELETE USER ERROR: ", err);
				reject(err);
			})
		})
	},

	ad_createRoom({ commit }, roomName) {
		return new Promise((resolve, reject) => {
			axios({
				method: "post",
				url: "admin/rooms?room_name=" + roomName,
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			})
				.then((response) => {
					commit("success");
					resolve(response);
				})
				.catch((error) => {
					reject(error);
					console.log("CREATE ROOM ERROR: ", error);
				});
		});
	},

	ad_loadRoom({ commit }) {
		return new Promise((resolve, reject) => {
			axios({
				method: "get",
				url: "admin/rooms/all",
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			})
				.then((response) => {
					let data = response.data;
					commit("ad_rooms", data);
					resolve(response);
				})
				.catch((error) => {
					console.log("AD LOAD ROOM ERROR: ", error);
					reject(error);
				});
		});
	},

	ad_deleteRoom({ commit }, room_id) {
		return new Promise((resolve, reject) => {
			axios({
				method: "delete",
				url: "admin/rooms?room_id=" + room_id,
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			})
				.then((response) => {
					commit("success");
					resolve(response);
				})
				.catch((error) => {
					console.log("DELETE ROOM ERROR: ", error);
					reject(error);
				});
		});
	},

	ad_messagesCount({ commit }, time) {
		return new Promise((resolve, reject) => {
			axios({
				method: "get",
				url: "admin/messages/all",
				data: time,
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			})
				.then((response) => {
					let data = response.data;
					commit("ad_messages", data);
					resolve(response);
				})
				.catch((error) => {
					console.log("MESSAGE COUNT ERROR: ", error);
					reject(error);
				});
		});
	},

	login({ commit }, user) {
		return new Promise((resolve, reject) => {
			axios({
				method: "post",
				url: "admin/token",
				data: user,
			})
				.then((response) => {
					const token = response.data.access_token;
					localStorage.setItem("token", token);
					localStorage.setItem("isLogin", true);
					commit("auth_success", token);
					resolve(response);
				})
				.catch((error) => {
					localStorage.removeItem("token");
					reject(error);
				});
		});
	},

	logout({ commit }) {
		return new Promise((resolve) => {
			commit("logout");
			delete axios.defaults.headers.common["Authorization"];
			resolve(true);
		});
	},

	getUser({ commit }) {
		return new Promise((resolve, reject) => {
			axios({
				method: "get",
				url: "admin/me",
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			})
				.then((response) => {
					commit("user", response.data);
					resolve(response);
				})
				.catch((error) => {
					console.log("GET USER ERROR: ", error);
					reject(error);
				});
		});
	},
};

const mutations = {
	ad_users(state, data) {
		state.ad_users = data;
	},
	ad_rooms(state, data) {
		state.ad_rooms = data;
	},
	ad_messages(state, data) {
		state.ad_messages = data;
	},
	success(state) {
		state.ad_bool = true;
	},
	auth_success(state, token) {
		state.token = token;
		state.isLogin = true;
		localStorage.setItem("login", true);
	},
	user(state, user) {
		state.user = user;
		state.isLogin = true;
	},
	logout(state) {
		state.user = {};
		state.isLogin = false;
		state.token = "";
		localStorage.clear();
	},
};

export default {
	state,
	getters,
	actions,
	mutations,
};
