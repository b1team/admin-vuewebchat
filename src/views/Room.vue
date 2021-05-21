<template>
	<div id="inspire">
		<h1 style="padding: 10px;">Danh sách phòng</h1>
		<v-data-table
			:headers="headers"
			:items="desserts"
			:items-per-page="10"
			item-key="id"
			class="elevation-1 t-color table"
			:footer-props="{
				showFirstLastPage: true,
				firstIcon: 'mdi-arrow-collapse-left',
				lastIcon: 'mdi-arrow-collapse-right',
				prevIcon: 'mdi-minus',
				nextIcon: 'mdi-plus',
			}"
		>
			<template v-slot:item.avatar="{ item }">
				<v-avatar v-if="!item.avatar" color="blue" size="40">
					<span class="white--text headline">{{
						textAvatar(item.room_name)
					}}</span>
				</v-avatar>
				<img
					v-if="item.avatar"
					:src="item.avatar"
					style="width: 35px; height: 35px;"
				/>
			</template>
			<template v-slot:item.members="{ item }">
				<v-icon small class="mr-2" @click="seeMembers(item.id)">
					mdi-eye
				</v-icon>
			</template>
		</v-data-table>
		<v-dialog v-model="dialog" width="500" id="inspire">
			<v-card>
				<v-card-title class="headline grey lighten-2">
					Thành viên
				</v-card-title>

				<v-card-text>
					<v-list dense>
						<v-list-item-group
							color="primary"
						>
							<v-list-item v-for="(item, i) in items" :key="i">
								<v-list-item-icon>
									<img
										:src="item.icon"
										style="width: 35px; height: 35px;"
									/>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title
										v-text="item.text"
									></v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list-item-group>
					</v-list>
				</v-card-text>

				<v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" text @click="dialog = false">
						OK
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "Room",
	data() {
		return {
			rooms: [],
			headers: [
				{ text: "id", align: "start", value: "id" },
				{ text: "Tên phòng", value: "room_name" },
				{ text: "Loại phòng", value: "type" },
				{ text: "Ảnh đại diện", value: "avatar" },
				{ text: "Số thành viên", value: "count" },
				{ text: "Ngày tạo", value: "date" },
				{ text: "Thành viên", value: "members" },
			],
			desserts: [],
			dialog: false,
			items: [],
		};
	},
	created() {
		this.loadRooms();
	},
	methods: {
		loadRooms: function() {
			for (const room of this.ad_rooms.rooms) {
				const info = {
					id: room.id,
					room_name: room.room_name,
					type: room.type,
					avatar: room.avatar,
					count: room.member.length,
					date: new Date(room.created_at).toLocaleDateString("en-GB"),
				};

				this.desserts.push(info);
			}
			this.rooms = this.ad_rooms;
		},
		textAvatar(roomName) {
			var words = roomName.split(" ");
			if (words.length === 1) {
				return words[0][0].toUpperCase();
			} else {
				return (words[0][0] + words[words.length - 1][0]).toUpperCase();
			}
		},
		seeMembers: function(id) {
			for (const room of this.ad_rooms.rooms) {
				for (const member of room.member) {
					if (id === room.id) {
						const mem = {
							text: member.username,
							icon: member.avatar,
						};
						this.items.push(mem);
					}
				}
			}
			this.dialog = true;
		},
	},
	computed: {
		...mapGetters(["ad_rooms"]),
	},
};
</script>
