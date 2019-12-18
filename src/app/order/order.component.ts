import { Component, OnInit,ViewChild,ElementRef } from '@angular/core'
import { OrderService } from '../shared/order.service';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OrderItemsComponent } from '../order-items/order-items.component';
import { CustomerService } from '../shared/customer.service';
import { Customer } from '../shared/customer.mode';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import * as jsPDF from 'jspdf';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: []
})
export class OrderComponent implements OnInit {
   customerList:Customer[];
   isValid:boolean = true;
  // @ViewChild(content) content:ElementRef;
    constructor(private service:OrderService ,
    private dialog:MatDialog,
    private CustomerService:CustomerService,
    private toastr: ToastrService,
    private router:Router,
    private currentRoute:ActivatedRoute) { }


  ngOnInit() { 
    let orderID = this.currentRoute.snapshot.paramMap.get('id');
    if (orderID == null)
    this.resetForm();
    else{
      this.service.getOrderByID(parseInt(orderID)).then(res=>{
      this.service.formData = res.order;
      this.service.orderItems = res.orderDetails});
    }
    this.CustomerService.getCustomerlist().then(res => this.customerList=res as Customer[]);
    
  }

 resetForm(form?:NgForm){
   if (form = null)
   form.resetForm();
   this.service.formData = {
    OrderID:null,
    OrderDate:null,
    CustomerID:0,
    PMethod:'',
    FTotal:0,
    DeletedOrderItemIDs:''
   };
   this.service.orderItems=[];
 }

 AddOrEditOrder(OrderItemIndex, OrderID){
   const dialogConfig = new MatDialogConfig;
   dialogConfig.autoFocus = true;
   dialogConfig.disableClose = true;
   dialogConfig.width = "50%";
   dialogConfig.data={OrderItemIndex, OrderID};
   this.dialog.open(OrderItemsComponent,dialogConfig).afterClosed().subscribe(res=>{
    this.updateGrandTotal();
   })
 }

 
 onDeleteOrderItem(orderItemID:number,i:number){
    if (orderItemID != null)
    this.service.formData.DeletedOrderItemIDs += orderItemID + ",";
    this.service.orderItems.splice(i,1);
    this.updateGrandTotal();

 }

 updateGrandTotal(){
    this.service.formData.FTotal= this.service.orderItems.reduce((prev,curr)=>{
     return prev+curr.Total;
  },0);
  this.service.formData.FTotal = parseFloat((this.service.formData.FTotal).toFixed(2));
 }
validateForm(){
  this.isValid=true;
  if(this.service.formData.OrderDate==null)
  this.isValid=false;
  else
  if(this.service.formData.CustomerID==0)
  this.isValid=false;
  else if(this.service.orderItems.length==0)
  this.isValid=false;
  else if(this.service.formData.PMethod.length==0)
  this.isValid=false;
  
  return this.isValid;

}

onSubmit(form:NgForm){
  if(this.validateForm()){
    this.service.saveOrUpdateOrder().subscribe(res=>{
      this.resetForm();
      this.toastr.success('Submitted Sucessfully','Restaurant App.');
      this.router.navigate(['/orders']);
    })
  }
}


}
