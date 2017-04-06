var ds = require('../index');

var tree = new ds.BinarySearchTree([1, 2, 3, 4]);

var list = new ds.LinkedList([1, 2, 3, 4]);

console.log(tree.toArray());
console.log(list.toArray());