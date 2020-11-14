const Tokenizer = require('node-vntokenizer');
const token = new Tokenizer()

const algorithm_tf_idf = require('./functions/tfIdf')
const products = require("./data/products.json")
const keywords = require("./data/keywords.json")
const removeAccents = require("./functions/removeAccents")

const t0 = new Date().getTime()
const output = {
    "full_name": "Chung Nguyễn Trường Duy"
}
let result = {}
const limit = 10

keywords.map(key => {
    const keyword = key.toLowerCase()
    const keyword_not_accent = removeAccents(keyword)

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

        let coefficient = 1
        keyword_split.map((value) => {
            result += 2 * algorithm_tf_idf.tf(value, products_name[index]) * coefficient
            if (result !== 0) coefficient *= 2
        })

        coefficient = 1
        keyword_not_accent_split.map((value) => {
            result += algorithm_tf_idf.tf(value, products_name_not_accent[index]) * coefficient
            if(result !== 0) coefficient *= 2
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

    products.sort((a, b) => a.score > b.score ? -1 : 1)
    result = {...result, [keyword]: products.splice(0, limit)}
})

const fs = require('fs');
fs.writeFile('data/output2.json', JSON.stringify({...output, result}), (error) => {
  if (error) throw error;
  console.log('The output2.json has been saved!');
});

const t1 = new Date().getTime()
console.log("time: ", t1 - t0, "ms")