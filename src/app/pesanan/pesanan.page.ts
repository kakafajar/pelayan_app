import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

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
  jenisLayanan: string;
  status:'selesai';
  jam: Date;
  statusPembayaran: 'belum dibayar' | 'sudah bayar';
}

@Component({
  standalone: false,
  selector: 'app-pesanan',
  templateUrl: './pesanan.page.html',
  styleUrls: ['./pesanan.page.scss'],
})
export class PesananPage implements OnInit {
  daftarPesanan: Pesanan[] = [];

  constructor(
    private authService:AuthService
  ){}

  ngOnInit() {
    const data = localStorage.getItem('pesananSelesai');
    this.daftarPesanan = data ? JSON.parse(data) : [];
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'menunggu': return 'warning';
      case 'memasak': return 'primary';
      case 'siap': return 'success';
      case 'bayar': return 'tertiary';
      default: return 'medium';
    }
  }

  logout(){
    this.authService.logout();
  }

}
