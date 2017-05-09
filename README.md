# Fast data structures
Node module with most complete implementation of common data structures: Linked List and Binary Search Tree. (Heap tree in progress...)

## Motivation
JavaScript arrays and objects are generally powerful structures. Arrays can be used to easily emulate Stack or Queue, where queue basic methods (push and pop) are natively present. Object in JavaScript is a collection of properties, where each property name is unique. So this structure is natural hash set. Although for client-side programming this is quite enough, on server-side, much more complex cases can be found. It’s important to always have most efficient algorithm. Two basic data structures are Linked Lists and Binary Search Trees. If implemented using arrays can potentially be very inefficient, especially in case of application scaling, and high workload. Although there are a lot of implementations out there, I wanted to create a feature-rich implementation, with all methods that can be found in .NET or Java, and even more.

## Usage
    npm install fast-data-structures

```js
    const LinkedList = require('fast-data-structures').LinkedList;
    const Bst = require('fast-data-structures').Bst;
```

## Linked List

Linked lists are preferable over arrays if you:
- need to insert-delete elements from begining or middle of the list
- perform large number of insert / delete operations (in constant time, with reference to an element)
- don't need random access to elements

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
    next
    prev

#### LinkedList Properties & Methods:
    | Property / Method         | Time complexity |
    | ------------------------- | ---- |
    | count                     | O(1) |
    | first                     | O(1) |
    | last                      | O(1) |
    | getNewNode(val)           | O(1) |
    | addAfter(node, val)       | O(1) |
    | addBefore(node, val)      | O(1) |
    | addFirst(val)             | O(1) |
    | addLast(val)              | O(1) |
    | removeNode(node)          | O(1) |
    | removeFirst()             | O(1) |
    | removeLast()              | O(1) |
    | findByPosition(pos)       | O(N) |
    | findByValue(val, getLast) | O(N) |
    | iterate(callback)         | O(N) |
    | toArray()                 | O(N) |
    | clear()                   | O(1) |
    | equals(list, comparator)  | O(N) |
    | filter(callback)          | O(N) |
    | map(callback)             | O(N) |
    | reduce(callback, init)    | O(2N) |