const tree = (val, left = null, right = null) => ({ val, left, right });

const createChallenge = (challenge) => challenge;

const CHALLENGES = [
  createChallenge({
    day: 1,
    title: 'Two Sum Sprint',
    topic: 'Hash Map',
    difficulty: 'easy',
    xpReward: 30,
    functionName: 'twoSumIndices',
    description: 'Return the indices of the two numbers that add up to the target. Assume exactly one answer exists.',
    signature: 'function twoSumIndices(nums, target) {',
    starterCode: `function twoSumIndices(nums, target) {
  // return the indices of the two numbers that add up to target
}
`,
    hints: [
      'Store numbers you have seen in a map from value to index.',
      'When you see a number, check whether target - number already exists.',
    ],
    testCases: [
      { description: 'Basic pair', args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { description: 'Middle pair', args: [[3, 2, 4], 6], expected: [1, 2] },
    ],
  }),
  createChallenge({
    day: 2,
    title: 'Valid Parentheses',
    topic: 'Stack',
    difficulty: 'easy',
    xpReward: 30,
    functionName: 'isValidParentheses',
    description: 'Return true when every opening bracket has a matching closing bracket in the correct order.',
    signature: 'function isValidParentheses(str) {',
    starterCode: `function isValidParentheses(str) {
  // use a stack to match brackets
}
`,
    hints: ['Push opening brackets onto a stack.', 'Pop and compare when you see a closing bracket.'],
    testCases: [
      { description: 'Balanced brackets', args: ['()[]{}'], expected: true },
      { description: 'Invalid order', args: ['(]'], expected: false },
    ],
  }),
  createChallenge({
    day: 3,
    title: 'Reverse a String',
    topic: 'Two Pointers',
    difficulty: 'easy',
    xpReward: 30,
    functionName: 'reverseString',
    description: 'Return the input string written backwards.',
    signature: 'function reverseString(str) {',
    starterCode: `function reverseString(str) {
  // reverse the string
}
`,
    hints: ['Split the string into characters.', 'Use two pointers or the built-in reverse pattern.'],
    testCases: [
      { description: 'Simple word', args: ['hello'], expected: 'olleh' },
      { description: 'Longer word', args: ['codequest'], expected: 'tseuqedoc' },
    ],
  }),
  createChallenge({
    day: 4,
    title: 'Maximum Subarray',
    topic: 'Dynamic Programming',
    difficulty: 'easy',
    xpReward: 35,
    functionName: 'maxSubarraySum',
    description: 'Return the largest sum of any contiguous subarray.',
    signature: 'function maxSubarraySum(nums) {',
    starterCode: `function maxSubarraySum(nums) {
  // return the best contiguous sum
}
`,
    hints: ['Track the best ending here and the best overall.', 'Reset the running sum when it becomes worse than starting fresh.'],
    testCases: [
      { description: 'Classic example', args: [[-2,1,-3,4,-1,2,1,-5,4]], expected: 6 },
      { description: 'Single number', args: [[1]], expected: 1 },
    ],
  }),
  createChallenge({
    day: 5,
    title: 'Remove Duplicates',
    topic: 'Arrays',
    difficulty: 'easy',
    xpReward: 35,
    functionName: 'removeDuplicatesSorted',
    description: 'Given a sorted array, return a new array that contains each value only once.',
    signature: 'function removeDuplicatesSorted(nums) {',
    starterCode: `function removeDuplicatesSorted(nums) {
  // return a deduplicated sorted array
}
`,
    hints: ['Because the array is sorted, duplicates are adjacent.', 'Build a result array and skip repeated values.'],
    testCases: [
      { description: 'Small duplicate list', args: [[1,1,2]], expected: [1,2] },
      { description: 'Longer list', args: [[0,0,1,1,1,2,2,3]], expected: [0,1,2,3] },
    ],
  }),
  createChallenge({
    day: 6,
    title: 'Merge Sorted Arrays',
    topic: 'Two Pointers',
    difficulty: 'easy',
    xpReward: 35,
    functionName: 'mergeSortedArrays',
    description: 'Merge two already sorted arrays into one sorted array.',
    signature: 'function mergeSortedArrays(left, right) {',
    starterCode: `function mergeSortedArrays(left, right) {
  // merge the arrays in sorted order
}
`,
    hints: ['Use two pointers, one for each array.', 'Always take the smaller current value first.'],
    testCases: [
      { description: 'Equal length arrays', args: [[1,2,4], [1,3,4]], expected: [1,1,2,3,4,4] },
      { description: 'Empty left array', args: [[], [0]], expected: [0] },
    ],
  }),
  createChallenge({
    day: 7,
    title: 'Binary Search',
    topic: 'Search',
    difficulty: 'easy',
    xpReward: 35,
    functionName: 'binarySearch',
    description: 'Return the index of the target in a sorted array, or -1 if it does not exist.',
    signature: 'function binarySearch(nums, target) {',
    starterCode: `function binarySearch(nums, target) {
  // return the index of the target or -1
}
`,
    hints: ['Keep shrinking the search window.', 'Compare the target to the middle element each time.'],
    testCases: [
      { description: 'Target exists', args: [[1,3,5,7,9], 7], expected: 3 },
      { description: 'Target missing', args: [[1,3,5,7], 2], expected: -1 },
    ],
  }),
  createChallenge({
    day: 8,
    title: 'Move Zeroes',
    topic: 'Arrays',
    difficulty: 'easy',
    xpReward: 35,
    functionName: 'moveZeroes',
    description: 'Move every zero to the end while keeping the order of the non-zero values.',
    signature: 'function moveZeroes(nums) {',
    starterCode: `function moveZeroes(nums) {
  // return the array with zeroes moved to the end
}
`,
    hints: ['Collect non-zero values first.', 'Then append enough zeroes to fill the array.'],
    testCases: [
      { description: 'Mixed values', args: [[0,1,0,3,12]], expected: [1,3,12,0,0] },
      { description: 'Already clean', args: [[1,2,3]], expected: [1,2,3] },
    ],
  }),
  createChallenge({
    day: 9,
    title: 'Palindrome Number',
    topic: 'Math',
    difficulty: 'easy',
    xpReward: 35,
    functionName: 'palindromeNumber',
    description: 'Return true when a number reads the same forwards and backwards.',
    signature: 'function palindromeNumber(num) {',
    starterCode: `function palindromeNumber(num) {
  // check whether the number is a palindrome
}
`,
    hints: ['Convert the number to a string for a quick solution.', 'Compare the string with its reverse.'],
    testCases: [
      { description: 'Palindromic number', args: [121], expected: true },
      { description: 'Non-palindromic number', args: [10], expected: false },
    ],
  }),
  createChallenge({
    day: 10,
    title: 'First Unique Character',
    topic: 'Hash Map',
    difficulty: 'easy',
    xpReward: 40,
    functionName: 'firstUniqueChar',
    description: 'Return the index of the first character that appears only once. Return -1 when none exists.',
    signature: 'function firstUniqueChar(str) {',
    starterCode: `function firstUniqueChar(str) {
  // return the index of the first unique character
}
`,
    hints: ['Count how often each character appears.', 'Walk the string again and return the first count of 1.'],
    testCases: [
      { description: 'Unique at the start', args: ['leetcode'], expected: 0 },
      { description: 'Unique in the middle', args: ['loveleetcode'], expected: 2 },
    ],
  }),
  createChallenge({
    day: 11,
    title: 'Longest Common Prefix',
    topic: 'Strings',
    difficulty: 'easy',
    xpReward: 40,
    functionName: 'longestCommonPrefix',
    description: 'Return the longest prefix shared by every string in the array.',
    signature: 'function longestCommonPrefix(words) {',
    starterCode: `function longestCommonPrefix(words) {
  // return the shared prefix for all words
}
`,
    hints: ['Shrink the prefix until every word starts with it.', 'Compare one candidate prefix against each string.'],
    testCases: [
      { description: 'Shared prefix exists', args: [['flower','flow','flight']], expected: 'fl' },
      { description: 'No shared prefix', args: [['dog','racecar','car']], expected: '' },
    ],
  }),
  createChallenge({
    day: 12,
    title: 'Rotate Array',
    topic: 'Arrays',
    difficulty: 'easy',
    xpReward: 40,
    functionName: 'rotateArray',
    description: 'Rotate the array to the right by k steps and return the new array.',
    signature: 'function rotateArray(nums, k) {',
    starterCode: `function rotateArray(nums, k) {
  // rotate the array to the right
}
`,
    hints: ['Normalize k so it is smaller than the array length.', 'Slice the last k values and move them to the front.'],
    testCases: [
      { description: 'Rotate by three', args: [[1,2,3,4,5,6,7], 3], expected: [5,6,7,1,2,3,4] },
      { description: 'Rotate by one', args: [[1,2], 1], expected: [2,1] },
    ],
  }),
  createChallenge({
    day: 13,
    title: 'Flatten Nested Arrays',
    topic: 'Recursion',
    difficulty: 'medium',
    xpReward: 45,
    functionName: 'flattenArray',
    description: 'Flatten a nested array into a single level array.',
    signature: 'function flattenArray(values) {',
    starterCode: `function flattenArray(values) {
  // flatten the nested array recursively
}
`,
    hints: ['If a value is an array, flatten it recursively.', 'Otherwise push the value into the result.'],
    testCases: [
      { description: 'Mixed nesting', args: [[1,[2,[3,4],5],6]], expected: [1,2,3,4,5,6] },
      { description: 'Already flat', args: [[1,2,3]], expected: [1,2,3] },
    ],
  }),
  createChallenge({
    day: 14,
    title: 'Majority Element',
    topic: 'Hash Map',
    difficulty: 'easy',
    xpReward: 40,
    functionName: 'majorityElement',
    description: 'Return the element that appears more than half of the time.',
    signature: 'function majorityElement(nums) {',
    starterCode: `function majorityElement(nums) {
  // return the majority element
}
`,
    hints: ['Count occurrences with a map.', 'Or use the Boyer-Moore voting idea.'],
    testCases: [
      { description: 'Majority is three', args: [[3,2,3]], expected: 3 },
      { description: 'Majority is two', args: [[2,2,1,1,1,2,2]], expected: 2 },
    ],
  }),
  createChallenge({
    day: 15,
    title: 'Valid Anagram',
    topic: 'Strings',
    difficulty: 'easy',
    xpReward: 40,
    functionName: 'validAnagram',
    description: 'Return true if the two strings contain the same characters with the same counts.',
    signature: 'function validAnagram(a, b) {',
    starterCode: `function validAnagram(a, b) {
  // check if both strings are anagrams
}
`,
    hints: ['Sort both strings and compare.', 'Or count characters in a frequency map.'],
    testCases: [
      { description: 'Positive anagram', args: ['anagram', 'nagaram'], expected: true },
      { description: 'Negative anagram', args: ['rat', 'car'], expected: false },
    ],
  }),
  createChallenge({
    day: 16,
    title: 'Missing Number',
    topic: 'Math',
    difficulty: 'easy',
    xpReward: 40,
    functionName: 'missingNumber',
    description: 'Given numbers from 0 to n with one value missing, return the missing value.',
    signature: 'function missingNumber(nums) {',
    starterCode: `function missingNumber(nums) {
  // return the missing number
}
`,
    hints: ['Use the sum formula for 0 through n.', 'Or use XOR to cancel matching values.'],
    testCases: [
      { description: 'Missing two', args: [[3,0,1]], expected: 2 },
      { description: 'Missing highest value', args: [[0,1]], expected: 2 },
    ],
  }),
  createChallenge({
    day: 17,
    title: 'Climbing Stairs',
    topic: 'Dynamic Programming',
    difficulty: 'easy',
    xpReward: 45,
    functionName: 'climbStairs',
    description: 'Return the number of distinct ways to reach the top when you may climb one or two steps.',
    signature: 'function climbStairs(n) {',
    starterCode: `function climbStairs(n) {
  // return the number of ways to climb the stairs
}
`,
    hints: ['Each answer is the sum of the previous two answers.', 'This is the Fibonacci pattern in disguise.'],
    testCases: [
      { description: 'Two steps', args: [2], expected: 2 },
      { description: 'Five steps', args: [5], expected: 8 },
    ],
  }),
  createChallenge({
    day: 18,
    title: 'Fibonacci Number',
    topic: 'Recursion',
    difficulty: 'easy',
    xpReward: 45,
    functionName: 'fibonacci',
    description: 'Return the nth Fibonacci number using 0-based indexing.',
    signature: 'function fibonacci(n) {',
    starterCode: `function fibonacci(n) {
  // return the nth fibonacci number
}
`,
    hints: ['Use base cases for 0 and 1.', 'Build the sequence iteratively to avoid recursion overhead.'],
    testCases: [
      { description: 'Zero index', args: [0], expected: 0 },
      { description: 'Sixth index', args: [6], expected: 8 },
    ],
  }),
  createChallenge({
    day: 19,
    title: 'Coin Change',
    topic: 'Dynamic Programming',
    difficulty: 'medium',
    xpReward: 50,
    functionName: 'coinChangeMin',
    description: 'Return the minimum number of coins needed to make the amount, or -1 if it is impossible.',
    signature: 'function coinChangeMin(coins, amount) {',
    starterCode: `function coinChangeMin(coins, amount) {
  // return the fewest coins needed, or -1
}
`,
    hints: ['Use a dp array where dp[x] is the minimum coins for x.', 'Initialize unreachable states with Infinity.'],
    testCases: [
      { description: 'Reachable amount', args: [[1,2,5], 11], expected: 3 },
      { description: 'Impossible amount', args: [[2], 3], expected: -1 },
    ],
  }),
  createChallenge({
    day: 20,
    title: 'Subset Sum Exists',
    topic: 'Backtracking',
    difficulty: 'medium',
    xpReward: 50,
    functionName: 'subsetSumExists',
    description: 'Return true if any subset adds up exactly to the target value.',
    signature: 'function subsetSumExists(nums, target) {',
    starterCode: `function subsetSumExists(nums, target) {
  // decide whether any subset reaches the target
}
`,
    hints: ['At each number, choose to include it or skip it.', 'Memoize repeated states when necessary.'],
    testCases: [
      { description: 'Target can be formed', args: [[3,34,4,12,5,2], 9], expected: true },
      { description: 'Target cannot be formed', args: [[1,2,3], 7], expected: false },
    ],
  }),
  createChallenge({
    day: 21,
    title: 'Top K Frequent Elements',
    topic: 'Heap / Hash Map',
    difficulty: 'medium',
    xpReward: 50,
    functionName: 'topKFrequent',
    description: 'Return the k most frequent values in descending frequency order. Break ties by smaller value first.',
    signature: 'function topKFrequent(nums, k) {',
    starterCode: `function topKFrequent(nums, k) {
  // return the k most frequent values
}
`,
    hints: ['Count frequencies first.', 'Sort by frequency and then by value.'],
    testCases: [
      { description: 'Common example', args: [[1,1,1,2,2,3], 2], expected: [1,2] },
      { description: 'Tie-breaking', args: [[4,1,-1,2,-1,2,3], 2], expected: [-1,2] },
    ],
  }),
  createChallenge({
    day: 22,
    title: 'Binary Tree Level Order Traversal',
    topic: 'Trees',
    difficulty: 'medium',
    xpReward: 55,
    functionName: 'levelOrderTraversal',
    description: 'Return the node values level by level from left to right.',
    signature: 'function levelOrderTraversal(root) {',
    starterCode: `function levelOrderTraversal(root) {
  // return a level order traversal as an array of arrays
}
`,
    hints: ['Use a queue for breadth-first traversal.', 'Collect the values for each level before moving to the next one.'],
    testCases: [
      { description: 'Balanced tree', args: [tree(3, tree(9), tree(20, tree(15), tree(7)))], expected: [[3],[9,20],[15,7]] },
      { description: 'Single node', args: [tree(1)], expected: [[1]] },
    ],
  }),
  createChallenge({
    day: 23,
    title: 'Maximum Tree Depth',
    topic: 'Trees',
    difficulty: 'easy',
    xpReward: 45,
    functionName: 'maxDepthBinaryTree',
    description: 'Return the maximum depth of a binary tree.',
    signature: 'function maxDepthBinaryTree(root) {',
    starterCode: `function maxDepthBinaryTree(root) {
  // return the maximum depth of the tree
}
`,
    hints: ['The depth of a null tree is 0.', 'The depth of a node is 1 plus the larger child depth.'],
    testCases: [
      { description: 'Three levels', args: [tree(3, tree(9), tree(20, tree(15), tree(7)))], expected: 3 },
      { description: 'Empty tree', args: [null], expected: 0 },
    ],
  }),
  createChallenge({
    day: 24,
    title: 'Path Sum in a Tree',
    topic: 'Trees',
    difficulty: 'medium',
    xpReward: 55,
    functionName: 'hasPathSum',
    description: 'Return true if the tree contains a root-to-leaf path whose values add up to the target sum.',
    signature: 'function hasPathSum(root, targetSum) {',
    starterCode: `function hasPathSum(root, targetSum) {
  // check whether a root-to-leaf path matches the target sum
}
`,
    hints: ['Subtract the current node value from the target as you recurse.', 'Only count a path when you reach a leaf.'],
    testCases: [
      { description: 'Path exists', args: [tree(5, tree(4, tree(11, tree(7), tree(2))), tree(8, tree(13), tree(4, null, tree(1)))), 22], expected: true },
      { description: 'Path missing', args: [tree(1, tree(2), tree(3)), 5], expected: false },
    ],
  }),
  createChallenge({
    day: 25,
    title: 'Sum of Left Leaves',
    topic: 'Trees',
    difficulty: 'medium',
    xpReward: 55,
    functionName: 'sumOfLeftLeaves',
    description: 'Return the sum of all left leaf values in the tree.',
    signature: 'function sumOfLeftLeaves(root) {',
    starterCode: `function sumOfLeftLeaves(root) {
  // return the sum of all left leaves
}
`,
    hints: ['A left leaf is a left child with no children of its own.', 'Check both children while recursing through the tree.'],
    testCases: [
      { description: 'Tree with two left leaves', args: [tree(3, tree(9), tree(20, tree(15), tree(7)))], expected: 24 },
      { description: 'Single branch', args: [tree(1, tree(2, tree(3), null), null)], expected: 3 },
    ],
  }),
  createChallenge({
    day: 26,
    title: 'Reverse Linked List',
    topic: 'Linked Lists',
    difficulty: 'medium',
    xpReward: 55,
    functionName: 'reverseLinkedList',
    description: 'Given the values of a linked list, return the values in reverse order.',
    signature: 'function reverseLinkedList(values) {',
    starterCode: `function reverseLinkedList(values) {
  // reverse the linked list values
}
`,
    hints: ['You can reverse the values array to simulate the linked list.', 'A classic linked-list reversal rewires next pointers one node at a time.'],
    testCases: [
      { description: 'Five nodes', args: [[1,2,3,4,5]], expected: [5,4,3,2,1] },
      { description: 'Single node', args: [[1]], expected: [1] },
    ],
  }),
  createChallenge({
    day: 27,
    title: 'Merge Two Sorted Lists',
    topic: 'Linked Lists',
    difficulty: 'easy',
    xpReward: 50,
    functionName: 'mergeTwoSortedLists',
    description: 'Merge two sorted linked lists and return the merged values in sorted order.',
    signature: 'function mergeTwoSortedLists(listA, listB) {',
    starterCode: `function mergeTwoSortedLists(listA, listB) {
  // merge the two sorted lists
}
`,
    hints: ['Walk through both lists with one pointer for each list.', 'Take the smaller current value each time.'],
    testCases: [
      { description: 'Standard merge', args: [[1,2,4], [1,3,4]], expected: [1,1,2,3,4,4] },
      { description: 'One empty list', args: [[], [0]], expected: [0] },
    ],
  }),
  createChallenge({
    day: 28,
    title: 'Remove Nth Node From End',
    topic: 'Linked Lists',
    difficulty: 'medium',
    xpReward: 55,
    functionName: 'removeNthFromEnd',
    description: 'Remove the nth value from the end of the list and return the remaining values.',
    signature: 'function removeNthFromEnd(values, n) {',
    starterCode: `function removeNthFromEnd(values, n) {
  // remove the nth value from the end
}
`,
    hints: ['Use a two-pointer gap of n elements.', 'Or compute the index to remove from the front.'],
    testCases: [
      { description: 'Remove middle node', args: [[1,2,3,4,5], 2], expected: [1,2,3,5] },
      { description: 'Remove only node', args: [[1], 1], expected: [] },
    ],
  }),
  createChallenge({
    day: 29,
    title: 'Check Bipartite Graph',
    topic: 'Graphs',
    difficulty: 'medium',
    xpReward: 60,
    functionName: 'isBipartite',
    description: 'Return true when the graph can be colored with two colors so no connected nodes share a color.',
    signature: 'function isBipartite(graph) {',
    starterCode: `function isBipartite(graph) {
  // determine whether the graph is bipartite
}
`,
    hints: ['Color neighbors with the opposite color.', 'Use BFS or DFS to detect conflicts.'],
    testCases: [
      { description: 'Bipartite graph', args: [[[1,3],[0,2],[1,3],[0,2]]], expected: true },
      { description: 'Non-bipartite graph', args: [[[1,2,3],[0,2],[0,1,3],[0,2]]], expected: false },
    ],
  }),
  createChallenge({
    day: 30,
    title: 'Shortest Path in a Grid',
    topic: 'Graphs',
    difficulty: 'hard',
    xpReward: 75,
    functionName: 'shortestPathInGrid',
    description: 'Return the length of the shortest path from the top-left to the bottom-right cell, moving only through 0 cells. Return -1 if no path exists.',
    signature: 'function shortestPathInGrid(grid) {',
    starterCode: `function shortestPathInGrid(grid) {
  // return the shortest path length in the grid
}
`,
    hints: ['Use BFS because every move has the same cost.', 'Track visited cells so you do not revisit them forever.'],
    testCases: [
      { description: 'Path exists', args: [[[0,0,0],[1,1,0],[0,0,0]]], expected: 4 },
      { description: 'Blocked path', args: [[[0,1],[1,0]]], expected: -1 },
    ],
  }),
];

module.exports = CHALLENGES;
