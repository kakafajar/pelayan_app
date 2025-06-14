import { Component, OnInit } from '@angular/core';

interface Item {
  name: string;
  price: number;
  jumlah: number;
}

interface Pesanan {
  meja: string;
  nama: string;
  jumlahTamu: number;
  item: Item[];
  total: number;
  metode: string;
}

@Component({
  standalone: false,
  selector: 'app-pesanan',
  templateUrl: './pesanan.page.html',
  styleUrls: ['./pesanan.page.scss'],
})
export class PesananPage implements OnInit {
  daftarPesanan: Pesanan[] = [];

  ngOnInit() {
    const data = localStorage.getItem('pesananSelesai');
    this.daftarPesanan = data ? JSON.parse(data) : [];
  }
}
