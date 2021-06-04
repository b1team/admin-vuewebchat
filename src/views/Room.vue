<template>
	<div id="inspire">
		<h1 style="padding: 10px;">Danh sách phòng</h1>
		<div class="search-wrapper">
			Tìm kiếm: 
			<input type="text" v-model="search" placeholder="Tên người dùng" />
		</div>
		<v-data-table
			:headers="headers"
			:items="filterdesserts"
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
			<template v-slot:item.delete="{ item }">
				<v-icon small class="mr-2" @click="deleteRoomInfo(item)">
					mdi-delete
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
						<v-list-item-group color="primary">
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

		<v-dialog v-model="dialogDelete" max-width="290">
			<v-card>
				<v-card-title class="headline">
					Bạn muốn xóa phòng ?
				</v-card-title>
				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn
						class="btn-unaction"
						text
						@click="dialogDelete = false"
					>
						Không
					</v-btn>

					<v-btn class="btn-action" text @click="deleteRoom">
						Đồng ý
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
				{ text: "Xóa phòng", value: "delete" },
			],
			desserts: [],
			dialog: false,
			items: [],
			room_id: null,
			dialogDelete: false,
			search: "",
			index: 0,
			deteleIndex: null
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
					index: this.index,
					room_name: room.room_name,
					type: room.type,
					avatar: room.avatar,
					count: room.member.length,
					date: new Date(room.created_at).toLocaleDateString("en-GB"),
				};

				this.desserts.push(info);
				this.index++;
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
			this.items = [];
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
		deleteRoomInfo: function(item) {
			this.room_id = item.id;
			this.deteleIndex = item.index;
			this.dialogDelete = true;
		},
		deleteRoom: function() {
			this.$store.dispatch("ad_deleteRoom", this.room_id);
			this.desserts.splice(this.deleteIndex, 1);
			this.dialogDelete = false;
		},
	},
	computed: {
		...mapGetters(["ad_rooms"]),
		filterdesserts() {
			return this.desserts.filter((item) => {
				return item.room_name
					.toLowerCase()
					.includes(this.search.toLowerCase());
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.search-wrapper {
	position: relative;
	padding: 20px;
	label {
		position: absolute;
		font-size: 12px;
		color: rgba(0, 0, 0, 0.5);
		top: 8px;
		left: 12px;
		z-index: -1;
		transition: 0.15s all ease-in-out;
	}
	input {
		padding: 4px 12px;
		color: rgba(0, 0, 0, 0.7);
		border: 1px solid rgba(0, 0, 0, 0.12);
		transition: 0.15s all ease-in-out;
		background: white;
		&:focus {
			outline: none;
			transform: scale(1.05);
			& + label {
				font-size: 10px;
				transform: translateY(-24px) translateX(-12px);
			}
		}
		&::-webkit-input-placeholder {
			font-size: 12px;
			color: rgba(0, 0, 0, 0.5);
			font-weight: 100;
		}
	}
}
</style>
