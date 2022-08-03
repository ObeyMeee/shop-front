import {Component, OnInit} from '@angular/core';
import {OrderHistory} from "../../common/order-history";
import {OrderHistoryService} from "../../services/order-history.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  storage: Storage = sessionStorage;
  orderHistory: OrderHistory[];

  constructor(private orderHistoryService: OrderHistoryService) {
  }

  ngOnInit(): void {
    const userEmail = sessionStorage.getItem('userEmail');
    this.orderHistoryService.getOrderHistory(userEmail)
      .subscribe(result => this.orderHistory = result._embedded.orders);
  }

}
