import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterModule} from '@angular/router';

@Component({
  selector: 'menu',
  standalone: true,
  imports: [MatButtonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  router = inject(Router)
  ngOnInit() {
  }

  isActive(s: string){
    return this.router.url == '/'+ s
  }
}