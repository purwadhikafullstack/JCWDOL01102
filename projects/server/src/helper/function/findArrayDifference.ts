export const findArrayDifference = (arr1: number[], arr2: number[]) => {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  return [...arr1.filter((value) => !set2.has(value)), ...arr2.filter((value) => !set1.has(value))];
};
