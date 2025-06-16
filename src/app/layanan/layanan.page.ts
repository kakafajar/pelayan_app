import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  standalone:false,
  selector: 'app-layanan',
  templateUrl: './layanan.page.html',
  styleUrls: ['./layanan.page.scss'],
})
export class LayananPage implements OnInit {

  jenisLayanan: string = '';

   daftarMeja = [
    { nomor: '01', status: 'tersedia' },
    { nomor: '02', status: 'terisi' },
    { nomor: '03', status: 'reservasi' },
    { nomor: '04', status: 'tersedia' },
    { nomor: '05', status: 'tersedia' },
    { nomor: '06', status: 'cleaning' }
  ];

    selectedMeja: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.jenisLayanan = this.route.snapshot.paramMap.get('jenis')!;
  }

    pilihMeja(meja: any) {
    if (meja.status === 'tersedia') {
      this.router.navigate(['/menu'], { queryParams: { meja: meja.nomor } });
    }
  }

    onSelectMeja(meja: any) {
    if (meja.status === 'tersedia') {
      this.selectedMeja = meja.nomor;
    }
  }

tambahMeja() {
    if (this.selectedMeja) {
      this.router.navigate(['/menu'], {
        queryParams: { meja: this.selectedMeja }
      });
    } else {
      alert('Silakan pilih meja terlebih dahulu');
    }
  }
  
masukKeMenuLangsung() {
  localStorage.setItem('orderType', 'takeaway');
  localStorage.removeItem('table'); // karena gak pilih meja
  this.router.navigate(['/menu']);
}


}
