import generateUniqueId from 'generate-unique-id';
interface IGetUniqId {
  length?: number;
}
export function getUniqId(input: IGetUniqId = { length: 8 }): string {
  return generateUniqueId(input).toLowerCase();
}
