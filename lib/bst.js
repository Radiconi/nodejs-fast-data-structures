/*!
 * data-structures
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
        this.count = 1;
        this.isRed = true;
    }

}

class BinarySearchTree {

    /**
     * BinarySearchTree constructor
     */
    constructor(constructorData, compareIsLessFunc) {
        this.root = null;
        if (compareIsLessFunc !== undefined) {
            this.compareIsLess = compareIsLessFunc;
        } else {
            this.compareIsLess = function(a, b) {
                return a < b;
            }
        }
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
                    let key = constructorData.keyLambda ? constructorData.keyPredicate(arr[i]) : arr[i];
                    this.put(key, arr[i]);
                }
            }
        }
    }

    _isRed(node) {
        return node ? node.isRed : false;
    }

    _count(node) {
        return node ? node.count : 0;
    }

    _recalculateCount(node) {
        node.count = this._count(node.left) + this._count(node.right) + 1;
    }

    _rotateLeft(node) {
        /*
            Orient temporary right red link to left red link

            5                7
           / \Red        Red/ \ 
          3   7    =>      5   8
             / \          / \
            6   8        3   6
        */
        // Rotation allowed only if right subnode is red
        if (node === null) return;
        if (!this._isRed(node.right)) return;
        var rootCount = node.count;
        var newRoot = node.right; // 7
        node.right = newRoot.left; // 6
        this._recalculateCount(node);
        newRoot.left = node; // 5
        newRoot.isRed = node.isRed;
        newRoot.count = rootCount;
        node.isRed = true;
        return newRoot;

    }

    _rotateRight(node) {
        /*
            Orient left red link to temporary right red link
            
            5                7
           / \Red        Red/ \ 
          3   7    <=      5   8
             / \          / \
            6   8        3   6
        */
        // Rotation allowed only if left subnode is red
        if (node === null) return;
        if (!this._isRed(node.left)) return;
        var rootCount = node.count;
        var newRoot = node.left; // 5
        node.left = newRoot.right; // 6
        this._recalculateCount(node);
        newRoot.right = node; // 5
        newRoot.isRed = node.isRed;
        newRoot.count = rootCount;
        node.isRed = true;
        return newRoot;
    }

    _flipColors(node) {
        if (node === null) return;
        if (!this._isRed(node.left) || !this._isRed(node.right)) return;
        node.right.isRed = false;
        node.left.isRed = false;
        node.isRed = true;
        return node;
    }

    _put(node, key, val) {
        if (node === null) {
            return new Node(key, val);
        } else if (node.key === key) {
            node.value = val;
        } else if (this.compareIsLess(key, node.key)) {
            if (node.left === null) {
                node.left = new Node(key, val);
            } else {
                node.left = this._put(node.left, key, val);
            }
        } else {
            if (node.right === null) {
                node.right = new Node(key, val);
            } else {
                node.right = this._put(node.right, key, val);
            }
        }
        node.count = (node.left ? node.left.count : 0) + (node.right ? node.right.count : 0) + 1;

        // Red-black balance algorithm
        if (node) {
            // lean left
            if (this._isRed(node.right) && !this._isRed(node.left)) {
                node = this._rotateLeft(node);
            }
            // balance 4-node
            if (this.left !== null) {
                if (this._isRed(node.left) && this._isRed(node.left.left)) {
                    this._rotateRight(node);
                }
            }
            // split 4-node
            if (this._isRed(node.left) && this._isRed(node.right)) {
                node = this._flipColors(node);
            }
        }
        return node;
    }

    /**
     * Put key-value pair into tree
     * @memberof BinarySearchTree
     * @param {*} key Comparable key value. Tree is sorted by this value
     * @param {*} val Value
     * @returns {BinarySearchTree} Returns reference to this BinarySearchTree object
     */
    put(key, val) {
        this.root = this._put(this.root, key, val);
        this.root.isRed = false;
        return this;
    }

    _findNode(key) {
        var node = this.root;
        while (node !== null) {
            if (node.key === key) {
                return node;
            }
            if (this.compareIsLess(this.comparekey, node.key)) {
                node = node.left;
            } else {
                node = node.right;
            }
        }
        return null;
    }

    /**
     * Get value by key
     * @memberof BinarySearchTree
     * @param {*} key Key
     * @returns {*} Returns node value. If node with given key does not exist, returns null.
     */
    getValue(key) {
        var node = this._findNode(key);
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
        // Leftmost node
        var node = this.root;
        if (node === null) {
            return null;
        }
        while (node.left !== null) {
            node = node.left;
        }
        return node.value;
    }

    /**
     * Get maximum key value
     * @memberof BinarySearchTree
     * @returns {*} Returns value of node with maximum key. If tree is empty returns null.
     */
    max() {
        // Rightmost node
        var node = this.root;
        if (node === null) {
            return null;
        }
        while (node.right !== null) {
            node = node.right;
        }
        return node.value;
    }

    _floorNode(x, node) {
        if (node === null) {
            return null;
        } else if (node.key === x) {
            return node;
        } else if (node.key < x) {
            let rightFloor = this._floorNode(x, node.right);
            return rightFloor ? rightFloor : node;
        } else {
            return this._floorNode(x, node.left);
        }
    }

    /**
     * Get value of floor node. Floor node is node with the highest key which is less or equal than x.
     * @memberof BinarySearchTree
     * @param {*} x data to compare key with
     * @returns {*} Returns value of floor node. If tree is empty, of there is no floor under x, returns null.
     */
    floor(x) {
        var node = this.root;
        var floorNode = this._floorNode(x, node);
        return floorNode ? floorNode.key : null;
    }

    _ceilingNode(x, node) {
        if (node === null) {
            return null;
        } else if (node.key === x) {
            return node;
        } else if (node.key > x) {
            let leftCeiling = this._ceilingNode(x, node.left);
            return leftCeiling ? leftCeiling : node;
        } else {
            return this._ceilingNode(x, node.right);
        }
    }

    /**
     * Get value of ceiling node. Ceiling node is node with the lowest key which is greater or equal than x.
     * @memberof BinarySearchTree
     * @param {*} x data to compare key with
     * @returns {*} Returns value of ceiling node. If tree is empty, of there is no ceiling above x, returns null.
     */
    ceiling(x) {
        var node = this.root;
        var ceilingNode = this._ceilingNode(x, node);
        return ceilingNode ? ceilingNode.key : null;
    }

    /**
     * Delete node with given key
     * @memberof BinarySearchTree
     * @param {*} key Node key
     * @returns {BinarySearchTree} Returns reference to this BinarySearchTree object
     */
    delete(key) {
        var node = this._findNode(key);
        return this;
    }

    _inOrderTraversal(node, callback) {
        if (node !== null) {
            this._inOrderTraversal(node.left, callback);
            callback(node);
            this._inOrderTraversal(node.right, callback);
        }
    }

    /**
     * Iterate through all nodes in the three
     * @memberof BinarySearchTree
     * @param {function} callback Function to be run for every node. Whole node is provided as argument. 
     * @returns {BinarySearchTree} Returns reference to this BinarySearchTree object
     */
    iterate(callback) {
        var node = this.root;
        this._inOrderTraversal(node, callback);
        return this;
    }

    _traversalRange(fromFunc, toFunc, node, callback) {
        if (node !== null) {
            if (fromFunc(node.key)) {
                // If key is bigger than min, it's possible to have more nodes in range on the left side
                this._traversalRange(fromFunc, toFunc, node.left, callback);
            }
            if (fromFunc(node.key) && toFunc(node.key)) {
                // If node.key is in range 'callback' it
                callback(node);
            }
            if (toFunc(node.key)) {
                // If key is less than max, it's possible to have more nodes in range on the right side
                this._traversalRange(fromFunc, toFunc, node.right, callback);
            }
        }
    }

    /**
     * Iterate through all nodes in the three, which keys are in range defined by from and to functions
     * @memberof BinaryTree
     * @param {function} fromFunc Lambda function to define range start. Example: "key => key > 1"
     * @param {function} toFunc Lambda function to define range end. Example: "key => key <= 10"
     * @returns {BinarySearchTree} Returns reference to this BinarySearchTree object
     */
    iterateRange(fromFunc, toFunc, callback) {
        var node = this.root;
        this._traversalRange(fromFunc, toFunc, node, callback);
        return this;
    }

    _findRangeRoot(from, to) {
        var node = this.root;
        while (node !== null) {
            if (from <= node.key && node.key <= to) {
                return node;
            }
            if (to <= node.key) {
                node = node.left;
            } else if (from >= node.key) {
                node = node.right;
            } else {
                return null;
            }
        }
        return null;
    }

    _countLess(x, node, includeEqual) {
        if (node === null) {
            return 0;
        } else if (node.key === x) {
            return (node.left ? node.left.count : 0) + includeEqual;
        } else if (node.key < x) {
            return (node.left ? node.left.count + 1 : 1) + this._countLess(x, node.right, includeEqual);
        } else {
            return this._countLess(x, node.left, includeEqual);
        }
    }

    /**
     * Count number of nodes which key is less than x
     * @memberof BinaryTree
     * @param {*} x data to compare key with
     */
    countLess(x) {
        return this._countLess(x, this.root, 0);
    }

    /**
     * Count number of nodes which key is less or equal than x
     * @memberof BinaryTree
     * @param {*} x data to compare key with
     */
    countLessOrEqual(x) {
        return this._countLess(x, this.root, 1);
    }

    _countGreater(x, node, includeEqual) {
        if (node === null) {
            return 0;
        } else if (node.key === x) {
            return (node.right ? node.right.count : 0) + includeEqual;
        } else if (node.key > x) {
            return (node.right ? node.right.count + 1 : 1) + this._countGreater(x, node.left, includeEqual);
        } else {
            return this._countGreater(x, node.right, includeEqual);
        }
    }

    /**
     * Count number of nodes which key is greater than x
     * @memberof BinaryTree
     * @param {*} x data to compare key with
     */
    countGreater(x) {
        return this._countGreater(x, this.root, 0);
    }

    /**
     * Count number of nodes which key is greater or equal than x
     * @memberof BinaryTree
     * @param {*} x data to compare key with
     */
    countGreaterOrEqual(x) {
        return this._countGreater(x, this.root, 1);
    }

    /**
     * Count number of nodes which key is inside given range
     * @memberof BinaryTree
     * @param {*} from minimum key in range
     * @param {*} to maximum key in range
     * @param {boolean} excludeFrom (optional) exclude node with key = 'from' from count
     * @param {boolean} excludeTo (optional) exclude node with key = 'to' from count
     */
    countRange(from, to, excludeFrom, excludeTo) {
        var includeLessEqual = excludeFrom ? 1 : 0;
        var includeGreaterEqual = excludeTo ? 1 : 0;
        if (this.root === null) {
            return 0;
        } else {
            return this.root.count - this._countLess(from, this.root, includeLessEqual) - this._countGreater(to, this.root, includeGreaterEqual);
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
            arr.push({ key: node.key, value: node.value });
        });
        return arr;
    }

    /// Common collection functions

    filter(callback) {
        return new BinarySearchTree(this.toArray().filter(callback));
    }

    map(callback) {
        return new BinarySearchTree(this.toArray().map(callback));
    }

    reduce(callback, init) {
        return this.toArray().reduce(callback, init);
    }

}

module.exports = BinarySearchTree;
