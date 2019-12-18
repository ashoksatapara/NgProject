import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { OrderService } from '../shared/order.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Component({

  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: [],
})
export class OrdersComponent implements OnInit {
  orderList;

 

  constructor(private service:OrderService,private router:Router,
    private toastr: ToastrService) { }

  

  ngOnInit() {
    
    this.resfreshList();
  }

  resfreshList(){
    this.service.getOrderlist().then(res=>this.orderList=res);

  }
  openForEdit(orderID:number){
    this.router.navigate(['/order/edit/'+orderID]);
  }
 
  


  onDeleteOrder(id:number){
    if(confirm('Are you sure to delete this record?'))
    {
      this.service.deleteOrder(id).then(res=>{
      this.resfreshList();
      this.toastr.warning('Deleted Sucessfully','Restaurant App.');
      });
    }
  }
}
