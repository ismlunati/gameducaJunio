import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AsignaturaService } from 'src/app/modulos//asignatura/asignatura.service';
import { Tema } from 'src/app/modulos/tema/model/Tema';
import { AuthService } from 'src/app/modulos//usuario/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-temas',
  templateUrl: './listado-temas.component.html',
  styleUrls: ['../tema.component.css']
})
export class ListadoTemasComponent implements OnInit {

  navigationSubscription!: Subscription;
  id!: number;
  temas: Tema[] = [];

  constructor(private route: ActivatedRoute, private asignaturaService: AsignaturaService,
    private authService:AuthService , private router:Router) { }

  ngOnInit(): void {
    console.log("prueba", this.route.snapshot.parent?.paramMap.get('id'))
    
    this.id= +this.route.snapshot.parent?.paramMap.get('id')!;
    this.recargarTemas();
 
    
    this.navigationSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd && this.router.url.includes('/listado'))
    ).subscribe(() => {
      this.recargarTemas();
    });


  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  recargarTemas(){
    this.asignaturaService.getTemasPorAsignatura(this.id).subscribe(temas => {
      this.temas = temas;
    });
  }

  navegar(id: number) {
    this.router.navigate(['/asignaturas', this.id,'temas',id,'editar']);
  }


  borrarTema(tema: Tema): void {
    this.asignaturaService.borrarTema( this.id,tema.id).subscribe(
      res => {
        console.log('Asignatura borrada exitosamente');
        this.recargarTemas();
        Swal.fire('Borrar', `Se ha borrado el tema ${tema.nombre} con éxito`, 'success');

        // Actualiza tu vista o haz algo tras la eliminación de la asignatura
      },
      err => 
      {
        Swal.fire('Borrar', `No se ha podido borrar el tema ${tema.nombre} porque tiene preguntas relacionadas`, 'error');
        console.error('Error borrando la asignatura', err);
      }
    );
  }

  esProfesor():boolean{

    if (this.authService.getUserFromSessionStorage()?.roles[0].rolNombre== 'ROLE_ADMIN') {
      
      return true;
    } else {

      return false;
    }
  }

}
