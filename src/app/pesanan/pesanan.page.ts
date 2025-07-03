import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { TransaksiService } from '../service/transaksi.service';
import { AlertController } from '@ionic/angular';
import { OrderService } from '../service/order.service';



@Component({
  standalone: false,
  selector: 'app-pesanan',
  templateUrl: './pesanan.page.html',
  styleUrls: ['./pesanan.page.scss'],
})
export class PesananPage implements OnInit {
  transaksiList : any[] = [];
  statusFilter: string = 'semua'; 

  constructor(
    private alertController: AlertController,

    private authService:AuthService,
    private transaksiService:TransaksiService,
    // private mejaService:MejaService,
    private orderService:OrderService
  ){}

  ngOnInit() {
    this.transaksiService.all()
    .subscribe(response=>{
      this.transaksiList.push(...response.data);
      // console.log(response.data);
      
    })
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'proses': return 'warning';
      // case 'proses': return 'primary';
      case 'sudah dibuat': return 'success';
      case 'selesai': return 'primary';
      // case 'bayar': return 'tertiary';
      default: return 'medium';
    }
  }

  logout(){
    this.authService.logout();
  }

  async finishOrder(transaksi_index: any) {
    const alert = await this.alertController.create({
      header: 'Finish Order',
      message: 'Apakah Meja sudah tersedia?',
      buttons: [
        {
          text: 'Belum',
          role: 'cancel'
        },
        {
          text: 'Sudah',
          handler: ()=>{
            this.orderService.update(this.transaksiList[transaksi_index].order.id, {
              status_order : "selesai"
            })
            .subscribe((response)=>{
              // console.log(response);
              
              ;this.transaksiList[transaksi_index].order.status_order = response.data.status_order;
            }, error=>{
              console.log(error);
              
            });
          }
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
