import { Component, OnInit } from '@angular/core';
import { Router, RouteReuseStrategy } from '@angular/router';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { NavController } from '@ionic/angular';
import { AuthService } from '../service/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit{
  username:string|null="";
  greeting: string = '';

  constructor(
    private navCtrl: NavController,
    private router : Router,

    private authService:AuthService
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem("username");
    this.setGreeting();

    // Optional: update setiap menit agar real-time
    setInterval(() => {
      this.setGreeting();
    }, 60000); // 60 detik
  }


 bukaLayanan(jenis: string) {
    this.navCtrl.navigateForward(`/layanan/${jenis}`)
  }

  bukaNotifikasi() {
  this.router.navigate(['/konfirmasi']);
}

setGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      this.greeting = 'Selamat Pagi';
    } else if (hour >= 12 && hour < 15) {
      this.greeting = 'Selamat Siang';
    } else if (hour >= 15 && hour < 18) {
      this.greeting = 'Selamat Sore';
    } else {
      this.greeting = 'Selamat Malam';
    }
  }

}
async mulaiScan() {
  try {
    const result = await BarcodeScanner.scan();
    
    if (result?.barcodes?.length > 0) {
      const scannedValue = result.barcodes[0].rawValue;
      console.log('Barcode ditemukan:', scannedValue);
      alert('Hasil Scan: ' + scannedValue);
    } else {
      alert('Tidak ada barcode terdeteksi.');
    }
  } catch (err) {
    console.error('Gagal scan barcode:', err);
    alert('Terjadi kesalahan saat scanning');
  }
}

  logout(){
    this.authService.logout();
  }

}
