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
            <b-overlay :show="loading" rounded="sm">
                <div class="form">
                    <PicClip
                        class="clip"
                        data-url-type="base64"
                        accept="image/png, image/jpeg, image/jpg"
                        auto-clip
                        fixed-box
                        can-move
                        can-move-box
                        :img="form.avatar"
                        :auto-clip-width="200"
                        :auto-clip-height="200"
                        :output-size="0.7"
                        @finish="clip"
                    />
                    <div class="address-box">
                        <span class="address">
                            {{ form.account }}
                        </span>
                    </div>
                    <b-form-group :label="$t('Name')" label-for="name">
                        <b-form-input
                            id="name"
                            v-model="form.name"
                            :placeholder="$t('Enter name')"
                            required
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        :label="$t('Email')"
                        label-for="email"
                        :description="$t('Please use an public email')"
                    >
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
                    <b-button :loading="loading" variant="primary" block @click="submit">{{ $t('Submit') }}</b-button>
                </div>
            </b-overlay>
        </b-container>
        <Footer />
    </div>
</template>
<script>
import web3 from '~/utils/web3'
import $ from '~/utils/tool'
import { Author } from '~/config/contract'
export default {
    name: 'ProfilePage',
    data() {
        return {
            loading: false,
            form: {
                account: '',
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
    mounted() {
        this.loadData()
    },
    methods: {
        async loadData() {
            try {
                this.loading = true
                this.form.account = await web3.getAccount()
                const methods = await web3.contract(Author.abi, Author.address)
                const cid = await methods.authors(await web3.getAccount()).call()
                const res = await web3.getIPFS(cid)
                this.form = JSON.parse($.decodeUint8(res))
                console.log(this.form)
            } catch (e) {
                $.toast('Error', e.message, 'danger')
                console.error(e)
            } finally {
                this.loading = false
            }
        },
        async submit() {
            try {
                this.loading = true
                const res = await web3.setIPFS(JSON.stringify(this.form))
                const data = res.cid.toString()
                const methods = await web3.contract(Author.abi, Author.address)
                const trans = await methods.update(data).send({ from: await web3.getAccount() })
                $.toast('Success', trans.blockHash)
                this.loadData()
            } catch (e) {
                $.toast('Error', e.message, 'danger')
                console.error(e)
            } finally {
                this.loading = false
            }
        },
        back() {
            this.$router.back()
        },
        clip(_, base64) {
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
        height: 2rem;
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
        display: flex;
        align-content: center;
        justify-content: center;
        flex-direction: column;
        .clip {
            width: 6rem;
            height: 6rem;
            margin: 0 auto;
        }
        .address-box {
            text-align: center;
            padding: 1rem 0;
            .address {
                display: inline;
                margin: 0 auto;
                padding: 0.3rem 0.8rem;
                font-size: 0.7rem;
                border-radius: 1rem;
                background: rgba(0, 0, 0, 0.6);
                color: #fff;
            }
        }
    }
}
</style>
