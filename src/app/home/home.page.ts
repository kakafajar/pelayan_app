import { Component } from '@angular/core';
import { Router, RouteReuseStrategy } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(
    private navCtrl: NavController,
    private router : Router
  ) {}

 bukaLayanan(jenis: string) {
    this.navCtrl.navigateForward(`/layanan/${jenis}`)
  }

  bukaNotifikasi() {
  this.router.navigate(['/konfirmasi']);
}


}
