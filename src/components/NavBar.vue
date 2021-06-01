<template>
	<nav>
		<v-app-bar v-if="isMobile" color="blue" dark app>
			<v-app-bar-nav-icon
				@click.stop="drawer = !drawer"
			></v-app-bar-nav-icon>
			<v-toolbar-title class="text-uppercase ">
				<span class="font-weight-light">ADMIN</span>
				<span>Vuewebchat</span>
			</v-toolbar-title>
			<v-spacer></v-spacer>
		</v-app-bar>
		<v-navigation-drawer v-model="drawer" dark app class="colorr">
			<v-layout column align-center>
				<v-flex class="mt-5">
					<v-avatar size="100">
						<img :src="user.avatar" alt="avatar" />
					</v-avatar>
					<p class="white--text subheading mt-1 text-center">
						{{ user.username }}
					</p>
				</v-flex>
				<v-flex class="mt-4 mb-4"> </v-flex>
			</v-layout>
			<v-list flat>
				<v-list-item
					v-for="link in links"
					:key="link.text"
					router
					:to="link.route"
					active-class="border"
				>
					<v-list-item-action>
						<v-icon>{{ link.icon }}</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>{{ link.text }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item>
					<v-list-item-action>
						<v-icon>mdi-logout</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>
							<v-btn icon>
								<a
									id="logout"
									href="javascript:void(0)"
									@click="logout"
									>Thoát
								</a>
							</v-btn>
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
	</nav>
</template>
<script>
export default {
	name: "NavBar",
	props: ["user"],
	mounted() {
		this.isMobile = window.innerWidth < 500 ? true : false;
		window.addEventListener("resize", (ev) => {
			if (ev.isTrusted) this.isMobile = window.innerWidth < 500;
		});
	},
	data: () => ({
		drawer: true,
		links: [
			{ icon: "mdi-view-dashboard", text: "Dashboard", route: "/" },
			{
				icon: "mdi-account-supervisor",
				text: "Người dùng",
				route: "/user",
			},
			{ icon: "mdi-door", text: "Phòng", route: "/room" },
		],
		isMobile: false,
	}),
	methods: {
		logout: function() {
			this.$store.dispatch("logout").then(() => {
				this.$router.push("/login");
			});
		},
	},
};
</script>
<style scoped>
.border {
	border-left: 4px solid #0ba518;
}

.colorr {
	background-color: #51c4d3 !important;
	color: #d8e3e7 !important;
}
#logout {
	width: 35px;
	height: 35px;
	margin-top: 20px;
	text-decoration: none;
	color: black;
}
</style>
