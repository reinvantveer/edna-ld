/**
 * Created by reinvantveer on 2/27/17.
 */

const compareFunctions = {
  opsLength(A, B) {
    const scores = {
      A: 0,
      B: 0
    };

    if (A.patch.length > B.patch.length) scores.B = 1;
    if (A.patch.length < B.patch.length) scores.A = 1;

    return scores;
  },

  /**
   * preferAdditions scores two JSON patch diffs on the following ordered criteria:
   * 1. A is preferred over B in ANY case where the number of A removal ops is lower than the
   * number of B removal ops
   * 2. And the inverse
   * 3.Where the number of removals is the same, A is preferred over B whenever A has additions
   * and B doesn't
   * 4. And the inverse
   * 5. Where the number of removals is the same and both A and B have additions, A is preferred
   * over B when it has less addition operations.
   * 6. And the inverse
   */
  preferAdditions(A, B) {
    const scores = compareFunctions.opsLength(A, B);

    const removalsA = A.patch.filter(element => element.op === 'remove');
    const removalsB = B.patch.filter(element => element.op === 'remove');

    const additionsA = A.patch.filter(element => element.op === 'add');
    const additionsB = B.patch.filter(element => element.op === 'add');

    function preferAoverB() {
      scores.A = 1;
      scores.B = 0;
      return scores;
    }

    function preferBoverA() {
      scores.A = 0;
      scores.B = 1;
      return scores;
    }

    // Condition 1 from docstring
    if (removalsA.length < removalsB.length) return preferAoverB();

    // Condition 2 from docstring
    if (removalsA.length > removalsB.length) return preferBoverA();

    // Condition 3
    if (additionsA.length > 0 && additionsB.length === 0) return preferAoverB();

    // Condition 4
    if (additionsB.length > 0 && additionsA.length === 0) return preferBoverA();

    // Condition 5
    if (additionsA.length < additionsB.length) return preferAoverB();

    // Condition 6
    if (additionsA.length > additionsB.length) return preferBoverA();

    return scores;
  }
};

/**
 * Sorting function to be passed to {relate}
 * Sorting algorithm for scoring schema differences based on JSON-patch
 * @param diffA The first schema diff patch
 * @param diffB The second schema diff patch
 * @returns {number} The outcome of the scoring.
 *                  -1 if diffA is better, 1 if B is better, 0 if equal scoring
 */
module.exports = function schemaDiffSorter(diffA, diffB, compareType = 'opsLength') {
  const scores = compareFunctions[compareType](diffA, diffB);
  return scores.B - scores.A;
};
