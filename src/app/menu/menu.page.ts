import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MENU_ITEMS } from '../data/menu';
import { Params } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  nomorMeja: any;
  kategoriDipilih = 'special';
  jumlahDipilih: number = 0;
  totalHarga: number = 0;

  daftarMenu = MENU_ITEMS;
  filteredMenu = [...MENU_ITEMS];

  keranjang: any[] = [];
  daftarPesanan: any[] = [];


  metodePembayaran: string = '';


  // 🔽 Variabel untuk halaman Rincian Pesanan
  showRincianPesanan = false;
  showPesananAktif = true;

  
  kategoriPesanan: string = 'dinein';
  namaPelanggan = '';
  jumlahTamu = 2;

  constructor(private route: ActivatedRoute, private router: Router, private toastController: ToastController) {}



 tampilkanPesananAktif() {
  this.showRincianPesanan = false;
  this.showPesananAktif = true;

}

filterMenu() {
  const category = this.kategoriDipilih;
  this.filteredMenu = this.daftarMenu.filter(item => item.category === category);
}

pilihKategori(kat: string) {
  this.kategoriDipilih = kat;
  this.filterMenu();
}




  ngOnInit() {
  this.route.queryParams.subscribe((params: Params) => {
    this.nomorMeja = params['meja'];
    this.kategoriPesanan = params['jenisLayanan'];
    this.filterMenu();
  });
}

  // 🔍 Pencarian
  cariMenu(event: any) {
    const keyword = event.detail.value?.toLowerCase() || '';
    this.filteredMenu = this.daftarMenu.filter(item =>
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    );
  }

  // ➕ Tambah ke keranjang
  tambahKeKeranjang(item: any) {
    const index = this.keranjang.findIndex(i => i.id === item.id);
    if (index >= 0) {
      this.keranjang[index].jumlah += 1;
    } else {
      this.keranjang.push({ ...item, jumlah: 1 });
    }
    this.updateRingkasan();
  }

  // 🔄 Update ringkasan (jumlah & total)
  updateRingkasan() {
    this.jumlahDipilih = this.keranjang.reduce((sum, item) => sum + item.jumlah, 0);
    this.totalHarga = this.keranjang.reduce((sum, item) => sum + item.jumlah * item.price, 0);
  }

  // 👉 Lanjut ke rincian pesanan
  lanjutKeCheckout() {
    this.updateRingkasan();
    this.showRincianPesanan = true;
  }

  // ↩️ Kembali ke menu
  kembaliKeMenu() {
    this.showRincianPesanan = false;
  }

  // ➕➖ Ubah jumlah item di rincian
  ubahJumlah(item: any, perubahan: number) {
    const index = this.keranjang.findIndex(i => i.id === item.id);
    if (index >= 0) {
      this.keranjang[index].jumlah += perubahan;
      if (this.keranjang[index].jumlah < 1) {
        this.keranjang[index].jumlah = 1;
      }
      this.updateRingkasan();
    }
  }

  // 🗑️ Hapus item dari keranjang
  hapusItem(item: any) {
    const index = this.keranjang.findIndex(i => i.id === item.id);
    if (index >= 0) {
      this.keranjang.splice(index, 1);
    }
    this.updateRingkasan();
  }

  // 👤 Tambah/kurang tamu
  ubahJumlahTamu(delta: number) {
    this.jumlahTamu = Math.max(1, this.jumlahTamu + delta);
  }

  // ❌ Batalkan seluruh pesanan
  batalkanPesanan() {
    this.keranjang = [];
    this.namaPelanggan = '';
    this.jumlahTamu = 2;
    this.showRincianPesanan = false;
    this.updateRingkasan();
  }

  // 💾 Simpan pesanan
  // 💾 Simpan pesanan
async simpanPesanan() {
  if (!this.metodePembayaran) {
    const toast = await this.toastController.create({
      message: 'Silakan pilih metode pembayaran terlebih dahulu.',
      color: 'warning',
      duration: 2500,
      position: 'top',
      icon: 'alert-circle-outline',
    });
    await toast.present();
    return;
  }
const now = new Date();
const jam = now.toLocaleString('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

const dataPesanan = {
  meja: this.nomorMeja,
  nama: this.namaPelanggan,
  jumlahTamu: this.jumlahTamu,
  item: this.keranjang,
  total: this.totalHarga,
  metode: this.metodePembayaran,
  jenisLayanan: this.kategoriPesanan,
  jam: jam,
  statusPembayaran: 'Belum Bayar'
};


  console.log('✅ Pesanan disimpan:', dataPesanan);

  const toast = await this.toastController.create({
    message: 'Pesanan berhasil dikirim! Order #001235 telah masuk ke dapur.',
    color: 'success',
    duration: 3000,
    position: 'top',
    icon: 'checkmark-circle-outline',
  });

  await toast.present();

    // Simpan ke localStorage
  // console.log(dataPesanan);
  
  localStorage.setItem('pesananTerakhir', JSON.stringify(dataPesanan));

  // Navigasi ke halaman konfirmasi sambil mengirim data (optional: stringify jika objek besar)
  this.router.navigate(['/konfirmasi'], {
    queryParams: {
      meja: this.nomorMeja,
      metode: this.metodePembayaran,
      total: this.totalHarga,
      jenisLayanan:this.kategoriPesanan
    },
    state: { pesanan: dataPesanan } // cara kirim full object
  });
}

// Contoh fungsi ketika user bayar
tandaiSudahBayar() {
  const pesanan = JSON.parse(localStorage.getItem('pesananTerakhir') || '{}');
  if (pesanan) {
    pesanan.statusPembayaran = 'Sudah Bayar';
    localStorage.setItem('pesananTerakhir', JSON.stringify(pesanan));
    console.log('✅ Status pembayaran diperbarui ke Sudah Bayar');
  }
}




}