import Web3 from 'web3'
export default {
    web3: null,
    utils: Web3.utils,
    async init() {
        if (this.web3) return this.web3 // already inited
        let provider
        if (window.web3 && window.web3.currentProvider) provider = window.web3.currentProvider
        if (window.ethereum) provider = window.ethereum
        await provider.request({
            method: 'eth_requestAccounts'
        })
        this.web3 = new Web3(provider)
        console.log('Wallet', this.web3)
        // detect Metamask account change
        provider.on('accountsChanged', this.reload)
        // detect Network account change
        provider.on('chainChanged', this.reload)
        return this.web3
    },
    reload() {
        location.replace('/')
    },
    async getAccount() {
        await this.init()
        return (await this.web3.eth.getAccounts())[0]
    },
    async getAccounts() {
        await this.init()
        return await this.web3.eth.getAccounts()
    },
    async provider() {
        await this.init()
        return this.web3.currentProvider
    },
    async balance(address = '') {
        await this.init()
        address = address || (await this.getAccount())
        return await this.web3.eth.getBalance(address)
    },
    async chainId() {
        await this.init()
        return await this.web3.eth.getChainId()
    },
    // opposite to init
    destroy() {
        if (this.web3) {
            this.web3.destroy()
            this.web3 = null
        }
    }
}
