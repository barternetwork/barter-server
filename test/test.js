let pair1 = [{"id":1,"name":"a"},{"id":2,"name":"b"}]
let pair2 = [{"id":3,"name":"c"},{"id":4,"name":"d"}]
let dex = "quickswp"
let result = {
    "quickswap":null,
    "sishiswap":pair1,
    "apeswap":pair1,
    "pancakeswap":pair2,
    "uniswap_v2":pair2,
    "uniswap_v3":pair2,
}

delete result.uniswap_v2;

console.log(result)