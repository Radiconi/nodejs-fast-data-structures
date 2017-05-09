/*!
 * data-structures
 * Copyright(c) 2017 Predrag Radic
 * MIT Licensed
 */

'use strict';

class Node {
    constructor(val) {
        this.next = null;
        this.prev = null;
        this.value = val;
    }
}

class LinkedList {

    /**
     * LinkedList constructor
     * @param {Array} arr If an array is provided, linked list will contain array elements. Zero element in the array will be first element in the list.
     */
    constructor(arr) {
        this._first = null;
        this._last = null;
        this._count = 0;
        if (arr && Array.isArray(arr)) {
            for (let i = arr.length - 1; i >= 0; i--) {
                this.addFirst(arr[i]);
            }
        }
    }

    /**
     * Get number of elements in the list
     */
    get count() {
        return this._count;
    }

    /**
     * Get first element. If list is empty, returns null.
     */
    get first() {
        return this._first;
    }

    /**
     * Get last element. If list is empty, returns null.
     */
    get last() {
        return this._last;
    }

    /**
     * Generates new alone Node object, with given value, without any reference (prev or next).
     */
    getNewNode(val) {
        return new Node(val);
    }

    /**
     * Add new node with value val after specified node.
     * @memberof LinkedList
     * @param {Node} node Reference node
     * @param {*} val Value of new node
     * @returns {LinkedList} Returns reference to this LinkedList object
     */
    addAfter(node, val) {
        if (node instanceof(Node)) {
            // If val is instance of node, use reference to that node
            var newNode = val instanceof Node ? val : this.getNewNode(val);
            newNode.next = node.next;
            newNode.prev = node;
            node.next = newNode;
            if (newNode.next) {
                newNode.next.prev = newNode;
            } else {
                // new node is last
                this._last = newNode;
            }
            this._count++;
        }
        return this;
    }

    /**
     * Add new node with value val before specified node.
     * @memberof LinkedList
     * @param {Node} node Reference node
     * @param {*} val Value of new node
     * @returns {LinkedList} Returns reference to this LinkedList object
     */
    addBefore(node, val) {
        if (node instanceof(Node)) {
            var newNode = this.getNewNode(val);
            newNode.next = node;
            newNode.prev = node.prev;
            node.prev = newNode;
            if (newNode.prev) {
                newNode.prev.next = newNode;
            } else {
                // new node is first
                this._first = newNode;
            }
            this._count++;
        }
        return this;
    }

    /**
     * Add new node with value val to the beginning of the list.
     * @memberof LinkedList
     * @param {*} val Value of new node
     * @returns {LinkedList} Returns reference to this LinkedList object
     */
    addFirst(val) {
        var newNode = this.getNewNode(val);
        if (this._first) {
            this._first.prev = newNode;
            newNode.next = this._first;
        } else {
            this._last = newNode;
        }
        this._first = newNode;
        this._count++;
        return this;
    }

    /**
     * Add new node with value val to the end of the list.
     * @memberof LinkedList
     * @param {*} val Value of new node
     * @returns {LinkedList} Returns reference to this LinkedList object
     */
    addLast(val) {
        var newNode = this.getNewNode(val);
        if (this._last) {
            this._last.next = newNode;
            newNode.prev = this._last;
        } else {
            this._first = newNode;
        }
        this._last = newNode;
        this._count++;
        return this;
    }

    /**
     * Remove node from list
     * @memberof LinkedList
     * @param {Node} node Reference to node to be removed
     * @returns {Node} {LinkedList} Returns reference to this LinkedList object
     */
    removeNode(node) {
        if (!node && !(node instanceof(Node))) {
            return this;
        }
        var prev = node.prev;
        var next = node.next;
        if (prev) {
            prev.next = next;
        } else {
            // removed node is first. Update this.first
            this._first = node.next;
            if (this._first) {
                this._first.prev = null;
            }
        }
        if (next) {
            next.prev = prev;
        } else {
            // removed node is last. Update this.last
            this._last = node.prev;
            if (this._last) {
                this._last.next = null;
            }
        }
        this._count--;
        return this;
    }

