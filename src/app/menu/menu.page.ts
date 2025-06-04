import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  standalone: false,
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
nomorMeja: any;
  kategoriDipilih = 'makanan';
  jumlahDipilih: number = 0;
  totalHarga: number = 0;
  keranjang: any[] = [];

  // ✅ Tambahkan daftar menu di sini
  daftarMenu = [
    {
      id: 1,
      nama: 'Nasi Goreng Spesial',
      deskripsi: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
      harga: 25000
    },
    {
      id: 2,
      nama: 'Ayam Bakar Madu',
      deskripsi: 'Ayam bakar dengan bumbu madu dan rempah pilihan',
      harga: 35000
    },
    {
      id: 3,
      nama: 'Gado-Gado Jakarta',
      deskripsi: 'Sayuran segar dengan bumbu kacang khas Jakarta',
      harga: 20000
    },
    {
      id: 4,
      nama: 'Soto Ayam Lamongan',
      deskripsi: 'Soto ayam dengan kuah bening dan rempah tradisional',
      harga: 18000
    },
    {
      id: 5,
      nama: 'Rendang Daging',
      deskripsi: 'Daging sapi dengan bumbu rendang khas Padang',
      harga: 28000
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.nomorMeja = params['meja'];
    });
  }

  tambahKeKeranjang(item: any) {
    const index = this.keranjang.findIndex(i => i.id === item.id);
    if (index >= 0) {
      this.keranjang[index].jumlah += 1;
    } else {
      this.keranjang.push({ ...item, jumlah: 1 });
    }
    this.updateRingkasan();
  }

  updateRingkasan() {
    this.jumlahDipilih = this.keranjang.reduce((sum, item) => sum + item.jumlah, 0);
    this.totalHarga = this.keranjang.reduce((sum, item) => sum + item.jumlah * item.harga, 0);
  }
   lanjutKeCheckout() {
    // Misalnya navigasi ke halaman checkout
    this.router.navigate(['/checkout'], {
      queryParams: {
        meja: this.nomorMeja,
        total: this.totalHarga,
        item: this.jumlahDipilih
      }
    });
  }
}
