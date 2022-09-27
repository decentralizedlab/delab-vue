export default {
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
    }
}
