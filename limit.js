const Tokenizer = require('node-vntokenizer');
const token = new Tokenizer()

const algorithm_tf_idf = require('./functions/tfIdf')
const products = require("./data/products.json")
const removeAccents = require("./functions/removeAccents")

const t0 = new Date().getTime()

console.log("====================================================================")
const keyword = "tinh dau thong do".toLowerCase()
const keyword_not_accent = removeAccents(keyword)
const limit = 100000

let products_name = []
let products_name_not_accent = []
let max_score = 0

products.map((product, index) => {
    products_name[index] = product.name.toLowerCase()
    products_name_not_accent[index] = removeAccents(product.name.toLowerCase())
})

const keyword_split = token.tokenize(keyword)
const keyword_not_accent_split = token.tokenize(keyword_not_accent)
products.map((product, index) => {
    let result = 2 * algorithm_tf_idf.tf(keyword, products_name[index])
    result += algorithm_tf_idf.tf(keyword_not_accent, products_name_not_accent[index])

    let coefficient = 2
    keyword_split.map((value) => {
        result += 2 * algorithm_tf_idf.tf(value, products_name[index]) * coefficient
        if (result !== 0) coefficient++
    })

    coefficient = 1
    keyword_not_accent_split.map((value) => {
        result += algorithm_tf_idf.tf(value, products_name_not_accent[index]) * coefficient
        if(result !== 0) coefficient++
    })

    if(result > max_score) max_score = result
    product['score'] = result
})

if (max_score === 0 ) {
    products.map((product, index) => {
        let result = algorithm_tf_idf.compareTwoStrings(products_name[index], keyword)
        result += algorithm_tf_idf.compareTwoStrings(products_name_not_accent[index], keyword_not_accent)
        product['score'] = result
    })
}

const products_filter = products.filter(x => x.score > 0)
products_filter.sort((a, b) => a.score > b.score ? -1 : 1)

const t1 = new Date().getTime()
console.log("keyword: ", keyword)
console.log("keyword_split: ", keyword_split)
console.log("size", products_filter.length)
console.log("output: ", products_filter.splice(0, 10))
console.log("time: ", t1 - t0, "ms")