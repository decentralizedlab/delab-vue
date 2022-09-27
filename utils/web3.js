import Web3 from 'web3'
import * as IPFS from 'ipfs-core'

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
    // upload files, text to ipfs
    async setIpfs(content) {
        if (!this.ipfs) this.ipfs = await IPFS.create()
        return await this.ipfs.add(content)
    },
    // get things from ipfs
    /*
    async getIpfs(hash) {
        if (!this.ipfs) this.ipfs = await IPFS.create()
        for await (const chunk of this.ipfs.cat(hash)) {
            if (!chunk) continue
            const filetype = await FileType.fromBuffer(chunk)
            // return functions can transfer to different strings
            return {
                buffer: () => chunk,
                text: () => Buffer.from(chunk).toString(),
                json: () => JSON.parse(Buffer.from(chunk).toString()),
                base64: () => Buffer.from(chunk).toString('base64'),
                img64: () => `data:${filetype.mime};base64,${Buffer.from(chunk).toString('base64')}`
            }
        }
    },
    */
    // opposite to init
    destroy() {
        if (this.web3) {
            this.web3.destroy()
            this.web3 = null
            this.ipfs = null
        }
    }
}
