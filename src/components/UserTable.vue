<template>
	<div>
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
				<img :src="item.avatar" style="width: 35px; height: 35px;" />
			</template>
			<template v-slot:item.active="{ item }">
				<v-chip
					v-if="!item.active"
					class="btn-unaction"
					text-color="white"
				>
					Đã khóa
				</v-chip>
				<v-chip
					v-if="item.active"
					class="btn-action"
					text-color="white"
				>
					Hoạt động
				</v-chip>
			</template>
			<template v-slot:item.delete="{ item }">
				<v-icon small class="mr-2" @click="deleteUserInfo(item.id)">
					mdi-delete
				</v-icon>
			</template>
		</v-data-table>

		<v-dialog v-model="dialogDelete" max-width="290">
			<v-card>
				<v-card-title class="headline">
					Bạn muốn xóa người dùng ?
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

					<v-btn class="btn-action" text @click="deleteUser()">
						Đồng ý
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
export default {
	name: "USER_TABLE",
	props: ["headers", "desserts"],
	data() {
		return {
			dialogDelete: false,
			user_id: null,
		}
	},
	methods:{
		deleteUserInfo: function(id) {
			this.user_id = id;
			this.dialogDelete = true;
		},
		deleteUser: function(){
			this.$store.dispatch("ad_deleteUser", this.user_id)
			this.dialogDelete = false;
		}
	}
};
</script>
