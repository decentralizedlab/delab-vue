<template>
    <div class="fullscreen">
        <div class="logo-box">
            <img class="back" src="/imgs/back.svg" alt="back" @click="back" />
            <b-img-lazy class="logo" src="/imgs/logo2.svg" />
        </div>
        <b-container class="container">
            <b-nav small pills class="nav">
                <b-nav-item active>Basic Info</b-nav-item>
                <b-nav-item>Link</b-nav-item>
                <b-nav-item>Another Link</b-nav-item>
                <b-nav-item>Disabled</b-nav-item>
            </b-nav>
            <div class="form">
                <PicClip
                    class="clip"
                    data-url-type="base64"
                    accept="image/png, image/jpeg, image/jpg"
                    auto-clip
                    fixed-box
                    can-move
                    can-move-box
                    :auto-clip-width="200"
                    :auto-clip-height="200"
                    :output-size="0.7"
                    @finish="clip"
                />
                <b-form-group :label="$t('Name')" label-for="name">
                    <b-form-input id="name" v-model="form.name" :placeholder="$t('Enter name')" required></b-form-input>
                </b-form-group>
                <b-form-group :label="$t('Email')" label-for="email" :description="$t('Please use an public email')">
                    <b-form-input
                        id="email"
                        v-model="form.email"
                        type="email"
                        :placeholder="$t('Enter email')"
                        required
                    ></b-form-input>
                </b-form-group>
                <b-form-group :label="$t('Affiliation')" label-for="affiliation">
                    <b-form-input
                        id="affiliation"
                        v-model="form.affiliation"
                        :placeholder="$t('Enter affiliation')"
                    ></b-form-input>
                </b-form-group>
                <b-form-group :label="$t('Position & Title')" label-for="position">
                    <b-form-input
                        id="position"
                        v-model="form.position"
                        :placeholder="$t('Enter position')"
                    ></b-form-input>
                </b-form-group>
                <b-form-group :label="$t('Introduction')" label-for="introduction">
                    <b-form-textarea
                        id="introduction"
                        v-model="form.introduction"
                        :placeholder="$t('Enter introduction...')"
                        rows="3"
                        max-rows="6"
                    ></b-form-textarea>
                </b-form-group>
                <b-button variant="primary" block @click="submit">{{ $t('Submit') }}</b-button>
            </div>
        </b-container>
        <Footer />
    </div>
</template>
<script>
import web3 from '~/utils/web3'
export default {
    name: 'ProfilePage',
    data() {
        return {
            form: {
                name: '',
                avatar: '',
                email: '',
                position: '',
                affiliation: '',
                labels: [],
                homepage: '',
                introduction: ''
            }
        }
    },
    methods: {
        async submit() {
            try {
                console.log(JSON.stringify(this.form))
                const res = await web3.setIpfs(JSON.stringify(this.form))
                console.log(res.cid.toString())
            } catch (e) {
                console.error(e)
            }
        },
        back() {
            this.$router.back()
        },
        clip(file, base64) {
            this.form.avatar = base64
        }
    }
}
</script>
<style lang="scss" scoped>
.logo-box {
    text-align: center;
    padding: 1rem 0;
    display: flex;
    align-content: center;
    justify-content: center;
    img {
        height: 2.5rem;
    }
    .back {
        position: absolute;
        left: 1rem;
        cursor: pointer;
    }
}
.container {
    background: #fff;
    padding: 3rem 0;
    position: relative;

    .nav {
        align-items: center;
        justify-content: center;
    }
    .form {
        width: 85%;
        max-width: 26rem;
        margin: 0 auto;
        margin-top: 2rem;
        .clip {
            width: 6rem;
            height: 6rem;
            margin: 0 auto;
        }
    }
}
</style>
