import {OrderItem} from './order-item';
import {Product} from "./product";
import {CartItem} from "./cart-item";

describe('OrderItem', () => {
  it('should create an instance', () => {
    expect(new OrderItem(new CartItem(new Product()))).toBeTruthy();
  });
});