    /**
     * Remove node from the beginning of the list.
     * @memberof LinkedList
     * @returns {LinkedList} Returns reference to this LinkedList object
     */
    removeFirst() {
        this.removeNode(this._first);
        return this;
    }


    /**
     * Remove node from the end of the list.
     * @memberof LinkedList
     * @returns {LinkedList} Returns reference to this LinkedList object
     */
    removeLast() {
        this.removeNode(this._last);
        return this;
    }

    /**
     * Get node from given position
     * @memberof LinkedList
     * @param {number} pos Zero-indexed position of node
     * @returns {Node} Returns reference to given node. If position is invalid, returns null.
     */
    findByPosition(pos) {
        if (pos == null) {
            return null;
        }
        if (pos >= this._count || pos < 0) {
            return null;
        }
        var node = this._first;
        if (pos === 0) return node;

        for (let i = 0; i < pos; i++) {
            if (node === null) {
                break;
            }
            node = node.next;
        }
        return node;
    }

    /**
     * Get node with given value
     * @memberof LinkedList
     * @param {*} val Value to be found in list
     * @param {boolean} getLast If set to true, returns last occurence of given val; otherwise returns first occurence.
     * @returns {Node} Returns reference to given node. If no node is found, returns null.
     */
    findByValue(val, getLast) {
        var getLast = getLast || false;
        var resultNode = null;
        var node = this._first;
        while (node !== null) {
            if (val === node.value) {
                resultNode = node;
                if (!getLast) {
                    break;
                }
            }
            node = node.next;
        }
        return resultNode;
    }


    /**
     * Iterate through all elements in the list
     * @memberof LinkedList
     * @param {function} callback(value, node) Callback function
     * @returns {LinkedList} Returns reference to this LinkedList object
     */
    iterate(callback) {
        var node = this._first;
        while (node !== null) {
            callback(node.value, node);
            node = node.next;
        }
        return this;
    }

    /**
     * Returns list elements as array
     * @memberof LinkedList
     * @returns {Array} Returns list elements as array
     */
    toArray() {
        var arr = [];
        this.iterate((el) => {
            arr.push(el);
        })
        return arr;
    }

    /**
     * Clear list
     * @memberof LinkedList
     * @returns {LinkedList} Returns reference to this LinkedList object
     */
    clear() {
        this._count = 0;
        this._first = null;
        this._last = null;
        // No inner references to nodes... Will be garbage collected, if no external elements.
    }

    /**
     * Check equality of two LinkedLists, based on number of elements, and values of each element. 
     * Values are compared using strict equality, so only primitive values comparation will return valid result.
     * If values are non primitive types (functions, objects, arrays), this method will return false
     * If comparator function is provided, it will be used to compare values
     * @memberof LinkedList
     * @param {list} LinkedList object to be compared with
     * @param {comparator} function function which takes two elements and returns true if these are the same, or false if not
     * @returns {boolean} Returns result of comparation
     */
    equals(list, comparator) {
        if (!list) {
            return false;
        }
        if (!list instanceof LinkedList) {
            return false;
        }
        if (this._count !== list.count) {
            return false;
        }
        var n1 = this._first;
        var n2 = list.first;
        while (n1 !== null && n2 !== null) {
            if (comparator) {
                if (!comparator(n1.value, n2.value)) {
                    return false;
                }
            } else {
                if (n1.value !== n2.value) {
                    return false;
                }
            }
            n1 = n1.next;
            n2 = n2.next;
        }
        if (n1 !== null && n2 !== null) {
            return false;
        }
        return true;
    }

    /// Common collection functions

    filter(callback) {
        return new LinkedList(this.toArray().filter(callback));
    }

    map(callback) {
        return new LinkedList(this.toArray().map(callback));
    }

    reduce(callback, init) {
        return this.toArray().reduce(callback, init);
    }

}

module.exports = LinkedList;