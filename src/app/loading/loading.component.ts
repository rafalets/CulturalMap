import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';



@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    MatProgressBarModule,
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {


  constructor(
    private router: Router,
  ) { }


  ngOnInit() {

    setTimeout(() => {
      // this.router.navigateByUrl('/home')
    }, 5000);

  }


}
