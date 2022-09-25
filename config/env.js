export default {
    VERSION: '0.1',
    CHAINNAME: {
        1337: 'Localhost',
        97: 'Binance Smart Chain Testnet',
        56: 'Binance Smart Chain Mainnet'
    },
    CHAINCURRENCY: {
        1337: { name: 'BNB', symbol: 'bnb', decimals: 18 },
        97: { name: 'BNB', symbol: 'bnb', decimals: 18 },
        56: { name: 'BNB', symbol: 'bnb', decimals: 18 }
    },
    NODES: {
        1337: ['https://localhost:9545'],
        97: [
            'https://data-seed-prebsc-1-s1.binance.org:8545',
            'https://data-seed-prebsc-1-s2.binance.org:8545',
            'https://data-seed-prebsc-2-s2.binance.org:8545'
        ],
        56: [
            'https://bsc-dataseed.binance.org',
            'https://bsc-dataseed1.defibit.io',
            'https://bsc-dataseed1.ninicoin.io'
        ]
    },
    SCAN: {
        97: ['https://testnet.bscscan.com'],
        56: ['https://bscscan.com']
    },
    ICON: {
        1: '/imgs/chain/eth.png',
        97: '/imgs/chain/bsc.svg',
        56: '/imgs/chain/bsc.svg',
        250: '/imgs/chain/ftm.png',
        1666600000: '/imgs/chain/harmony.png',
        128: '/imgs/chain/huobi.png',
        137: '/imgs/chain/polygon.png',
        321: '/imgs/chain/kucoin.png',
        1285: '/imgs/chain/moonriver.png',
        1284: '/imgs/chain/moonbeam.png',
        66: '/imgs/chain/okex.png',
        43114: '/imgs/chain/avax.png'
    },
    COIN: {
        1: 'ETH',
        97: 'BNB',
        56: 'BNB',
        250: 'FTM',
        1666600000: 'ONE',
        128: 'HT',
        137: 'MATIC',
        321: 'KCS',
        1285: 'MOVR',
        1284: 'GLMR',
        66: 'OKT',
        43114: 'AVAX'
    },
    NETWORK: {
        1: 'ETH',
        97: 'BSC Test',
        56: 'BSC',
        250: 'FTM',
        1666600000: 'Harmony',
        128: 'Heco',
        137: 'Polygon',
        321: 'Kucoin',
        1285: 'Moonriver',
        1284: 'Moonbeam',
        66: 'OKC',
        43114: 'Avax'
    }
}
