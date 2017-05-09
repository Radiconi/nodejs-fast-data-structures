var assert = require('chai').assert;
var LinkedList = require('../lib/linked-list');

describe('Linked list', () => {

    describe('Construction', () => {

        it('should construct empty list', () => {
            let list = new LinkedList();
            assert.isOk(list);
            assert.isNull(list.first);
            assert.isNull(list.last);
            assert.strictEqual(0, list.count, 'is count 0');

        });

        it('should construct non-empty list, if argument is array', () => {
            let list = new LinkedList([1, 2, 3]);
            assert.isOk(list, 'list object exist');
            assert.isNotNull(list.first, 'first node not null');
            assert.isNotNull(list.first, 'last node not null');
            assert.strictEqual(3, list.count);
            assert.strictEqual(1, list.first.value);
            assert.strictEqual(2, list.first.next.value);
            assert.strictEqual(3, list.first.next.next.value);
        });

        it('should construct empty list, if argument is not array', () => {
            let list = new LinkedList('str');
            assert.isOk(list);
            assert.isNull(list.first);
            assert.isNull(list.last);
            assert.strictEqual(0, list.count, 'is count 0');
        });
    });


    describe('Basic manipulation - add remove first / last', () => {

        let list = new LinkedList();

        it('should add nodes first to last', () => {
            list.addLast(1);
            list.addLast(2);
            list.addLast(3);
            assert.deepEqual(list.toArray(), [1, 2, 3]);
            assert.strictEqual(1, list.first.value);
            assert.strictEqual(3, list.last.value);
        });

        it('should add nodes last to first', () => {
            list.clear();
            list.addFirst(1);
            list.addFirst(2);
            list.addFirst(3);
            assert.deepEqual(list.toArray(), [3, 2, 1]);
            assert.strictEqual(3, list.first.value);
            assert.strictEqual(1, list.last.value);
        });

        it('should remove first and last node', () => {
            list.clear();
            list.addLast(1);
            list.addLast(2);
            list.addLast(3);
            list.addLast(4);
            list.removeFirst();
            assert.strictEqual(2, list.first.value);
            assert.strictEqual(3, list.count);
            list.removeLast();
            assert.strictEqual(3, list.last.value);
            assert.strictEqual(2, list.count);
        });

        it('should return empty list when remove single node list', () => {
            list.clear();
            list.addLast(1);
            list.removeFirst();
            assert.isNull(list.first);
            assert.isNull(list.last);
            assert.strictEqual(0, list.count);
            list.clear();
            list.addLast(1);
            list.removeLast();
            assert.isNull(list.first);
            assert.isNull(list.last);
            assert.strictEqual(0, list.count);
        });

        it('should just return empty list when try to remove from empty list', () => {
            list.clear();
            list.removeFirst();
            assert.isNull(list.first);
            assert.isNull(list.last);
            assert.strictEqual(0, list.count);
            list.removeLast();
            assert.isNull(list.first);
            assert.isNull(list.last);
            assert.strictEqual(0, list.count);
        });

    });


    describe('Check adding before or after a node', () => {

        let list = new LinkedList([1, 3, 5, 7]);

        it('should add nodes before and after given nodes', () => {
            let node = list.first.next;
            list.addAfter(node, 4);
            list.addBefore(node, 2);
            node = node.next.next; // 4
            list.addAfter(node, 6);
            node = list.last;
            list.addAfter(node, 8);
            node = list.first;
            list.addBefore(node, 0);
            assert.deepEqual([0, 1, 2, 3, 4, 5, 6, 7, 8], list.toArray());
            assert.equal(9, list.count);
            assert.equal(0, list.first.value);
            assert.equal(8, list.last.value);
        });

        it('should return unchanged list if try to add after null or irregular object', () => {

            assert.isOk(list.addAfter(null, 10));
            assert.isOk(list.addBefore(null, 10));
            assert.isOk(list.addAfter({}, 10));
            assert.isOk(list.addBefore({}, 10));
            assert.equal(9, list.count);

        });

    });

    describe('Check find nodes and iterate list', () => {

        let list = new LinkedList([0, 1, 2, 3, 4, 5]);

        it('should find nodes on given position', () => {
            assert.equal(0, list.findByPosition(0).value);
            assert.equal(2, list.findByPosition(2).value);
            assert.equal(5, list.findByPosition(5).value);
            assert.equal(null, list.findByPosition(6));
            assert.equal(null, list.findByPosition(-1));
            assert.equal(null, list.findByPosition());
            assert.equal(null, list.findByPosition(undefined));
        });

        it('should find nodes by value', () => {
            assert.equal(0, list.findByValue(0).value);
            assert.equal(2, list.findByValue(2).value);
            assert.equal(5, list.findByValue(5).value);
            assert.equal(null, list.findByValue(6));
            assert.equal(null, list.findByValue(-1));
            assert.equal(null, list.findByValue());
            assert.equal(null, list.findByValue(undefined));
        });

        it('should find first or last occurence, depending on getLast attribute', () => {
            list.addLast(0);
            list.addLast(0);
            assert.equal(list.first, list.findByValue(0));
            assert.equal(list.first, list.findByValue(0, false));
            assert.equal(list.last, list.findByValue(0, true));
        });

        it('should iterate from first to last node', () => {
            list = new LinkedList([1, 2, 3, 4, 5, 6, 7]);
            let arr1 = [];
            let arr2 = [];
            list.iterate((val, node) => {
                arr1.push(val);
                arr2.push(node.value);
            });
            assert.deepEqual(list.toArray(), arr1);
            assert.deepEqual(list.toArray(), arr2);
        });

    });

    describe('List comparison functions', () => {

        let list1 = new LinkedList([1, 2, 3]);
        let list2 = new LinkedList([1, 2, 3]);

        it('should return that two lists with same values are equal', () => {
            assert.isTrue(list1.equals(list2));
        });

        it('should return that two empty lists are equal', () => {
            assert.isTrue((new LinkedList()).equals(new LinkedList()));
        });

        it('should return that empty list is not equal to null', () => {
            assert.isFalse((new LinkedList()).equals(null));
        });

        it('should return that two lists with different values are not equal', () => {
            list2.addLast(4);
            assert.isFalse(list1.equals(list2));
            assert.isFalse(list2.equals(list1));
        });

        it('should correctly compare lists with mixed primitive values', () => {
            list1.clear();
            list2.clear();
            list1.addFirst(true);
            list1.addFirst(false);
            list1.addFirst(10);
            list1.addFirst('text');
            list1.addFirst(12.123);
            list1.addFirst(null);
            list1.addFirst(undefined);
            list2.addFirst(true);
            list2.addFirst(false);
            list2.addFirst(10);
            list2.addFirst('text');
            list2.addFirst(12.123);
            list2.addFirst(null);
            list2.addFirst(undefined);
            assert.isTrue(list1.equals(list2));
            list2.removeFirst();
            assert.isFalse(list1.equals(list2));
        });

        it('should return false when comparing lists with non-primitive values', () => {
            list1.clear();
            list2.clear();
            list1.addFirst({ prop: 1 });
            list2.addFirst({ prop: 1 });
            assert.isFalse(list1.equals(list2));
        });

        it('should return true when comparing same lists with non-primitive values, with comparator provided', () => {
            list1.clear();
            list2.clear();
            list1.addFirst({ prop: 1 });
            list2.addFirst({ prop: 1 });
            assert.isTrue(list1.equals(list2, function(e1, e2) {
                return e1.prop === e2.prop;
            }));
        });

    });

    describe('Filter, map reduce', () => {
        const list = new LinkedList([1, 2, 3, 4, 5, 6]);

        it('should filter by callback', () => {
            assert.deepEqual([2, 4, 6], list.filter((val) => val % 2 === 0).toArray());
        });

        it('should map by callback', () => {
            assert.deepEqual([2, 3, 4, 5, 6, 7], list.map((val) => {
                return val + 1;
            }).toArray());
        });

        it('should reduce by callback', () => {
            assert.strictEqual(22,
                list.reduce((aggr, next) => {
                    return aggr + next;
                }, 1));
        });

    });

});