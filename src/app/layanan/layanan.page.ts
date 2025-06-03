import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


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


  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.jenisLayanan = params['layanan'] || 'dinein';
    });
  }

}
