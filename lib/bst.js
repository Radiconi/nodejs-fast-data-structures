/*!
 * fast-data-structures
 * Copyright(c) 2017 Predrag Radic
 * MIT Licensed
 */

'use strict';

class Node {
    constructor(key, val) {
        this.key = key;
        this.value = val !== undefined ? val : key;
        this.left = null;
        this.right = null;
        this.count = 1; // Counts itself and all nodes in left and right subtree
        this.isRed = true;
    }
}

// Default compare functions
var cmp = {
    isLess: function(a, b) {
        return a < b;
    },
    isLessOrEqual: function(a, b) {
        return a <= b;
    },
    isGreater: function(a, b) {
        return a > b;
    },
    isGreaterOrEqual: function(a, b) {
        return a >= b;
    },
    areEqual: function(a, b) {
        return a === b;
    }
};

// When creating new instance of BST object, we can define custom comparison functions
function initCompare(compareFunc) {
    if (compareFunc) {
        cmp.isLess = function(a, b) {
            return compareFunc(a, b) < 0;
        }
        cmp.isLessOrEqual = function(a, b) {
            return compareFunc(a, b) <= 0;
        }
        cmp.isGreater = function(a, b) {
            return compareFunc(a, b) > 0;
        }
        cmp.isGreaterOrEqual = function(a, b) {
            return compareFunc(a, b) >= 0;
        }
        cmp.areEqual = function(a, b) {
            return compareFunc(a, b) === 0;
        }
    }
}

function count(node) {
    return node ? node.count : 0;
}

function recalculateCount(node) {
    // Counts itself and number of nodes in left and right subtree
    if (node) {
        node.count = count(node.left) + count(node.right) + 1;
    }
    return node;
}

function isRed(node) {
    return node ? node.isRed : false;
}

/// Red-black algorithm functions:    ////////////////
// rotateLeft()
// rotateRight()
// flipColors()
// balance()

function rotateLeft(node) {
    /*
        Orient right red link to left red link

        5                7
       / \Red        Red/ \ 
      3   7    ==>     5   8
         / \          / \
        6   8        3   6
    */
    if (node === null) return;
    var rootCount = node.count;
    var newRoot = node.right; // 7
    node.right = newRoot.left; // 6
    node = recalculateCount(node);
    newRoot.left = node; // 5
    newRoot.isRed = node.isRed;
    newRoot.count = rootCount;
    node.isRed = true;
    return newRoot;
}

function rotateRight(node) {
    /*
        Orient left red link to right red link

        5                7
       / \Red        Red/ \ 
      3   7    <==     5   8
         / \          / \
        6   8        3   6
    */
    if (node === null) return;
    var rootCount = node.count;
    var newRoot = node.left; // 5
    node.left = newRoot.right; // 6
    node = recalculateCount(node);
    newRoot.right = node; // 5
    newRoot.isRed = node.isRed;
    newRoot.count = rootCount;
    node.isRed = true;
    return newRoot;
}

function flipColors(node) {
    if (node === null) return;
    if (!isRed(node.left) || !isRed(node.right)) return;
    node.right.isRed = false;
    node.left.isRed = false;
    node.isRed = true;
    return node;
}

function balance(node) {
    if (node) {
        // lean left
        if (isRed(node.right) && !isRed(node.left)) {
            node = rotateLeft(node);
        }
        // balance 4-node
        if (node.left !== null) {
            if (isRed(node.left) && isRed(node.left.left)) {
                node = rotateRight(node);
            }
        }
        // split 4-node
        if (isRed(node.left) && isRed(node.right)) {
            node = flipColors(node);
        }
    }
    node = recalculateCount(node);
    return node;
}

////////////////////////////////////////////////////////// 

