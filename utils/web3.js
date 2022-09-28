import Web3 from 'web3'
import { create } from 'ipfs-core'

export default {
    web3: null,
    ipfs: null,
    utils: Web3.utils,
    async init() {
        if (this.web3) return this.web3 // already inited
        const provider = this.checkProvider()
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
    checkProvider() {
        let provider
        if (window.web3 && window.web3.currentProvider) provider = window.web3.currentProvider
        if (window.ethereum) provider = window.ethereum
        return provider
    },
    reload() {
        location.replace('/')
    },
    async getAccount() {
        return (await this.getAccounts())[0]
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
    async contract(abi, addr) {
        await this.init()

        return new this.web3.eth.Contract(abi, addr[await this.chainId()]).methods
    },
    async IPFS() {
        if (!this.ipfs) this.ipfs = await create()
        console.log('IPFS', this.ipfs.isOnline())
        const { agentVersion, id } = await this.ipfs.id()
        console.log('agentVersion', agentVersion)
        console.log('id', id)
    },
    // upload files, text to ipfs
    async setIPFS(content) {
        await this.IPFS()
        if (!this.ipfs.isOnline()) throw new Error('IPFS is not online')
        return await this.ipfs.add(content)
    },
    async getIPFS(cid) {
        await this.IPFS()
        for await (const chunk of this.ipfs.cat(cid)) if (chunk) return chunk
        // for await (const chunk of this.ipfs.get(cid)) if (chunk) return chunk
    },
    // opposite to init
    destroy() {
        if (this.web3) {
            this.web3.destroy()
            this.web3 = null
            this.ipfs = null
        }
    }
}
