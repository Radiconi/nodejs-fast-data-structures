Fast data structures
====================
Node module with most complete implementation of common data structures: Linked List and Binary Search Tree. (Heap tree in rogress...)

Motivation
----------
JavaScript arrays and objects are generally powerful structures. Arrays can be used to easily emulate Stack or Queue, where stack basic methods (push and pop) are natively present. Object in JavaScript is basicly a collection of key-value pairs, where each key (i.e property nme) is unique. So this structure is natural hash table. Although for client-side programming this is quite enough, on server-side, much more complex cases can be found, and it’s important to have most efficient algorithm. Two basic more advanced data structures are Linked Lists and Binary Search Trees. Implementations with arrays can potentially be very inefficient, raising problems in case of application scaling, and high workload. And yes, there are a lot of implementations of these data structures out there, but I wanted to create one feature-rich implementation, with all methods that can be found in .NET or Java, and even more.

Usage
-----
    npm install fast-data-structures

```js
    const LinkedList = require('fast-data-structures').LinkedList;
    const Bst = require('fast-data-structures').Bst;
```

Linked List
-----------
Linked lists are preferable over arrays if you:
- need to insert-delete elements at the beginning or middle of the list
- perform large number of insert / delete operations (in constant time, with reference to an element)
- don't need random access to elements
- want to implement fast queue

Create new empty list object
```js
    const list = new LinkedList();
```

Or create new list from an array:
```js
    const list = new LinkedList([1, 2, 3, 4, 5]);
```

List contains doubly-linked Node objects, which have next properties:

    value
    next - reference to next Node
    prev - reference to previous Node

### LinkedList Properties & Methods:

Property / Method        | Time complexity
------------------------ | ----
count                     | O(1)
first                     | O(1)
last                      | O(1)
getNewNode(val)           | O(1)
addAfter(node, val)       | O(1)
addBefore(node, val)      | O(1)
addFirst(val)             | O(1)
addLast(val)              | O(1)
removeNode(node)          | O(1)
removeFirst()             | O(1)
removeLast()              | O(1)
findByValue(val, getLast) | O(N)
iterate(callback)         | O(N)
toArray()                 | O(N)
clear()                   | O(1)
equals(list, comparator)  | O(N)
filter(callback)          | O(N)
map(callback)             | O(N)
reduce(callback, init)    | O(N)

Binary Search Tree
------------------
Binary search tree represents an important data structucture when it comes to more complex work with sorted data, and fast search for specific elements in a collection. Fast and easy alternative to BST are Hash Sets ('Set' objects in ES6) or Hash Tables, which in JavaScript can be represented by Object or Map (ES6). Hash structures provide fast (O(1)) access to an element by its key. But any kind of additional logic over element keys (e.g get minimum or maximum) leads to O(N) complexity. Also sorted array can be used instead of BST, but in case of frequent add/remove, preserving array to be sorted can be expensive.
Therefore __Balanced__ BST is competetive data structure if you want to:
- Work with an dynamic sorted collection
- Perform sorted traversal
- Count number of elements less or greater than a value, or inside range
- Traverse elements less or greater than a value, or inside range
- Find next closest element
- Find minimum or maximum

This BST is realized implementing **Red-Black algorithm** to maintain tree balance for optimum time complexity.

### Object creation
You can create new BST object in several different ways:

- Create new empty tree object
```js
    const tree = new Bst();
```

- From simple array; key and value will be the same here:
```js
    const tree = new Bst([1, 2, 3, 4, 5]);
```

- From array of objects with key/value properties:
```js
    const tree = new Bst([{ key: 'a', value: 1 }, { key: 'b', value: 2 }, { key: 'c', value: 3} ]);
```

- From aray of objects with specified key predicate; whole object will be node value:
```js
    let bstConstruct = {
        data: [
            { name: 'John', position: 'developer' }, 
            { name: 'Anna', position: 'manager' }
        ],
        keyPredicate: el => el.name
    };
    const tree = new Bst(bstConstruct);
```

Bst can also b constructed with compareFunc attribute provided, which will be used as comparator function. This function should take two objects as arguments (a, b) and returns: -1 when a < b, 0 when a === b and 1 when a > b. It's used in case of complex keys which cannot be compared using built-in operators (<, ===, >). For performance reason, always consider generating keyswhich can be compared using regular {operators. 
```js
    const tree = new Bst([], (el1, el2) => {
        return el1.key.last > el2.key.last ? 1 : (el1.key.last < el2.key.last ? - 1 : el1.key.first > el2.key.first ? 1 : (el1.key.first < el2.key.first ? -1 : 0);
    });
```

### BST Node objects
Bst contains Node objects, which have next properties:

    key
    value
    left - reference to left child
    right - reference to right child
    count - number of elements in subtree (including itself)

### BST Properties & Methods:

Property / Method        | Time complexity
------------------------ | ----
put(key, val)             | O(log(N))
delete(key)               | O(log(N))
getValue(key)             | O(log(N))
min()                     | O(log(N))
max()                     | O(log(N))
floor(x)                  | O(log(N))
ceiling(x)                | O(log(N))
iterate(callback, traversalType)        | O(N)
iterateRange(from, to, callback, opt)   | O(N)
countLess(x)              | O(log(N))
countLessOrEqual(x)       | O(log(N))
countGreater(x)           | O(log(N))
countGreaterOrEqual(x)    | O(log(N))
countRange(from, to, opt) | O(log(N))
toValueArray()            | O(N)
toKeyArray()              | O(N)
toArray()                 | O(N)
clear()                   | O(1)
filter(predicateFunc)     | O(N)
map(callback)             | O(N)
reduce(callback, init)    | O(N)

