import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Product} from 'src/app/common/product';
import {ProductService} from 'src/app/services/product.service';
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  categoryName!: string;
  currentCategoryId!: number;
  previousCategoryId: number = 1;
  searchMode!: boolean;

  pageSize: number = 10;
  pageNumber: number = 1;
  totalElements: number = 0;

  previousKeyword!: string;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(() => this.listProducts())
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has("keyword");
    this.searchMode ? this.handleSearchProducts() : this.handleListProducts();
  }

  handleSearchProducts() {
    const keyword = this.route.snapshot.paramMap.get("keyword")!;
    if (this.previousKeyword != keyword) {
      this.pageNumber = 1;
    }
    this.previousKeyword = keyword;

    this.productService.searchProductsPaginate(this.pageNumber - 1, this.pageSize, keyword)
      .subscribe(data => {
        this.products = data._embedded.products
        this.pageNumber = data.page.number + 1;
        this.totalElements = data.page.totalElements;
      });
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");
    this.categoryName = hasCategoryId ? this.getRouteParam("name") : 'Books';
    this.currentCategoryId = hasCategoryId ? +this.getRouteParam("id")! : 1;
    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    this.productService.getProductsListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId)
      .subscribe(data => {
        this.products = data._embedded.products;
        this.pageNumber = data.page.number + 1;
        this.pageSize = data.page.size;
        this.totalElements = data.page.totalElements;
      })
  }

  private getRouteParam(param) {
    return this.route.snapshot.paramMap.get(param)!;
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product) {
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }
}
