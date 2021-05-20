// removeValue(array, item) remove item from the array
function removeValue(array, item) {
    var index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

module.exports.removeValue = removeValue;