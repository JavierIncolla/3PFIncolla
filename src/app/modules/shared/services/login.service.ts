import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import { Alumno } from '../models/alumno';
import { Usuario } from '../models/usuario';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly mockapi_URL = 'https://626988bdf2c0cdabac100e2a.mockapi.io/ApiRest/';
  private usuarioLogueado?: Usuario;
  private sesionActiva = false;
  private perfilSession:number=0;

  constructor(private http:HttpClient,private servicioUsuario:UsuarioService,private router: Router) { }
  
  private manejoError(error: HttpErrorResponse){
    if(error.error instanceof ErrorEvent){
      console.warn('Error en el frontend:', error.error.message)
    }else{
      console.warn('Error en el backend', error.status, error.message)
    }

    return throwError(() => 'Error de comunicación HTTP');
    
  }

  authUsuario(usuario:string,contrasena:string)
  {
    // let lista =this.http.get<Alumno[]>(`${this.mockapi_URL}/usuario`, {
    //   headers: new HttpHeaders({
    //     'content-type': 'application/json'
    //   })
    // }).pipe(catchError(this.manejoError)).subscribe((data)=>{
     
      // let user = data.find(x=>x.email==usuario && x.contrasena==contrasena);
      // console.log(user);
      // if (user!=null)
      // {
      //   // if (user.perfil==1)  //1 => Administrador
      //   // {
      //   //   console.log("ingreso al login");
      //     this.usuarioLogueado=user;
      //     this.setearUsuarioActual(user);
      //   //}
      // }
      
    //});

    this.login(usuario,contrasena).subscribe((data)=>{
      console.log(data);
      if (data!=null)
      {
        this.usuarioLogueado=data[0];
        this.verificarPerfilUsuario(data, usuario, contrasena);
      }
    });

  }

  login(usuario:string,contrasena:string)
  {
    return this.http.get<Usuario[]>(`${this.mockapi_URL}/usuario`).pipe(
      map((usuarios: Usuario[]) => {
        return usuarios.filter(u => u.email == usuario && u.contrasena == contrasena)
      })
    )
  }

  verificarPerfilUsuario(user:Usuario[],usuario:string,contrasena:string)
  {
    let usr=user.find(x=>x.email==usuario && x.contrasena==contrasena);
    if (usr!=null)
    {
      if ((usr.perfil==1) || (usr.perfil==2) || (usr.perfil==4)) // 1 = Administrador, 4 = Usuario
      {
        console.log(usr);
        this.setearUsuarioActual(usr);
      }
    }
    return usr;
  }


  loguearse(usuario:string,contrasena:string)
  {
    this.authUsuario(usuario,contrasena)
  }

  cerrarSesion()
  {
    this.usuarioLogueado = undefined;
    this.perfilSession=0;
    this.sesionActiva=false;
    this.router.navigate(['login']).then((r) => false);
  }
  
  setearUsuarioActual(usuario: Usuario){    
    this.usuarioLogueado = usuario;
    this.perfilSession=usuario.perfil;
    this.sesionActiva=true;
    this.router.navigate(['Alumnos']);
  }

  obtenerUsuarioActual(){
    return this.usuarioLogueado;
  }

  obtenerSesionActiva(){
    return this.sesionActiva;
  }
  obtenerRolActivo(){
    return this.perfilSession;
  }
}
