import { Component, OnInit } from '@angular/core';
import { ItemComponentService } from '../services/ItemComponent/item-component.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-itemcomponent',
  templateUrl: './itemcomponent.component.html',
  styleUrls: ['./itemcomponent.component.scss']
})
export class ItemcomponentComponent implements OnInit {

  name:string
  kilowatts:number
  watts:number
  itemComponents:Array<any>
  dataSet:any

  constructor(
    private itemComponentService : ItemComponentService
  ) {}

  ngOnInit(): void {
    this.getItemComponents();
  }

  getItemComponents(){
    this.itemComponentService.getItemComponent().subscribe((response) => {
      console.log('Response Get --> ', response)
      this.itemComponents = response;
      this.dataSet = response;
    },
      (error: HttpErrorResponse) => {
        console.log(error);
      });
  }

  createItemComponent() {
    var modelo :any = {
      name : this.name,
      typeLocalId : 5,
      wattsXm2 : this.watts,
      kiloWatts : this.kilowatts,
      predecessor : 5
    }
    
    this.itemComponentService.postItemComponent(modelo).subscribe((response) => {
      console.log('Response Post --> ', response);
      this.getItemComponents();
    },
      (error: HttpErrorResponse) => {
        console.error(error);
      });
  }

  deleteItemComponent(itemComponent:any){
    this.itemComponentService.deleteItemComponent(itemComponent).subscribe((response)=>{
      this.getItemComponents();
    },
    (error: HttpErrorResponse) => {
      console.error(error);
    });
  }

  getItemComponentById(itemComponent:any) {
    var filter = { itemComponentId: itemComponent };
    this.itemComponentService.getItemComponentById(filter).subscribe((response) => {
      console.log('Response Filter --> ', response)
      this.name = response.name;
      this.kilowatts = response.kiloWatts;
      this.watts = response.wattsXm2;
    },
      (error: HttpErrorResponse) => {
        console.error(error);
      });
  }

}
