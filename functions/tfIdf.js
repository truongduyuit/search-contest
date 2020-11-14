function tf(word, doc) {
	if (!doc) return 0

    const count = (" " + doc + " ").split(` ${word} `).length-1
    const length = doc.length
    return count/ length
}
function idf(word, docs) {
    const length = docs.length
    let count = 0

    for (let i =0; i < length; i++){
        if(docs[i].indexOf(word) !== -1) count++
    }
    return Math.log(length/(1+count))
}

function tfIdf(word, doc, docs) {
    return tf(word, doc) * idf(word, docs)
}
function compareTwoStrings(first, second) {
	first = first.replace(/\s+/g, '')
	second = second.replace(/\s+/g, '')

	if (!first.length && !second.length) return 1;
	if (!first.length || !second.length) return 0;
	if (first === second) return 1;
	if (first.length === 1 && second.length === 1) return 0;
	if (first.length < 2 || second.length < 2) return 0;

	const step = 2
	let first_word_map = new Map();
	for (let i = 0; i < first.length - 1 - step; i++) {
		const word = first.substring(i, i + step);
		const count = first_word_map.has(word)
			? first_word_map.get(word) + 1
			: 1;

		first_word_map.set(word, count);
	};

	let intersectionSize = 0;
	for (let i = 0; i < second.length - 1 - step; i++) {
		const word = second.substring(i, i + step);
		const count = first_word_map.has(word)
			? first_word_map.get(word)
			: 0;

		if (count > 0) {
			first_word_map.set(word, count - 1);
			intersectionSize++;
		}
	}

	return (2.0 * intersectionSize) / (first.length + second.length);
}
module.exports = {tf, idf, tfIdf, compareTwoStrings}