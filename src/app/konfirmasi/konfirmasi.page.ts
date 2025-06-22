  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';

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
    status: string;
    jenisLayanan: string;
    jam: Date; 
    statusPembayaran: 'belum dibayar' | 'sudah bayar';
// ✅ Tambahan jenis layanan
  }


  @Component({
    standalone: false,
    selector: 'app-konfirmasi',
    templateUrl: './konfirmasi.page.html',
    styleUrls: ['./konfirmasi.page.scss'],
  })
  export class KonfirmasiPage implements OnInit {
    pesanan: Pesanan | null = null;

    constructor(private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
      const nav = this.router.getCurrentNavigation();
      if (nav?.extras.state?.['pesanan']) {
        this.pesanan = nav.extras.state['pesanan'] as Pesanan;
        console.log('📦 Pesanan diterima:', this.pesanan);
      } else {
        // Cegah tampil ulang saat refresh
        this.pesanan = null;
      }
    }

    konfirmasiPesanan() {
      if (!this.pesanan) return;

      // Tambahkan status dan simpan ke localStorage
      const selesai = { ...this.pesanan, status: 'selesai' };
      const data = localStorage.getItem('pesananSelesai');
      console.log("bruh", data);
      const existing = data ? JSON.parse(data) : [];
      existing.push(selesai);
      localStorage.setItem('pesananSelesai', JSON.stringify(existing));

      // Bersihkan data setelah dikonfirmasi
      this.pesanan = null;

      // Navigasi ke halaman pesanan
      this.router.navigate(['/pesanan']);
    }
  }