function put(node, key, val) {
    // 
    if (node === null) {
        return new Node(key, val);
    } else if (cmp.areEqual(node.key, key)) {
        node.value = val;
    } else if (cmp.isLess(key, node.key)) {
        if (node.left === null) {
            node.left = new Node(key, val);
        } else {
            node.left = put(node.left, key, val);
        }
    } else {
        if (node.right === null) {
            node.right = new Node(key, val);
        } else {
            node.right = put(node.right, key, val);
        }
    }
    node = recalculateCount(node);

    // Call red-black balance algorithm
    node = balance(node);

    return node;
}

function deleteByKey(node, key) {
    if (node === null) {
        return null;
    }

    if (cmp.areEqual(node.key, key)) {
        // We found node to delete
        if (node.left === null && node.right === null) {
            // Node has no children.
            if (node.isRed) {
                // Node is red: just delete (set node null), no need to change red-black balance
                return {
                    node: null,
                    doubleBlack: false
                };
            } else {
                // Black node is deleting, return double black, to balance tree
                return {
                    node: null,
                    doubleBlack: true
                };
            }
        } else {
            // Node has at least one child
            if (node.right === null) {
                // No right child. Node will be replaced with its left child. In balanced red-black tree, left child without its sibling must be red and cannot have children,
                // It will become black, and tree will remain balanced.
                node = node.left;
                node.isRed = false;
                return {
                    node: node,
                    doubleBlack: false
                };
            } else {
                // There is right child, which in red-black tree means that both children exists (right child only will cause imbalance)
                // Replace node key/value with its successor - min node key/value from right side
                let result = moveMin(node, node.right);
                // Here node key and value are changed with its successor
                // No reference should be changed.
                // We need to propagate double-black to the root, to make tree balanced.
                node.right = result.node;
                result.node = node; // change result to current node
                if (result.doubleBlack) {
                    result = balanceDoubleBlack(node, 'left');
                    node = result.node;
                }
                return result;
            }
        }
    }
    var result = null;
    if (cmp.isLess(key, node.key)) {
        result = deleteByKey(node.left, key);
        if (result) {
            node.left = result.node;
            result.node = node;
            if (result.doubleBlack) {
                result = balanceDoubleBlack(node, 'right');
                node = result.node;
            }
        }
    } else {
        result = deleteByKey(node.right, key);
        if (result) {
            node.right = result.node;
            result.node = node;
            if (result.doubleBlack) {
                result = balanceDoubleBlack(node, 'left');
                node = balanceResult.node;
            }
        }
    }
    node = recalculateCount(node);
    return result;
}

function balanceDoubleBlack(node, sideToBalance) {
    if (sideToBalance === 'right') {
        if (node.right) {
            // must exist, but...
            if (!node.right.isRed) {
                // a.) right is black. Just make it red
                node.right.isRed = true;
            } else {
                // b.) right is red. We have to rotate left, in order to balance, and set new node.left.right to red
                node = rotateLeft(node);
                node.left.isRed = false;
                if (node.left.right) {
                    node.left.right.isRed = true;
                }
                node.left = balance(node.left);
            }
        }
    } else {
        if (node.left) {
            // must exist, but...
            if (!node.left.isRed) {
                // a.) left is black. Just make it red
                node.left.isRed = true;
            } else {
                // b.) left is red. We have to rotate right, in order to balance, and set new node.right.left to red
                node = rotateRight(node);
                node.right.isRed = false;
                if (node.right.left) {
                    node.right.left.isRed = true;
                }
                node.right = balance(node.right);
            }
        }
    }
    var result = {
        node: node,
        doubleBlack: true
    };
    if (node.isRed) {
        // this is show-stopper. Make node black and stop propagate double black
        node.isRed = false;
        result.doubleBlack = false;
    }
    return result;
}

