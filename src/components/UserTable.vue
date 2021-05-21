<template>
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
			<v-chip v-if="!item.active" class="btn-unaction" text-color="white">
				Đã khóa
			</v-chip>
			<v-chip v-if="item.active" class="btn-action" text-color="white">
				Hoạt động
			</v-chip>
		</template>
	</v-data-table>
</template>

<script>
export default {
    props: ["headers", "desserts"]
}
</script>