import { NavService } from './../nav.service';
import { Usuario } from '../../usuario/model/Usuario.interface';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, Event  } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/modulos/usuario/auth.service';
import { UsuarioService } from 'src/app/modulos/usuario/usuario.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { PerfilComponent } from '../perfil/perfil.component';




@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['../web-main.component.css']
})
export class MenuComponent implements OnInit {

  user_name!:string;

  usuario$: Observable<Usuario | null>= of(null);

  selectedSubject: string = '';
  currentRoute: string = '';
  currentSubject: string='';

  visibleAsignatura:boolean=false;


  constructor(public service:UsuarioService,
    private router:Router, 
    private authService: AuthService,
    private navService: NavService,
    public dialog: MatDialog
    ) { }
  
  ngOnInit(): void {

    this.navService.getCurrentSubject().subscribe(response=>{
      this.currentSubject = response;
      console.log("Current Subject:", this.currentSubject);
    });


    console.log("Current Subject:", this.currentSubject);


    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        console.log("Ruta actual:", this.currentRoute);
      }
    });

    this.user_name= this.service.usuario?.nombreUsuario;
    this.usuario$ = this.authService.usuario$;
  }

  checkRoute(): boolean {
    const segments = this.currentRoute.split('/').filter(segment => segment); // Filtrar segmentos vacíos
    const hasAsignatura = segments.includes('asignaturas');
    const hasTwoOrMoreParams = segments.length >= 2; // La ruta raíz "/" cuenta como un segmento
    return hasAsignatura && hasTwoOrMoreParams;
  }


  cerrarSesion():void{
    this.user_name = this.service.usuario.nombreUsuario;
    console.log(this.user_name)

    this.authService.logout();
    Swal.fire('Logout',`${this.user_name}, has cerrado sesión con éxito`,'success');

    this.router.navigate(['/login']);

  }


  openDialog(): void {
    const dialogRef = this.dialog.open(PerfilComponent, {
      width: '70%',
      height:'70%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró');
    });
  }

  estaLogeado():boolean{

    if (this.authService.getUserFromSessionStorage()) {

      return true;
    } else {

      return false;
    }
  }


}