function moveMin(rootNode, node) {
    // we suppose that min has no childres and is always left node (or node.right if only one node exists in right branch)
    // this assumption is based on red-black tree rules
    var result = {
        node: null,
        doubleBlack: false
    };

    if (node === null) {
        return result;
    }

    if (node.right !== null && node.left === null) {
        // impossible situation in r-b tree, but let's be sure...
        // rotate left to eliminate imbalance
        node = rotateLeft(node);
    }
    if (node.left !== null) {
        result = moveMin(rootNode, node.left);
        node.left = result.node;
        result.node = node;
        if (result.doubleBlack) {
            // balance right side
            result = balanceDoubleBlack(node, 'right');
        }
    } else {
        // node is min, copy min to rootNode
        rootNode.key = node.key;
        rootNode.value = node.value;
        rootNode.count--;
        result = {
            node: null, // delete reference to min
            doubleBlack: !node.isRed // if black, send double-black to balance
        };
    }
    return result;
}


function min(node) {
    if (node === null) {
        return null;
    }
    while (node.left !== null) {
        node = node.left;
    }
    return node;
}

function max(node) {
    if (node === null) {
        return null;
    }
    while (node.right !== null) {
        node = node.right;
    }
    return node;
}

function findNode(key) {
    var node = this.root;
    while (node !== null) {
        if (cmp.areEqual(node.key, key)) {
            return node;
        }
        if (cmp.isLess(this.comparekey, node.key)) {
            node = node.left;
        } else {
            node = node.right;
        }
    }
    return null;
}

function floorNode(x, node) {
    if (node === null) {
        return null;
    } else if (cmp.areEqual(node.key, x)) {
        return node;
    } else if (cmp.isLess(node.key, x)) {
        let rightFloor = floorNode(x, node.right);
        return rightFloor ? rightFloor : node;
    } else {
        return floorNode(x, node.left);
    }
}

function ceilingNode(x, node) {
    if (node === null) {
        return null;
    } else if (cmp.areEqual(node.key, x)) {
        return node;
    } else if (cmp.isLess(x, node.key)) {
        let leftCeiling = ceilingNode(x, node.left);
        return leftCeiling ? leftCeiling : node;
    } else {
        return ceilingNode(x, node.right);
    }
}

function inOrderTraversal(node, callback) {
    if (node !== null) {
        inOrderTraversal(node.left, callback);
        callback(node);
        inOrderTraversal(node.right, callback);
    }
}

function preOrderTraversal(node, callback) {
    if (node !== null) {
        callback(node);
        preOrderTraversal(node.left, callback);
        preOrderTraversal(node.right, callback);
    }
}

function postOrderTraversal(node, callback) {
    if (node !== null) {
        postOrderTraversal(node.left, callback);
        postOrderTraversal(node.right, callback);
        callback(node);
    }
}

function traversalRange(greaterFunc, lessFunc, node, callback) {
    if (node !== null) {
        if (greaterFunc(node.key)) {
            // If key is bigger than min, it's possible to have more nodes in range on the left side
            traversalRange(greaterFunc, lessFunc, node.left, callback);
        }
        if (greaterFunc(node.key) && lessFunc(node.key)) {
            // If node.key is in range 'callback' it
            callback(node);
        }
        if (lessFunc(node.key)) {
            // If key is less than max, it's possible to have more nodes in range on the right side
            traversalRange(greaterFunc, lessFunc, node.right, callback);
        }
    }
}

function countLess(x, node, includeEqual) {
    if (node === null) {
        return 0;
    } else if (cmp.areEqual(node.key, x)) {
        return (node.left ? node.left.count : 0) + includeEqual;
    } else if (cmp.isLess(node.key, x)) {
        return (node.left ? node.left.count + 1 : 1) + countLess(x, node.right, includeEqual);
    } else {
        return countLess(x, node.left, includeEqual);
    }
}

function countGreater(x, node, includeEqual) {
    if (node === null) {
        return 0;
    } else if (cmp.areEqual(node.key, x)) {
        return (node.right ? node.right.count : 0) + includeEqual;
    } else if (cmp.isLess(x, node.key)) {
        return (node.right ? node.right.count + 1 : 1) + countGreater(x, node.left, includeEqual);
    } else {
        return countGreater(x, node.right, includeEqual);
    }
}


class BinarySearchTree {

