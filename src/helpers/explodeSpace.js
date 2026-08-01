export const explodeSpace = (str) => {
    const splitStr = [...str.split(''), ...new Array(str.length % 3)];
    const newStr = []
    for (let i = 0; i + 2 < splitStr.length; i += 3) {
        const chunk = splitStr.slice(i, i + 3);
        newStr.push(chunk.join(''));
    }

    return newStr.join(' ');
}