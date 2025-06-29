import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { TransaksiService } from '../service/transaksi.service';


@Component({
  standalone: false,
  selector: 'app-pesanan',
  templateUrl: './pesanan.page.html',
  styleUrls: ['./pesanan.page.scss'],
})
export class PesananPage implements OnInit {
  transaksiList : any[] = [];

  constructor(
    private authService:AuthService,
    private transaksiService:TransaksiService,
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

}
