import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class PageService {

  constructor() {}

  activePage = new BehaviorSubject<string>("");
  currentActivePage = this.activePage.asObservable();

  setActivePage(page: string){
    this.activePage.next(page);
  }

}