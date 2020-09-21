import { Injectable } from '@angular/core';
import { HttpServiceService } from '../http-service.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemComponentService {

  constructor(
    private httpService: HttpServiceService
  ) { }

  private POST_ENDPOINT = 'https://localhost:44326';

  getItemComponent():Observable<any>{
    return this.httpService.get<any>(`${this.POST_ENDPOINT}/itemComponents/find-all`);
  }

  deleteItemComponent(parameters: any):Observable<any>{
    return this.httpService.delete<any>(`${this.POST_ENDPOINT}/itemComponents/${parameters}`)
  }

  getItemComponentById(parameters: any):Observable<any>{
    let httpParams = new HttpParams({
      fromObject: parameters
    });
    return this.httpService.get<any>(`${this.POST_ENDPOINT}/itemComponents/search`,{ params: httpParams });
  }

  postItemComponent(model : any) :Observable<any>{
    return this.httpService.post<any>(`${this.POST_ENDPOINT}/itemComponents`,model);
  }
}
