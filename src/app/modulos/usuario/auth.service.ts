import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from './model/Usuario.interface';

interface RegisterResponse {
  token: string;
}


interface JwtDTO {
  token: string;
  authorities: string[];
  usuario: Usuario; // Mejoraría si definas una interfaz o clase para el usuario
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = 'http://localhost:8081/api/auth/';

  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.getUserFromSessionStorage());

  usuario$ = this.usuarioSubject.asObservable();



  getUserFromSessionStorage(): Usuario | null {
    const usuario = sessionStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }



  constructor(private http: HttpClient) {}

  register(formData: any) {
    return this.http.post<JwtDTO>(this.authUrl+"nuevo", formData)
     .pipe(
      map(res => {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('usuario', JSON.stringify(res.usuario));
        this.usuarioSubject.next(res.usuario);
      })
    );
  }



  
  login(formData: any): Observable<boolean> {

    console.log("estoy entrando en el service")


       return this.http.post<JwtDTO>(this.authUrl+"login", 
       formData)
    

        .pipe(
            map(result => {
                console.log(result.usuario.email);

                sessionStorage.setItem('usuario', JSON.stringify(result.usuario));

                sessionStorage.setItem('token', result.token);

                this.usuarioSubject.next(result.usuario);  // Emitir el nuevo estado del usuario
                return true;
            })
        );
}

logout():void{

  sessionStorage.clear();
  sessionStorage.clear();
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('usuario');
  this.usuarioSubject.next(null);
  console.log(sessionStorage.getItem('usuario'))
}


}
