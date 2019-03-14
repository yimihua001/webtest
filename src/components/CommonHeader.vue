<template>
    <header class="header c-bg-main tx-center">
            <router-link class="btn-return" :to="url">返回</router-link>
        {{text}}
    </header>
</template>
<script>
	export default{
    props: {
             text: {
               type: String,
               default: ''
             },
             url: {
               type: String,
               default: ''
             }
    }
	}
</script>
