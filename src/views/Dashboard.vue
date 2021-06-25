<template>
	<v-app id="inspire">
		<div id="bar">
			DASHBOARD
		</div>
		<v-row :id="isMobile ? '' : 'card'">
			<v-col v-for="i in info" :key="i.detail" cols="12" sm="6" md="4">
				<v-card class="mx-auto t-color" outlined>
					<v-list-item three-line>
						<v-list-item-content>
							<div class="overline mb-4">
								{{ i.detail }}
							</div>
							<v-list-item-title class="headline mb-1">
								{{ i.count }}
							</v-list-item-title>
						</v-list-item-content>

						<v-list-item-avatar tile size="80"
							><v-icon x-large>
								{{ i.icon }}
							</v-icon></v-list-item-avatar
						>
					</v-list-item>
				</v-card>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" sm="6" md="6">
				<v-list subheader class="table">
					<v-subheader><h2>Người dùng mới nhất</h2></v-subheader>

					<v-list-item
						class="t-color"
						v-for="chat in recent"
						:key="chat.title"
					>
						<v-list-item-avatar>
							<v-img
								:alt="`${chat.title} avatar`"
								:src="chat.avatar"
							></v-img>
						</v-list-item-avatar>

						<v-list-item-content>
							<v-list-item-title
								v-text="chat.title"
							></v-list-item-title>
						</v-list-item-content>

						<v-list-item-icon>
							<v-btn
								@click="dialogActive = !dialogActive"
								class="ma-2 btn-action"
								outlined
							>
								{{ chat.active ? "Chặn" : "Bỏ chặn" }}
							</v-btn>
						</v-list-item-icon>
						<v-dialog v-model="dialogActive" max-width="290">
							<v-card>
								<v-card-title class="headline">
									{{
										chat.active
											? "Bạn muốn chặn người dùng ?"
											: "Bạn muốn bỏ chặn người dùng ?"
									}}
								</v-card-title>
								<v-card-actions>
									<v-spacer></v-spacer>

									<v-btn
										class="btn-unaction"
										text
										@click="dialogActive = false"
									>
										Không
									</v-btn>

									<v-btn
										class="btn-action"
										text
										@click="activeUser(chat.id)"
									>
										Đồng ý
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-list-item>
				</v-list>

				<v-divider></v-divider>
			</v-col>
			<v-col cols="12" sm="6" md="6">
				<v-list subheader class="table">
					<v-subheader><h2>Phòng mới nhất</h2></v-subheader>

					<v-list-item
						class="t-color"
						v-for="room in rooms.five_rooms"
						:key="room.id"
					>
						<v-list-item-avatar>
							<v-img
								v-if="room.avatar"
								:alt="`${room.room_name} avatar`"
								:src="room.avatar"
								@error="room.avatar=''"
							></v-img>
							<v-avatar
								v-if="!room.avatar"
								color="blue"
								size="40"
							>
								<span class="white--text headline">{{
									textAvatar(room.room_name)
								}}</span>
							</v-avatar>
						</v-list-item-avatar>

						<v-list-item-content>
							<v-list-item-title
								v-text="room.room_name"
							></v-list-item-title>
						</v-list-item-content>

						<v-list-item-icon>
							<v-btn
								@click="dialogActiveRoom = !dialogActiveRoom"
								class="ma-2 btn-action"
								outlined
							>
								Xóa phòng
							</v-btn>
						</v-list-item-icon>
						<v-dialog v-model="dialogActiveRoom" max-width="290">
							<v-card>
								<v-card-title class="headline">
									Bạn muốn xóa phòng ?
								</v-card-title>
								<v-card-actions>
									<v-spacer></v-spacer>

									<v-btn
										class="btn-unaction"
										text
										@click="dialogActiveRoom = false"
									>
										Không
									</v-btn>

									<v-btn
										class="btn-action"
										text
										@click="deleteRoom(room.id)"
									>
										Đồng ý
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-list-item>
				</v-list>
				<v-divider></v-divider>
			</v-col>
		</v-row>
	</v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	data() {
		return {
			date: new Date().toISOString().substr(0, 10),
			menu: false,
			modal: false,
			menu2: false,
			users: null,
			rooms: [],
			info: [],
			isMobile: false,
			recent: [],
			dialogActive: false,
			dialogActiveRoom: false,
		};
	},
	created() {
		this.getUserData();
		this.loadUsers();
		this.messagesCount();
		this.loadRooms();
	},
	mounted() {
		this.isMobile = window.innerWidth < 500 ? true : false;
		window.addEventListener("resize", (ev) => {
			if (ev.isTrusted) this.isMobile = window.innerWidth < 500;
		});
	},
	methods: {
		logout: function() {
			this.$store.dispatch("logout").then(() => {
				this.$router.push("/login");
			});
		},
		loadUsers: function() {
			this.$store
				.dispatch("ad_loadUsers")
				.then(() => {
					this.users = this.$store.getters.ad_users;
					const data = {
						detail: "Người dùng",
						count: this.users.count,
						icon: "mdi-account-circle",
					};
					this.info.push(data);

					for (const user of this.users.five_users) {
						const info = {
							active: user.active,
							avatar: user.avatar,
							title: user.username,
							id: user.user_id,
						};
						this.recent.push(info);
					}
				})
		},
		messagesCount: function() {
			this.$store
				.dispatch("ad_messagesCount")
				.then(() => {
					const data = {
						detail: "Tin nhắn",
						count: this.$store.getters.ad_messages.messages,
						icon: "mdi-message",
					};
					this.info.push(data);
				})
		},
		loadRooms: function() {
			this.$store
				.dispatch("ad_loadRoom")
				.then(() => {
					this.rooms = this.$store.getters.ad_rooms;
					const data = {
						detail: "Phòng",
						count: this.rooms.count,
						icon: "mdi-door",
					};
					this.info.push(data);
				})
		},
		activeUser: function(id) {
			this.recent.filter(function(data) {
				if (data.id === id) {
					data.active = !data.active;
				}
			});
			this.$store
				.dispatch("ad_disableUser", id)
				.catch((error) => console.log("ACTIVE USER ERROR", error));
			this.dialogActive = false;
		},
		textAvatar(roomName) {
			var words = roomName.split(" ");
			if (words.length === 1) {
				return words[0][0].toUpperCase();
			} else {
				return (words[0][0] + words[words.length - 1][0]).toUpperCase();
			}
		},
		deleteRoom(id) {
			this.$store.dispatch("ad_deleteRoom", id);
			this.dialogActiveRoom = false;
		},
		getUserData() {
			const token = localStorage.getItem("token");
			if (token) {
				this.$store.dispatch("getUser")
			} else {
				this.logout();
			}
		},
	},
	computed: {
		...mapGetters(["ad_users"]),
	},
};
</script>

<style lang="scss" scoped>
#inspire {
	padding: 15px;
}

#bar {
	max-height: 50px;
	text-align: center;
	font-size: 35px;
	color: black;
	div {
		display: inline !important;
	}
}

#card {
	max-height: 25%;
}
</style>
