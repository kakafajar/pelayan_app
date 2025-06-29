import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { MenuService } from '../service/menu.service';
import { SingletonService } from '../service/singleton.service';
import { KategoriService } from '../service/kategori.service';
import { OrderService } from '../service/order.service';
import { OrderDetailService } from '../service/order-detail.service';
import { TransaksiService } from '../service/transaksi.service';
import { lastValueFrom } from 'rxjs';


interface cartItem{
  menu:any;
  jumlah:number;
}

@Component({
  standalone: false,
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  kategoriDipilih = 'special';
  totalHarga: number = 0;

  searchTerm :string="";

  kategoriList:any[]=[];
  selectedMeja :any;

  menuList:any[]=[];
  menuFilteredIds:any[]=[];

  cartList: {[index:string]:cartItem}= {};
  cartTotalCount:number=0;
  metodePembayaran: string = '';

  // 🔽 Variabel untuk halaman Rincian Pesanan
  showRincianPesanan = false;
  showPesananAktif = true;
  
  jenisLayanan:string="";

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private toastController: ToastController,
    private ngZone:NgZone,

    private menuService: MenuService,
    private kategoriService: KategoriService,
    private orderService:OrderService,
    private orderDetailService:OrderDetailService,
    private transaksiService:TransaksiService,
    private singletonService:SingletonService
  ) {}

  ngOnInit() {
    this.jenisLayanan = this.singletonService.temps["jenisLayanan"];
    this.selectedMeja = this.singletonService.temps['selectedMeja'];
    this.singletonService.clearTemps();

    this.ngZone.run(()=>{
      this.menuService.all()
      .subscribe(response=>{
        this.menuList.push(...response.data);
      })
  
      this.kategoriService.all()
      .subscribe(response=>{
        this.kategoriList.push(...response.data);
      })
    })
  }

  tampilkanPesananAktif() {
    this.showRincianPesanan = false;
    this.showPesananAktif = true;
  }

  filterMenu() {
    const category = this.kategoriDipilih;
    // this.filteredMenu = this.daftarMenu.filter(item => item.category === category);
  }

  pilihKategori(kat: string) {
    this.kategoriDipilih = kat;
    this.filterMenu();
  }

  // 🔍 Pencarian
  cariMenu(event: any) {
    this.searchTerm = event.target.value?.toLowerCase() || '';
    this.menuFilteredIds = [];
    this.menuList.forEach((menu)=>{
      if(menu.nama_menu.toLowerCase().includes(this.searchTerm)){
        this.menuFilteredIds.push(menu.id);
        
      }
    });
  }

  // ➕ Tambah ke keranjang
  tambahKeKeranjang(menu: any) {
    if (this.cartList.hasOwnProperty(menu.id)){
      this.cartList[menu.id].jumlah += 1;
      this.cartTotalCount += 1;
    }else{
      this.cartList[menu.id] = {menu: menu, jumlah: 1};
      this.cartTotalCount = 1;
    }
    this.updateRingkasan();
  }

  // 🔄 Update ringkasan (jumlah & total)
  updateRingkasan() {
    this.totalHarga = 0;
    for (let key in this.cartList){
      this.totalHarga += this.cartList[key].menu.harga_menu * this.cartList[key].jumlah;
    }
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
  ubahJumlah(menu_id: any, perubahan: number) {
    this.cartList[menu_id].jumlah += perubahan;
    this.updateRingkasan();
  }

  // 🗑️ Hapus item dari keranjang
  hapusItem(menu_id: any) {
    delete this.cartList[menu_id];
    this.updateRingkasan();
  }

  // 👤 Tambah/kurang tamu
  ubahJumlahTamu(delta: number) {
    // this.jumlahTamu = Math.max(1, this.jumlahTamu + delta);
  }

  // ❌ Batalkan seluruh pesanan
  batalkanPesanan() {
    this.cartList = {};
    this.cartTotalCount = 0;
    this.totalHarga = 0;
    this.showRincianPesanan = false;
    // this.updateRingkasan();
  }

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
    
    try{
      let order:any;
      const orderRequest$ = this.orderService.create({
        user_id : localStorage.getItem("user_id"),
        jenis_order: this.jenisLayanan
      });
      
      await lastValueFrom(orderRequest$).then(response=>{
        order = response.data;
      });

      // creatine order detail
      for (let key in this.cartList){
        const item = this.cartList[key]
        const orderDetail$ = this.orderDetailService.create({
          order_id : order.id,
          menu_id : item.menu.id,
          jumlah : item.jumlah
        });
        
        await lastValueFrom(orderDetail$).catch(error=>{
          console.log(error);
        });
      }

      let transaksi:any;
      const transaksi$ = this.transaksiService.create({
        user_id : localStorage.getItem("user_id"),
        order_id : order.id,
        metode_pembayaran: this.metodePembayaran,
        total_harga : this.totalHarga
      });

      await lastValueFrom(transaksi$).then(response=>{
        transaksi = response.data;
      }).catch(error=>{
        console.log(error);
      });

      const toast = await this.toastController.create({
        message: 'Pesanan berhasil dikirim! Order #001235 telah masuk ke dapur.',
        color: 'success',
        duration: 3000,
        position: 'top',
        icon: 'checkmark-circle-outline',
      });

      await toast.present();

      this.singletonService.temps = {
        lastTransaksi : transaksi
      }
      this.router.navigate(['/konfirmasi']);
    }
    catch(error){
      alert(error);
      console.log(error);
    }
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