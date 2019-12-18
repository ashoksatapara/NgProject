import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA,MatDialogRef} from '@angular/material';
import { OrderItem } from '../shared/order-item.model';
import { Item } from '../shared/item.model';
import { ItemService } from '../shared/item.service';
import { NgForm } from '@angular/forms';
import { OrderService } from '../shared/order.service';


@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.css']
})
export class OrderItemsComponent implements OnInit {
  formData:OrderItem;
  itemList: Item[];
  isValid:boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef:MatDialogRef<OrderItemsComponent>,
    private itemService:ItemService,
    private orderService:OrderService
  ) { }

  ngOnInit() {
    this.itemService.getItemlist().then(res => this.itemList=res as Item[]);
    if(this.data.OrderItemIndex==null)
      this.formData={
      OrderitemId:null,
      OrderID:this.data.OrderID,
      ItemID:0,
      Quantity:null,
      ItemName:"",
      Price:0,
      Total:0
    }
    else
    this.formData = Object.assign({},this.orderService.orderItems[this.data.OrderItemIndex]);
    
  }
  UpdatePrice(ctrl){
      if(ctrl.selectedIndex==0){
        this.formData.Price=0;
        this.formData.ItemName='';
      }
      else{
        this.formData.Price = this.itemList[ctrl.selectedIndex-1].Price;
        this.formData.ItemName = this.itemList[ctrl.selectedIndex-1].Name;
      }
      this.updateTotal();
  }

  updateTotal(){
    this.formData.Total = parseFloat((this.formData.Quantity*this.formData.Price).toFixed(2));
  }

  onSubmit(form:NgForm){  
    
      if(this.validateForm(form.value)){
        if(this.data.OrderItemIndex==null)
        this.orderService.orderItems.push(form.value);
        else
        this.orderService.orderItems[this.data.OrderItemIndex] = form.value;
        
        this.dialogRef.close();
      }
  }

  validateForm(formData=OrderItem){
    this.isValid=true;
    if(this.formData.ItemID==0)
    this.isValid=false;
    else if (this.formData.Quantity==null)
    this.isValid=false;
    else
    this.isValid=true;

    return this.isValid;

  }
}
