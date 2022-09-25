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
          <b-nav-item
            href="/institution"
            :active="nav.toLowerCase() === 'institution'"
          >
            {{ $t('Institution') }}
          </b-nav-item>
          <b-nav-item href="/about" :active="nav.toLowerCase() === 'about'">
            {{ $t('About') }}
          </b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input
              size="sm"
              class="mr-sm-2"
              placeholder="Search"
            ></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">
              {{ $t('Search') }}
            </b-button>
          </b-nav-form>

          <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ZH</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-dropdown
            v-if="account"
            :text="account"
            size="sm"
            variant="light"
            class="m-md-2"
          >
            <b-dropdown-item disabled href="#">Profile</b-dropdown-item>
            <b-dropdown-item disabled href="#">Sign Out</b-dropdown-item>
          </b-dropdown>
          <b-button v-if="loading" size="sm" variant="light" disabled>
            <b-spinner small type="grow"></b-spinner>
            {{ $t('Connecting to Web3...') }}
          </b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>
import web3 from '~/utils/web3'
import $ from '~/utils/tool'
export default {
  name: 'ComponentNavbar',
  props: {
    nav: {
      type: String,
      default: 'Home',
    },
  },
  data() {
    return {
      loading: false,
      account: '',
    }
  },
  mounted() {
    this.getAccount()
  },
  methods: {
    async getAccount() {
      try {
        this.loading = true
        const account = await web3.getAccount()
        this.account = $.addressEllipsis(account)
      } catch (e) {
        if (!localStorage.getItem('show_wallet_tip')) this.showError = true
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    stopShow() {
      localStorage.setItem('show_wallet_tip', true)
    },
    open(url) {
      window.open(url)
    },
  },
}
</script>
<style lang="scss" scoped>
.logo {
  height: 2rem;
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
