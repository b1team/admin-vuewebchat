<template>
	<v-app>
		<NavBar v-if="isLogin" :user="user"/>
		<v-main>
			<router-view />
		</v-main>
	</v-app>
</template>

<script>
import NavBar from "./components/NavBar";
import { mapGetters } from "vuex"

export default {
	name: "App",
	components: { NavBar },

	data: () => ({
		isMobile: false,
	}),

	computed: { ...mapGetters(["user", "isLogin"])}
};
</script>

<style lang="scss">
#inspire {
	background-color: #f4f4f4;
}

.btn-action {
	background-color: #126e82 !important;
	color: #d8e3e7 !important;
}

.btn-action:hover {
	background-color: #132c33 !important;
}

.btn-unaction {
	background-color: #606770 !important;
	color: #d8e3e7 !important;
}

.btn-unaction:hover {
	background-color: #132c33 !important;
}

.t-color {
	background-color: #ffffff !important;
	color: #132c33 !important;
}

div {
	color: #132c33 !important;
}

.table {
	border-style: groove;
}
</style>
