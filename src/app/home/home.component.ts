import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule} from '@angular/router';
import { PageService } from '../service/page.service';
import { corsoDescrizione } from '../interface/corsoDescrizione';

@Component({
  selector: 'home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [
    PageService,
  ],

})
export class HomeComponent {

  @ViewChild('home')
  homeElement!: ElementRef;
  @ViewChild('chiSiamo')
  chiSiamoElement!: ElementRef;
  @ViewChild('corsi')
  corsiElement!: ElementRef;

  public homeOffset: number = 0;
  public chiSiamoOffset: number = 0;
  public corsiOffset: number = 0;
  public corsiDescrizione: any;
  public selectedCorso: string | undefined;

  constructor(public pageService: PageService, private http: HttpClient){
    this.checkOffsetTop();
    this.getCorsiDescrizione();
  }

  public getCorsiDescrizione(){
    this.http.get<corsoDescrizione[]>("http://localhost:5027/api/corsi/descrizione").subscribe((data) => {
      this.corsiDescrizione = data
      this.changeSelected(this.corsiDescrizione[0].nome);
    });
  }

  ngAfterViewInit() {
    this.homeOffset = this.homeElement.nativeElement.offsetTop;
    this.chiSiamoOffset = this.chiSiamoElement.nativeElement.offsetTop;
  }

  @HostListener('window:scroll', ['$event'])
  checkOffsetTop() {
    if (window.scrollY >= this.homeOffset && window.scrollY < this.chiSiamoOffset) {
      this.pageService.setActivePage("chi-siamo");
    } 
    else if (window.scrollY >= this.chiSiamoOffset && window.scrollY < this.corsiOffset) {
      this.pageService.setActivePage("corsi");
    } 
    else {
      this.pageService.setActivePage("home");
    }
  }

  isSelected(corso: string){
    return this.selectedCorso == corso;
  }

  changeSelected(corso: string){
    this.selectedCorso = corso;
  }
}
