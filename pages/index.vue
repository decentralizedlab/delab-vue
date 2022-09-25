<template>
    <div class="index">
        <Navbar nav="home" />
        <div class="banner">
            <img class="logo-lg" src="/imgs/logo2-icon.png" alt="" />
            <h1>{{ $t('Decentralized Laboratory') }}</h1>
            <p>
                {{
                    $t('DeLab is the first decentralized laboratory and knowledge distribution platform built on Web3')
                }}
            </p>
            <p>{{ $t('Our website is currently under construction...') }}</p>
            <b-button variant="dark" href="#" disabled>
                {{ $t('Coming Soon') }}
            </b-button>
        </div>
        <b-container class="section">
            <b-row>
                <b-col v-for="(item, index) in list" :key="index" lg="4" md="12">
                    <b-card class="text-center" :title="item.title" style="border: none;">
                        <b-card-img-lazy class="section-img" center :src="item.img" />
                        <b-card-text>{{ item.desc }}</b-card-text>
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
                        'Our vision is to build a decentralized research lab or academy on the Web3 network. To make everyone freely publish intellectual properties on the blockchain.'
                },
                {
                    title: 'Ownable',
                    img: '/imgs/ownable.svg',
                    desc:
                        'Protect intellectual property rights with cryptography. You publish research works as NFTs minted on the blockchain. Authors definitely owns the copyright.'
                },
                {
                    title: 'Valuable',
                    img: '/imgs/valuable.svg',
                    desc:
                        'All knowledge is valuable, more significant in the value-driven Web3 world. Publications are personal assets, thus the price and trades are decided by authors.'
                }
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
.index {
    .section {
        margin: 2.4rem auto;
        .section-img {
            width: 5rem;
        }
    }
    .banner {
        padding: 2rem 0;
        text-align: center;
        background: #e9ecef;
        width: 100%;
        h1 {
            font-size: 2.8rem;
            padding: 0.5rem 0;
        }
        p {
            font-size: 0.9rem;
            line-height: 1.2rem;
        }
        .logo-lg {
            height: 5rem;
        }
    }
}
</style>
