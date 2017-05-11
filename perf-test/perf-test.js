const LinkedList = require('../lib/linked-list');

function runTestCase(testCase) {
    let data = testCase.init();
    let response = { totalTime: 0, runs: [] };
    let t0 = process.hrtime();
    let i = 1;
    while (i < 10) {
        let n = Math.pow(10, i);
        let t1 = process.hrtime();
        if (testCase.elementFunc !== null) {
            for (let k = 1; k <= n; k++) {
                // 1st run: 10 elements, 2nd run 100 elements, 3rd run: 1000 elelements, ... up to 10 pow N.
                testCase.elementFunc(data, k, n);
            }
        }
        if (testCase.countElement === false) {
            t1 = process.hrtime();
        }
        if (testCase.runFunc !== null) {
            testCase.runFunc(data, n);
        }
        let delta1 = process.hrtime(t1);
        let timens = delta1[0] * 1e9 + delta1[1];
        response.runs.push({ testRun: i, time_ns: delta1[0] * 1e9 + delta1[1], n: n, timeToN: Math.round(timens / n) });
        if (timens > 100000000) break;
        i++;
    }
    let delta0 = process.hrtime(t0);
    response.totalTime = delta0[0] * 1e9 + delta0[1];
    console.log(testCase.name);
    console.log(response);
    console.log(' ');
    return response;
}

function compareAlgorithms(testCase1, testCase2) {
    var response1 = runTestCase(testCase1);
    var response2 = runTestCase(testCase2);
    var result = [];
    var n = Math.min(response1.runs.length, response2.runs.length);
    for (let i = 0; i < n; i++) {
        let t1 = response1.runs[i].time_ns;
        let t2 = response2.runs[i].time_ns;
        result.push({ n: response1.runs[i].n, timeRatio: Math.round((t2 - t1) / t1 * 100) + ' %' });
    }
    console.log(testCase1.name + ' to ' + testCase2.name + ' execution time: (Higher percentage is better for ' + testCase1.name + ')');
    console.log(result);
    console.log(' ');
    return result;
}

/**
 * Test 1.
 * Simulate Queue with LinkedList and Array
 * Enqueue two and dequeue one element in every run
 */

var testCase1 = {
    name: 'Linked List',
    init: function() {
        return { list: new LinkedList() }
    },
    elementFunc: function(data, k, n) {
        data.list.addFirst({ prop1: 'prop1', prop2: 'prop2', prop3: 10000000, prop4: true, prop5: k });
        data.list.addLast({ prop1: 'prop1', prop2: 'prop2', prop3: 10000000, prop4: true, prop5: k });
        data.list.removeFirst();
    },
    runFunc: function(data, n) {
        for (let i = 0; i <= n; i++) {
            data.list.removeFirst();
        }
    }
};

var testCase2 = {
    name: 'Array',
    init: function() { return { arr: new Array() } },
    elementFunc: function(data, k, n) {
        data.arr.unshift({ prop1: 'prop1', prop2: 'prop2', prop3: 10000000, prop4: true, prop5: k });
        data.arr.push({ prop1: 'prop1', prop2: 'prop2', prop3: 10000000, prop4: true, prop5: k });
        data.arr.shift();
    },
    runFunc: function(data, n) {
        for (let i = 0; i <= n; i++) {
            data.arr.shift();
        }
    }
};

compareAlgorithms(testCase1, testCase2);

/**
 * Test 2.
 * Remove element in middle of the list
 * Add new element at its position
 */

var testCase1 = {

    name: 'Linked list',

    init: function() {
        let list = new LinkedList();
        for (let i = 1; i <= 10000; i++) {
            list.addFirst({ firstName: 'Predrag', lastName: 'Radic', isHappy: true, count: i });
        }
        return {
            list: list,
            ref: list.findByPosition(5000)
        };
    },

    test: function(data, k, n) {
        let list = data.list;
        let ref = data.ref;
        list.removeNode(ref.next);
        list.addAfter(ref, { firstName: 'Predrag', lastName: 'Radic', isHappy: true, count: k })
    }
}

var testCase2 = {

    name: 'Array',

    init: function() {
        let arr = new Array(10000);
        for (let i = 1; i <= 10000; i++) {
            arr.push({ firstName: 'Predrag', lastName: 'Radic', isHappy: true, count: i });
        }
        return {
            arr: arr
        };
    },

    test: function(data, k, n) {
        let arr = data.arr;
        arr.splice(5000, 1, { firstName: 'Predrag', lastName: 'Radic', isHappy: true, count: k });
    }
}

compareAlgorithms(testCase1, testCase2);