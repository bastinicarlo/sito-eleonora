import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule} from '@angular/router';

@Component({
  selector: 'menu',
  standalone: true,
  imports: [MatButtonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

}
