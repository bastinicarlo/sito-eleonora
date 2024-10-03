import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule} from '@angular/router';
import { PageService } from '../service/page.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [],
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
  /*@ViewChild('corsi') corsiElement: ElementRef;
  @ViewChild('sedi') sediElement: ElementRef;
  @ViewChild('collaborazioni') collaborazioniElement: ElementRef;
  @ViewChild('calendario') calendarioElement: ElementRef;*/

  public homeOffset: number = 0;
  public chiSiamoOffset: number = 0;

  constructor(public pageService: PageService){
    this.checkOffsetTop();
  }

  ngAfterViewInit() {
    this.homeOffset = this.homeElement.nativeElement.offsetTop;
    this.chiSiamoOffset = this.chiSiamoElement.nativeElement.offsetTop;
  }

  @HostListener('window:scroll', ['$event'])
  checkOffsetTop() {
    if (window.scrollY >= this.homeOffset && window.scrollY < this.chiSiamoOffset) {
      this.pageService.setActivePage("chi-siamo");
    } else {
      this.pageService.setActivePage("home");
    }
  }
}
