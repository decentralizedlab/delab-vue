<template>
  <div class="index">
    <Navbar nav="home" />
    <div>
      <div class="banner">
        <img class="logo-lg" src="/imgs/logo2-icon.png" alt="" />
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
        <b-col v-for="(item, index) in list" :key="index" lg="4" md="12">
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
export default {
  name: 'IndexPage',
  data() {
    return {
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
}
</script>
<style lang="scss" scoped>
.index {
  .section {
    .section-img {
      width: 6rem;
    }
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
</style>
