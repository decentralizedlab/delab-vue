import zh from './langs/zh'
import en from './langs/en'
export default {
    ssr: false,
    target: 'static',
    head: {
        title: 'Decentralized Laboratory',
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },
    css: ['~/assets/css/style.scss', '~/assets/css/iconfont.css'],
    plugins: [],
    components: true,
    buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/stylelint-module'],

    styleResources: {
        scss: '~/assets/css/style.scss'
    },
    modules: ['bootstrap-vue/nuxt', '@nuxtjs/i18n', '@nuxtjs/style-resources'],
    i18n: {
        locales: ['en', 'zh'],
        defaultLocale: 'en',
        vueI18n: {
            fallbackLocale: 'en',
            messages: {
                en,
                zh
            }
        }
    },
    build: {}
}
