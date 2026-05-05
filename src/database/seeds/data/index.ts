export * from './packages/promotion.data';
export * from './packages/renew.data';
export * from './packages/membership.data';
export * from './categories/category.data';

import { promotionPackages } from './packages/promotion.data';
import { renewPackages } from './packages/renew.data';
import { membershipPackages } from './packages/membership.data';
import { categories } from './categories/category.data';

export const allPackages = [
  ...promotionPackages,
  ...renewPackages,
  ...membershipPackages,
];

export { promotionPackages, renewPackages, membershipPackages, categories };
