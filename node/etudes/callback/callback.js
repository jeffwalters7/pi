function afterRead() {
    console.log('afterRead');
}

function readFromDb(id, callback) {
    console.log('readFromDb', id);
    setTimeout(callback, 3000);
}

readFromDb(5, afterRead);

console.log('doing other work');
