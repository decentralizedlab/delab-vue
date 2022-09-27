<template>
    <div>
        <b-modal
            v-model="showError"
            class="modal"
            :title="$t('Error')"
            :cancel-title="$t('Don not show again')"
            @cancel="stopShow"
        >
            <h3>{{ $t('Ready for Web3?') }}</h3>
            <p>
                {{ $t('It seems you are not browsing in the Web3 Network!') }}
                <br />
                {{ $t('Please install a wallet plugin for your browser.') }}
            </p>
            <div class="wallet-list">
                <b-row align-h="center" class="text-center">
                    <b-col cols="4">
                        <div class="wallet-box" @click="open('https://metamask.io/')">
                            <img class="img" src="/imgs/metamask.webp" />
                            <div class="title">METAMASK</div>
                        </div>
                    </b-col>
                </b-row>
            </div>
        </b-modal>
        <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-brand href="#">
                <img class="logo" src="/imgs/logo2.svg" />
            </b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item href="/" :active="nav.toLowerCase() === 'home'">
                        {{ $t('Home') }}
                    </b-nav-item>
                    <b-nav-item href="/publish" :active="nav.toLowerCase() === 'publish'">
                        {{ $t('Publication') }}
                    </b-nav-item>
                    <b-nav-item href="/author" :active="nav.toLowerCase() === 'author'">
                        {{ $t('Author') }}
                    </b-nav-item>
                    <b-nav-item href="/institution" :active="nav.toLowerCase() === 'institution'">
                        {{ $t('Institution') }}
                    </b-nav-item>
                    <b-nav-item href="/about" :active="nav.toLowerCase() === 'about'">
                        {{ $t('About') }}
                    </b-nav-item>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-dropdown v-if="account" size="sm" variant="light" class="m-md-2">
                        <template #button-content>
                            <div class="button-content">
                                <img class="chain-icon" :src="icon" />
                                <span class="balance">{{ balance }}</span>
                                <span>{{ account }}</span>
                            </div>
                        </template>
                        <b-dropdown-item href="/profile">Profile</b-dropdown-item>
                        <b-dropdown-item disabled href="#">Sign Out</b-dropdown-item>
                    </b-dropdown>
                    <b-button v-if="loading" size="sm" variant="light" disabled>
                        <b-spinner small type="grow"></b-spinner>
                        {{ $t('Connecting to Web3...') }}
                    </b-button>
                    <b-nav-item-dropdown :text="$t('Lang')" right>
                        <b-dropdown-item href="/">EN</b-dropdown-item>
                        <b-dropdown-item href="/zh">ZH</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>
<script>
import web3 from '~/utils/web3'
import $ from '~/utils/tool'
import env from '~/config/env'
export default {
    name: 'ComponentNavbar',
    props: {
        nav: {
            type: String,
            default: 'Home'
        }
    },
    data() {
        return {
            loading: false,
            account: '',
            balance: 0.0,
            icon: ''
        }
    },
    mounted() {
        this.getAccount()
        this.getChain()
        this.getBalance()
    },
    methods: {
        async getAccount() {
            try {
                this.loading = true
                if (!web3.checkProvider()) return (this.showModalNoneWallet = true)
                const account = await web3.getAccount()
                this.account = $.addressEllipsis(account)
            } catch (e) {
                console.error(e)
            } finally {
                this.loading = false
            }
        },
        async getChain() {
            try {
                const id = await web3.chainId()
                this.icon = env.ICON[id]
            } catch (e) {
                console.error(e)
            }
        },
        async getBalance() {
            try {
                this.balance = parseFloat(web3.utils.fromWei(await web3.balance())).toFixed(4)
            } catch (e) {
                console.error(e)
            }
        },
        stopShow() {
            localStorage.setItem('show_wallet_tip', true)
        },
        open(url) {
            window.open(url)
        }
    }
}
</script>
<style lang="scss" scoped>
.logo {
    height: 2rem;
}
.button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    float: left;
    .chain-icon {
        height: 1rem;
    }
    .balance {
        font-weight: bold;
        margin: 0 0.5rem;
    }
}
.modal {
    .wallet-list {
        .wallet-box {
            padding: 0.5rem;
            transition: all 0.3s linear;
            &:hover {
                cursor: pointer;
                background: rgba(0, 0, 0, 0.1);
            }
            .title {
                font-size: 0.7rem;
                margin-top: 0.5rem;
            }
            .img {
                width: 3rem;
            }
        }
    }
}
</style>
