import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/modules/shared/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', 
  '../../../../../../assets/fonts/iconic/css/material-design-iconic-font.css']
})
export class LoginComponent implements OnInit {


  formularioLogin:FormGroup=new FormGroup({
    usuario:new FormControl('',[Validators.required, Validators.email]),
    contrasena: new FormControl('',[Validators.required])
  });

  constructor(private servicioLogin: LoginService) { }

  ngOnInit(): void {
  }

  login(){
          this.servicioLogin.loguearse(this.formularioLogin.value.usuario, this.formularioLogin.value.contrasena);
  }

}
