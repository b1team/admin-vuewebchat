<template>
	<div>
		<v-app id="inspire">
			<h2 style="padding: 10px;">Danh sách người dùng</h2>
			<div class="search-wrapper">
				Tìm kiếm:
				<input
					type="text"
					v-model="search"
					placeholder="Tên người dùng"
				/>
			</div>
			<user-table
				:headers="headers"
				:desserts="filterdesserts"
				@filterUserData="filterUserData"
			/>
			<v-divider></v-divider>

			<h2 style="padding: 10px;">Tạo người dùng mới</h2>
			<v-form
				class="form t-color"
				ref="form"
				v-model="valid"
				lazy-validation
			>
				<v-text-field
					v-model="user.username"
					:rules="[rules.required]"
					label="Tên đăng nhập"
					maxlength="20"
					required
				></v-text-field>

				<v-text-field
					v-model="user.name"
					label="Tên người dùng"
					required
				></v-text-field>

				<v-text-field
					v-model="user.password"
					:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
					:rules="[rules.required, rules.min]"
					:type="show1 ? 'text' : 'password'"
					name="input-10-1"
					label="Mật khẩu"
					hint="At least 8 characters"
					counter
					@click:append="show1 = !show1"
				></v-text-field>

				<v-text-field
					block
					v-model="verify"
					:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
					:rules="[rules.required, passwordMatch]"
					:type="show1 ? 'text' : 'password'"
					name="input-10-1"
					label="Nhập lại mật khẩu"
					counter
					@click:append="show1 = !show1"
					@keyup.enter="validate"
				></v-text-field>

				<v-btn
					:disabled="!valid"
					class="ma-2 btn-action"
					@click="validate"
				>
					Tạo người dùng
				</v-btn>

				<v-btn class="mr-4 btn-unaction" @click="reset">
					Làm mới form
				</v-btn>
			</v-form>
		</v-app>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import UserTable from "../components/UserTable";

export default {
	name: "User",
	components: { UserTable },
	data() {
		return {
			users: [],
			headers: [
				{ text: "id", align: "start", value: "id" },
				{ text: "Tên người dùng", value: "username" },
				{ text: "Tên đầy đủ", value: "name" },
				{ text: "Ảnh đại diện", value: "avatar" },
				{ text: "Hoạt động", value: "active" },
				{ text: "Ngày tạo", value: "date" },
				{ text: "Xóa người dùng", value: "delete" },
			],
			desserts: [],
			valid: true,
			user: {
				username: "",
				name: "",
				password: "",
			},
			verify: "",
			emailRules: [
				(v) => !!v || "Không được bỏ trống",
				(v) => /.+@.+\..+/.test(v) || "E-mail phải đúng",
			],
			show1: false,
			rules: {
				required: (value) => !!value || "Không được bỏ trống",
				min: (v) => (v && v.length >= 8) || "Có ít nhất 8 ký tự",
			},
			search: "",
			index: 0
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData: function() {
			for (const data of this.ad_users.users) {
				const info = {
					id: data.user_id,
					index: this.index,
					username: data.username,
					name: data.name,
					avatar: data.avatar,
					active: data.active,
					date: new Date(data.created_at).toLocaleDateString("en-GB"),
				};
				this.desserts.push(info);
				this.index++;
			}
		},
		validate() {
			if (this.$refs.form.validate()) {
				let data = this.user;
				this.$store
					.dispatch("ad_createUser", data)
					.then((response) => {
						let data = response.data;
						const info = {
							id: data.user_id,
							index: this.index + 1,
							username: data.username,
							name: data.name,
							avatar: data.avatar,
							active: data.active,
							date: new Date(data.created_at).toLocaleDateString(
								"en-GB"
							),
						};
						this.desserts.push(info);
						this.reset();
					})
					.catch((error) => console.log(error));
			}
		},
		reset() {
			this.$refs.form.reset();
		},
		filterUserData({ index }) {
			console.log(index);
			this.desserts.splice(index, 1);
		},
	},
	computed: {
		...mapGetters(["ad_users"]),
		passwordMatch() {
			return () =>
				this.user.password === this.verify || "Mật khẩu phải chính xác";
		},
		filterdesserts() {
			return this.desserts.filter((item) => {
				return item.username
					.toLowerCase()
					.includes(this.search.toLowerCase());
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.form {
	padding: 20px 20px;
	border-style: groove;
}

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
