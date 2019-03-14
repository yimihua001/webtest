<template>
    <header class="header c-bg-main tx-center">
        <button class="btn-return" @click="goback()">返回</button>
        {{text}}
    </header>

</template>
<script>
	export default{
    props:['text'],
    methods: {
        goback(){
           this.$router.go(-1)
        }
    }
	}
</script>
