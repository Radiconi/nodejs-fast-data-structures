# Fast data structures
Node module with most complete implementation of common data structures: Linked List and Binary Search Tree. (Heap tree in progress...)

## Motivation
JavaScript arrays and objects are generally powerful structures. Arrays can be used to easily emulate Stack or Queue, where queue basic methods (push and pop) are nativelly present. Object in JavaScript is a colloction of properties, where each property name is unique. So this structure is natural hash set. Although for client-side programming this is quite enough, on server-side, much more complex cases can be found. Its important to always have most efficient algorithm.
Two basic data structures are Linked Lists and Binary Search Trees. If implemented using arrays can potentially be very inefective, specially in case of application scaling, and high workload.
Although there are a lot of implentations out there, I wanted to create a feature-rich implentation, with all methods that can be found in .NET or Java implementations, and even more.

## Usage
    npm install fast-data-structures

'''js

    const LinkedList = require('fast-data-structures').LinkedList;
    const Bst = require('fast-data-structures').Bst;

'''

## Linked List

Linked lists are preferable over arrays if you:
- need to insert-delete elements from begining or middle of the list
- perform large number of insert / delete operations (in constant time, with reference to an element)
- don't need random access to elements

Create new empty list object
'''js
    const list = new LinkedList();
'''

Or create new list from an array:
'''js
    const list = new LinkedList([1, 2, 3, 4, 5]);
'''

List contains Node objects, which have next properties:
- value
- next
- prev

### LinkedList Properties & Methods
    count
    first
    last

    getNewNode(val)
    
    addAfter(node, val)
    addBefore(node, val)
    addFirst(val)
    addLast(val)

    removeNode(node) 
    removeFirst()
    removeLast()
    
    findByPosition(pos)
    findByValue(val, getLast)

    iterate(callback)
    toArray() {
    clear()
    equals(list, comparator)

    filter(callback)
    map(callback)
    reduce(callback, init)