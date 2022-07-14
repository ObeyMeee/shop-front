import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 
  
  private baseUrl = "http://localhost:8080/api";
  private SEARCH_PRODUCTS = "/products/search";
  constructor(private httpClient: HttpClient) { }

  getProductsListPaginate(pageNumber: number,
                          pageSize: number,
                          categoryId: number): Observable<GetResponseProducts>{

    const searchUrl = `${this.baseUrl}${this.SEARCH_PRODUCTS}/findByCategoryId?id=${categoryId}&page=${pageNumber}&size=${pageSize}`;
                                                            
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductsList(categoryId: number): Observable<Product[]>{
    const searchUrl = `${this.baseUrl}${this.SEARCH_PRODUCTS}/findByCategoryId?id=${categoryId}`;
    return this.getProducts(searchUrl);
  }
  
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl)
      .pipe(map(response => response._embedded.products));
  }

  getProductCategories(): Observable<ProductCategory[]> {
    const categoryUrl = `${this.baseUrl}/product-category`;
    return this.httpClient.get<GetResponseProductCategory>(categoryUrl)
                          .pipe(map(response => response._embedded.productCategory));
  }

  searchProducts(keyword: string):Observable<Product[]> {
    const searchUrl = `${this.baseUrl}${this.SEARCH_PRODUCTS}/findByNameContainingIgnoreCase?name=${keyword}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl)
                          .pipe(map(response => response._embedded.products));
  }

  getProductById(id: number): Observable<Product> {
    const searchUrl = `${this.baseUrl}/products/${id}`;
    return this.httpClient.get<Product>(searchUrl);
  }
}

interface GetResponseProducts{
  _embedded: {
    products: Product[];
  },
  page:{
    size: number,
    totalElements: number,
    totalPages: number,
    number: number,
  }
}

interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[];
  }
}


