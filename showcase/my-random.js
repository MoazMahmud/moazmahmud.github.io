function getRandomString(length) {
    const collection = [];
    let index, isLowerCase;
    for (let i = 0; i < length; i++) {
        index = randomIntInRange(0, 26);
        isLowerCase = Math.random() < .5;
        const start = isLowerCase ? 'a' : 'A';
        const randomCharCode = start.charCodeAt(0) + index;
        collection.push(String.fromCharCode(randomCharCode));
    }
    return collection.join('');
}

function randomIntInRange(startInclusive, endExclusive) {
    return startInclusive + Math.floor(Math.random() * (endExclusive - startInclusive));
}