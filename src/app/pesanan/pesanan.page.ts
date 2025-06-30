import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { TransaksiService } from '../service/transaksi.service';
import { AlertController } from '@ionic/angular';



@Component({
  standalone: false,
  selector: 'app-pesanan',
  templateUrl: './pesanan.page.html',
  styleUrls: ['./pesanan.page.scss'],
})
export class PesananPage implements OnInit {
  transaksiList : any[] = [];
    allTransaksi: any[] = []; 
  statusFilter: string = 'semua'; 

  constructor(
    private authService:AuthService,
    private transaksiService:TransaksiService,
    private alertController: AlertController
  ){}

  ngOnInit() {
    this.transaksiService.all()
    .subscribe(response=>{
      this.transaksiList.push(...response.data);
      console.log(response);
      
    })
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'proses': return 'warning';
      // case 'proses': return 'primary';
      case 'sudah': return 'success';
      // case 'bayar': return 'tertiary';
      default: return 'medium';
    }
  }

  logout(){
    this.authService.logout();
  }

  async editMeja(transaksi: any) {
  const alert = await this.alertController.create({
    header: 'Edit Meja',
    message: 'Apakah meja tersedia?',
    buttons: [
      {
        text: 'Tidak Tersedia',
        role: 'cancel'
        
      },
      {
        text: 'Tersedia'
        
      }
    ]
  });

  await alert.present();
}


hasFilteredTransaksi(): boolean {
  return this.transaksiList.some(t =>
    this.statusFilter === 'semua' ||
    t?.order?.status_order?.toLowerCase() === this.statusFilter
  );
}


}
