const mergeSort = (arr, key) => {
  // Base case: return if array has 1 or fewer elements.
  if (arr.length <= 1) {
    return arr;
  }

  // Split the array in half.
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), key);  // Sort left half.
  const right = mergeSort(arr.slice(mid), key);    // Sort right half.

  // Merge the sorted halves.
  return merge(left, right, key);
};

// Merges two sorted arrays into one, based on the date key.
const merge = (left, right, key) => {
  let result = [], i = 0, j = 0;

  // Merge elements while both arrays have values.
  while (i < left.length && j < right.length) {
    const leftDate = new Date(left[i][key]);
    const rightDate = new Date(right[j][key]);

    // Compare dates and add the smaller one to the result.
    if (leftDate < rightDate) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  // Concatenate any remaining elements.
  return result.concat(left.slice(i)).concat(right.slice(j));
};

// Export mergeSort as default.
export default mergeSort;
