<template>
    <div class="box">
        <el-card class="content">
            <h3>谷歌验证登录</h3>
            <div class="block mfa">
                <!-- <el-image v-if="hidden" :src="require('../../assets/img/abcaaa.png')"></el-image> -->
                <el-image v-if="mfasatus == 200" :src="mfaimg"></el-image>
                <el-link v-if="mfasatus == 200" :underline="false">请用Authenticator软件扫码,后输入谷歌验证码</el-link>
            </div>
            <div class="num mfa">
                <el-input v-model="mfanum" placeholder="请输入谷歌验证码" @keyup.enter.native="googleAuthen()"></el-input>
            </div>
            <div class="submit mfa">
                <el-button type="primary" :loading="submitLoad" @click="googleAuthen()">提交</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import { googleAuth } from '@/api'

export default {
    name:"googleauth",
    data () {
        return {
            mfanum: "",
            mfasatus: "",
            mfaimg: "",
            user:"",
            submitLoad: false,
        }
    },
    methods: {
        async googleAuthen() {
            if (!this.mfanum) {
                return this.$message.error("请输入谷歌验证码")
            }
            this.submitLoad = true;
            let params = {
                user: this.user,
                vcode: this.mfanum
            };
            const resp = await googleAuth(params).catch(err => {this.submitLoad = false;})
            if (resp.data.status == 666) {
                sessionStorage.setItem('token', resp.data.token);
                sessionStorage.setItem('user', this.user);
                this.$router.push('/').catch((err) => err);
                this.$message.success(resp.data.msg);
                this.submitLoad = false;
            } else {
                this.submitLoad = false;
                this.$message.error(resp.data.msg);
            }
        },
    },
    created () {
        this.mfasatus = this.$route.params.mfasatus;
        this.mfaimg = "https://" + window.location.host + "/" + this.$route.params.mfaimg;
        // this.mfaimg = "http://" + "101.35.143.86:8090" + "/" + this.$route.params.mfaimg;
        this.user = this.$route.params.user;
    },
}
</script>

<style lang="scss" scoped>
.box {
    height: 100%;
    background-color: #e9e9e9;
    overflow: hidden;
}
.mfa {
    margin: 16px auto;
}
.num {
    width: 202px;
    margin: 0 auto;
}
.submit {
    margin-bottom: 0;
}
.el-card {
    width: 509px;
    margin: 150px auto;
}
.el-link.el-link--default {
    position: relative;
    bottom: 12px;
    font-size: 12px;
}
.el-button--primary {
    width: 202px;
}
:deep .el-card__body {
    background-color: #f7f7f7;
}
.block {
    width: 53%;
}
</style>