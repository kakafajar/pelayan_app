import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  standalone:false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(
    private alertController: AlertController, 
    private router: Router,
    private authService : AuthService,
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nipRegex = /^\d{8,12}$/;

    if (!this.username || !this.password) {
      await this.showAlert('Login Gagal', 'Username dan password wajib diisi.');
      return;
    }

    if (!emailRegex.test(this.username)) {
      await this.showAlert('Format Salah', 'Username harus berupa email.');
      return;
    }

    // if (!nipRegex.test(this.password)) {
    //   await this.showAlert('Format Salah', 'Password harus berupa NIP (8–12 digit angka).');
    //   return;
    // }

    this.authService.login(
      this.username,
      this.password
    ).subscribe(async response=>{
      localStorage.setItem("token", response.data.token);
      this.authService.refreshUserInStorage(response.data.user);

      await this.showAlert('Login Berhasil', 'Selamat datang kembali!');
      this.router.navigate(['/home']);
      
    }, async error=>{
      console.log(error);
      await this.showAlert('Login Gagal', error.text);
    })

  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
