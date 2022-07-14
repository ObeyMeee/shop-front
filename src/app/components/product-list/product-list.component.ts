import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products!: Product[];
  categoryName!: string;
  currentCategoryId!: number;
  previousCategoryId: number = 1;
  searchMode!: boolean;

  pageSize: number = 10;
  pageNumber: number = 1;
  totalElements: number = 0;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => this.listProducts())
  }

  listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has("keyword");
    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
  }
  handleSearchProducts() {
    const keyword = this.route.snapshot.paramMap.get("keyword")!;
    this.productService.searchProducts(keyword).subscribe(data => this.products = data);
  }

  handleListProducts(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    if(hasCategoryId){
      this.categoryName = this.route.snapshot.paramMap.get("name")!; 
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id")!;
    }
    else{
      this.currentCategoryId = 1;
      this.categoryName = "Books";
    }

    if(this.previousCategoryId != this.currentCategoryId){
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}, `)
  
    this.productService.getProductsListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId)
                      .subscribe(data => {
                        this.products = data._embedded.products;
                        this.pageNumber = data.page.number + 1;
                        this.pageSize = data.page.size;
                        this.totalElements = data.page.totalElements;
                      })
  }


}
