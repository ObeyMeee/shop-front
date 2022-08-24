import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {Product} from '../common/product';
import {ProductCategory} from '../common/product-category';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseUrl = environment.andromedaApiUrl;
  private SEARCH_PRODUCTS = "products/search";

  constructor(private httpClient: HttpClient) {
  }

  getProductsListPaginate(pageNumber: number,
                          pageSize: number,
                          categoryId: number): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseUrl}/${this.SEARCH_PRODUCTS}/findByCategoryId?id=${categoryId}&page=${pageNumber}&size=${pageSize}`;
    console.log(" ===================== Into service ==============")
    console.log(`page number ==> ${pageNumber}`)
    console.log(`page number ==> ${pageSize}`)
    console.log(`page number ==> ${categoryId}`)
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    const categoryUrl = `${this.baseUrl}/product-category`;
    return this.httpClient.get<GetResponseProductCategory>(categoryUrl)
      .pipe(map(response => response._embedded.productCategory));
  }

  searchProductsPaginate(pageNumber: number,
                         pageSize: number,
                         keyword: string): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/${this.SEARCH_PRODUCTS}/findByNameContainingIgnoreCase?name=${keyword}`
      + `&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductById(id: number): Observable<Product> {
    const searchUrl = `${this.baseUrl}/products/${id}`;
    return this.httpClient.get<Product>(searchUrl);
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number,
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}


