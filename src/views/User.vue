<template>
	<div>
		<v-app id="inspire">
			<h2 style="padding: 10px;">Danh sách người dùng</h2>
			<user-table :headers="headers" :desserts="desserts" />
			<v-divider></v-divider>

			<h2 style="padding: 10px;">Tạo người dùng mới</h2>
			<v-form class="form t-color" ref="form" v-model="valid" lazy-validation>
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
					username: data.username,
					name: data.name,
					avatar: data.avatar,
					active: data.active,
					date: new Date(data.created_at).toLocaleDateString("en-GB"),
				};
				this.desserts.push(info);
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
	},
	computed: {
		...mapGetters(["ad_users"]),
		passwordMatch() {
			return () =>
				this.user.password === this.verify || "Mật khẩu phải chính xác";
		},
	},
};
</script>

<style scoped>
.form {
	padding: 20px 20px;
	border-style: groove;
}
</style>
