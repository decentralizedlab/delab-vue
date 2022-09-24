<template>
  <div class="index">
    <b-modal v-model="showError" class="modal" :title="$t('Error')">
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
        <img class="logo" src="/imgs/logo-icon.png" />
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">{{ $t('Home') }}</b-nav-item>
          <b-nav-item href="#" disabled>{{ $t('Publication') }}</b-nav-item>
          <b-nav-item href="#" disabled>{{ $t('Author') }}</b-nav-item>
          <b-nav-item href="#" disabled>{{ $t('About') }}</b-nav-item>
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

    <div>
      <div class="banner">
        <img class="logo-lg" src="/imgs/logo.png" alt="" />
        <h1>{{ $t('Decentralized Laboratory') }}</h1>
        <p>
          {{
            $t(
              'DeLab is the first decentralized laboratory and knowledge distribution platform built on Web3'
            )
          }}
        </p>
        <p>{{ $t('Our website is currently under construction...') }}</p>
        <b-button variant="dark" href="#" disabled>
          {{ $t('Coming Soon') }}
        </b-button>
      </div>
    </div>
    <b-container class="section">
      <b-row>
        <b-col v-for="(item, index) in list" :key="index">
          <b-card
            class="text-center"
            :title="item.title"
            img-top
            style="border: none;"
          >
            <b-card-img-lazy class="section-img" center :src="item.img" />
            <b-card-text>
              {{ item.desc }}
            </b-card-text>
            <b-button href="#" variant="dark">{{ $t('Learn More') }}</b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <Footer />
  </div>
</template>

<script>
import web3 from '~/utils/web3'
import $ from '~/utils/tool'
export default {
  name: 'IndexPage',
  data() {
    return {
      loading: false,
      account: '',
      list: [
        {
          title: 'Decentralized',
          img: '/imgs/decentralized.svg',
          desc:
            'We hope to build a decentralized research lab or academy on Web3 network. Your can freely publish your intellectual property on the blockchain.',
        },
        {
          title: 'Ownable',
          img: '/imgs/ownable.svg',
          desc:
            'Crypto technique protects your IPRs. You publish research works as NFTs on the blockchain through smart contracts. Any author should definitely own the copyright.',
        },
        {
          title: 'Valuable',
          img: '/imgs/valuable.svg',
          desc:
            'Knowledge is valuable, more important in the value-driven Web3 world. Your publications are personal assets, thus you can freely price and trade.',
        },
      ],
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
        this.showError = true
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    open(url) {
      window.open(url)
    },
  },
}
</script>
<style lang="scss" scoped>
.index {
  .section-img {
    width: 6rem;
  }
  .section {
    padding: 2rem 0;
  }
  .logo {
    width: 2rem;
  }
  .banner {
    padding: 2rem 0;
    text-align: center;
    background: #e9ecef;
    width: 100%;
    h1 {
      font-size: 3.5rem;
      padding: 0.5rem 0;
    }
    .logo-lg {
      height: 6.5rem;
    }
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
