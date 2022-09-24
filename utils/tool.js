export default {
    // ellipsis letters in address
    addressEllipsis(addr, ell = 8) {
        const shortName1 = addr.substring(0, ell)
        const shortName2 = addr.substring(addr.length - 4, addr.length)
        return `${shortName1}...${shortName2}`
    }
}
