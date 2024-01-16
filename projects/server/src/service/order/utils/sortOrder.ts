export function sortOrders(sortCode: string) {
  const sortOptions = {
    key: 'createdAt',
    order: 'DESC',
  };
  switch (sortCode) {
    case 'dateDesc':
      sortOptions.key = 'createdAt';
      sortOptions.order = 'DESC';
      break;
    case 'dateAsc':
      sortOptions.key = 'createdAt';
      sortOptions.order = 'ASC';
      break;
    case 'totalPriceDesc':
      sortOptions.key = 'total';
      sortOptions.order = 'DESC';
      break;
    case 'totalPrice':
      sortOptions.key = 'total';
      sortOptions.order = 'ASC';
      break;
    default:
      sortOptions.key = 'createdAt';
      sortOptions.order = 'DESC';
      break;
  }
  return sortOptions;
}