    /**
     * BinarySearchTree constructor
     @param {*} constructorData (optional) Variant 1: constructorData is object with 'data' and 'keyPredicate' properties. 'data' is array of values. 
        If value is an object, keyPredicate is used to evaluate 'key'.
        Variant 2: constructorData is array of values. Key will be set the same as value.
     @param {function} compareFunc (optional) Function which takes two objects as arguments (a, b) and returns: -1 when a < b, 0 when a === b and 1 when a > b.
     Used in case of complex keys which cannot be compared using regular operators (<, =, >).
     */
    constructor(constructorData, compareFunc) {
        this.root = null;
        if (constructorData) {
            // Option 1: constructor data is array:
            if (Array.isArray(constructorData)) {
                let arr = constructorData;
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].key && arr[i].value) {
                        // 1.a - array of key-value pairs
                        this.put(arr[i].key, arr[i].value);
                    } else {
                        // 1.b - array of values
                        this.put(arr[i]);
                    }
                }
            }
            let arr = constructorData.data;
            if (Array.isArray(arr)) {
                for (let i = 0; i < arr.length; i++) {
                    let key = constructorData.keyPredicate ? constructorData.keyPredicate(arr[i]) : arr[i];
                    this.put(key, arr[i]);
                }
            }
        }

        initCompare(compareFunc);

    }

    /**
     * Put key-value pair into tree
     * @memberof BinarySearchTree
     * @param {*} key Comparable key value. Tree is sorted by this value
     * @param {*} val Value
     * @returns {BinarySearchTree} Returns reference to this BinarySearchTree object
     */
    put(key, val) {
        this.root = put(this.root, key, val);
        this.root.isRed = false;
        return this;
    }

    /**
     * Delete node with given key
     * @memberof BinarySearchTree
     * @param {*} key Node key
     * @returns {BinarySearchTree} Returns reference to this BinarySearchTree object
     */
    delete(key) {
        var result = deleteByKey(this.root, key);
        if (result) {
            this.root = result.node;
        }
        return this;
    }

    /**
     * Get value by key
     * @memberof BinarySearchTree
     * @param {*} key Key
     * @returns {*} Returns node value. If node with given key does not exist, returns null.
     */
    getValue(key) {
        var node = findNode(key);
        if (node) {
            return node.value;
        } else {
            return null;
        }
    }

    /**
     * Get minimum key value
     * @memberof BinarySearchTree
     * @returns {*} Returns value of node with minimum key. If tree is empty returns null.
     */
    min() {
        var node = min(this.root);
        return node ? node.value : null;
    }

    /**
     * Get maximum key value
     * @memberof BinarySearchTree
     * @returns {*} Returns value of node with maximum key. If tree is empty returns null.
     */
    max() {
        var node = max(this.root);
        return node ? node.value : null;
    }

    /**
     * Get value of floor node. Floor node is node with the highest key which is less or equal than x.
     * @memberof BinarySearchTree
     * @param {*} x data to compare key with
     * @returns {*} Returns value of floor node. If tree is empty, of there is no floor under x, returns null.
     */
    floor(x) {
        var node = this.root;
        var floorNode = floorNode(x, node);
        return floorNode ? floorNode.key : null;
    }

    /**
     * Get value of ceiling node. Ceiling node is node with the lowest key which is greater or equal than x.
     * @memberof BinarySearchTree
     * @param {*} x data to compare key with
     * @returns {*} Returns value of ceiling node. If tree is empty, of there is no ceiling above x, returns null.
     */
    ceiling(x) {
        var node = this.root;
        var ceilingNode = ceilingNode(x, node);
        return ceilingNode ? ceilingNode.key : null;
    }

    /**
     * Iterate through all nodes in the three
     * @memberof BinarySearchTree
     * @param {function} callback Function to be run for every node. Whole node is provided as argument.
     * @param {string} traversalType (optional) In-order traversal by default. Specify 'pre' for pre-order, or 'post' for post-order traversal
     * @returns {BinarySearchTree} Returns reference to this BinarySearchTree object
     */
    iterate(callback, traversalType) {
        var node = this.root;
        if (traversalType) {
            if (traversalType === 'pre') {
                preOrderTraversal(node, callback);
            } else if (traversalType === 'post') {
                postOrderTraversal(node, callback);
            } else {
                inOrderTraversal(node, callback);
            }
        } else {
            inOrderTraversal(node, callback);
        }
        return this;
    }

    /**
     * Iterate through all nodes in the three, which keys are in range defined by from and to functions
     * @memberof BinaryTree
     * @param {*} from Range start
     * @param {*} to Range end
     * @param {function} callback Callback function to be run for each node in iterateRange
     * @param {*} opt (optional) Range options object: { excludeFrom: true, excludeTo: true} (both are false by default) 
     * @returns {BinarySearchTree} Returns reference to this BinarySearchTree object
     */
    iterateRange(from, to, callback, opt) {
        var node = this.root;
        var greaterFunc = (x) => {
            return cmp.isGreaterOrEqual(x, from)
        };
        var lessFunc = (x) => {
            return cmp.isLessOrEqual(x, to)
        };
        if (opt) {
            if (opt.excludeFrom) {
                greaterFunc = (x) => {
                    return cmp.isGreater(x, from)
                };
            }
            if (opt.excludeTo) {
                lessFunc = (x) => {
                    return cmp.isGreater(x, from)
                };
            }
        }
        traversalRange(greaterFunc, lessFunc, node, callback);
        return this;
    }

    /**
     * Count number of nodes which key is less than x
     * @memberof BinaryTree
     * @param {*} x data to compare key with
     */
    countLess(x) {
        return countLess(x, this.root, 0);
    }

    /**
     * Count number of nodes which key is less or equal than x
     * @memberof BinaryTree
     * @param {*} x data to compare key with
     */
    countLessOrEqual(x) {
        return countLess(x, this.root, 1);
    }

    /**
     * Count number of nodes which key is greater than x
     * @memberof BinaryTree
     * @param {*} x data to compare key with
     */
    countGreater(x) {
        return countGreater(x, this.root, 0);
    }

    /**
     * Count number of nodes which key is greater or equal than x
     * @memberof BinaryTree
     * @param {*} x data to compare key with
     */
    countGreaterOrEqual(x) {
        return countGreater(x, this.root, 1);
    }

    /**
     * Count number of nodes which key is inside given range
     * @memberof BinaryTree
     * @param {*} from minimum key in range
     * @param {*} to maximum key in range
     * @param {*} opt (optional) Range options object: { excludeFrom: true, excludeTo: true} (both are false by default) 
     */
    countRange(from, to, opt) {
        var includeLessEqual = false;
        var includeGreaterEqual = false;
        if (opt) {
            if (opt.excludeFrom) {
                includeLessEqual = true;
            }
            if (opt.excludeTo) {
                includeGreaterEqual = true;
            }
        }
        if (this.root === null) {
            return 0;
        } else {
            return this.root.count - countLess(from, this.root, includeLessEqual) - countGreater(to, this.root, includeGreaterEqual);
        }
    }

    toValueArray() {
        var arr = [];
        this.iterate((node) => {
            arr.push(node.value);
        });
        return arr;
    }

    toKeyArray() {
        var arr = [];
        this.iterate((node) => {
            arr.push(node.key);
        });
        return arr;
    }

    toArray() {
        var arr = [];
        this.iterate((node) => {
            arr.push({
                key: node.key,
                value: node.value
            });
        });
        return arr;
    }

    clear() {
        this.root = null;
    }

    ///
    /// Common collection functions
    ///

    filter(predicateFunc) {
        var result = new BinarySearchTree();
        this.iterate((node) => {
            if (predicateFunc(node)) {
                result.put(node.key, node.value);
            }
        });
        return result;
    }

    map(callback) {
        var result = new BinarySearchTree();
        this.iterate((node) => {
            result.put(callback(node));
        });
        return result;
    }

    reduce(callback, init) {
        return this.toArray().reduce(callback, init);
    }

}

module.exports = BinarySearchTree;