import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive, RouterModule} from '@angular/router';
import { PageService } from '../service/page.service';

@Component({
  selector: 'menu',
  standalone: true,
  imports: [MatButtonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  providers: [PageService]
})
export class MenuComponent {
  activePage: string = "";
  router = inject(Router)
  
  constructor(public pageService: PageService){
  }
  
  ngOnInit() {
    this.pageService.activePage.subscribe(
      (page) => (this.activePage = page)
    );
  }

  isActive(s: string){
    return (this.activePage == s)/* || this.router.url == '/'+ s*/;
  }
}