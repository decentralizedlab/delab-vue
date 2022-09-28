import Vue from 'vue'
export default {
    vue: new Vue(),
    // ellipsis letters in address
    addressEllipsis(addr, ell = 8) {
        const shortName1 = addr.substring(0, ell)
        const shortName2 = addr.substring(addr.length - 4, addr.length)
        return `${shortName1}...${shortName2}`
    },
    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            let imgResult = ''
            reader.readAsDataURL(file)
            reader.onload = function () {
                imgResult = reader.result
            }
            reader.onerror = function (error) {
                reject(error)
            }
            reader.onloadend = function () {
                resolve(imgResult)
            }
        })
    },
    toast(title, content, variant = 'success') {
        this.vue.$nuxt.$bvToast.toast(content, {
            variant,
            title
        })
    },
    decodeUint8(uint8array) {
        return new TextDecoder('utf-8').decode(uint8array)
    }
}
