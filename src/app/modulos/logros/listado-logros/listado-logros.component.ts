import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AsignaturaService } from 'src/app/modulos//asignatura/asignatura.service';
import { Artefacto } from 'src/app/modulos/artefactos/model/Artefacto';
import { Logro } from 'src/app/modulos/logros/model/Logro';
import { AuthService } from 'src/app/modulos//usuario/auth.service';
import { Subscription } from 'rxjs';
import { ArtefactoLogro } from '../../artefactos/model/ArtefactoLogro';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-logros',
  templateUrl: './listado-logros.component.html',
  styleUrls: ['../logros.component.css']

})
export class ListadoLogrosComponent implements OnInit {

  navigationSubscription!: Subscription;
  id!: number;
  logros: Logro[] = [];
  artefactos: Artefacto[] = [];


  constructor(private route: ActivatedRoute, private asignaturaService: AsignaturaService,
    private authService:AuthService, private router:Router) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.parent?.paramMap.get('id')!;
    this.loadLogros();

    this.navigationSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd && this.router.url.includes('/listado'))
    ).subscribe(() => {
      this.loadLogros();
    });
   

  }
  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  loadLogros(): void {
    this.asignaturaService.getLogrosPorAsignatura(this.id).subscribe(logros => {
      this.logros = logros;
      console.log("procedo a imprimir los logros", this.logros);
    });
  }


  getNombreArtefacto(artefactoId: number): string {
    const artefacto = this.artefactos.find(a => a.id === artefactoId);
    console.log("id del artefacto del logro", artefactoId)
    return artefacto ? artefacto.nombre : 'Artefacto no encontrado';
  }


  navegar(id: number) {
    this.router.navigate(['/asignaturas', this.id,'logros',id,'editar']);
  }


  borrarLogro(logro: Logro): void {
    this.asignaturaService.borrarLogro(logro.id, this.id).subscribe(
      res => {
        Swal.fire('Borrado', `Se ha borrado el logro ${logro.nombre} con exito`, 'success');

        console.log('Logro borrada exitosamente');
        // Actualiza tu vista o haz algo tras la eliminación de la asignatura
      },
      err => {
        Swal.fire('Borrado', `Ha ocurrido un error borrando el logro ${logro.nombre} `, 'error');

      }
    );
  }

  getDesbloquearObtener(artefactoLogros: ArtefactoLogro): string {
    if (artefactoLogros?.desbloquear) {
      return 'Desbloquear';
    } else if (artefactoLogros?.obtener) {
      return 'Obtener';
    } else {
      return 'No procede';
    }
  }

  esProfesor():boolean{

    if (this.authService.getUserFromSessionStorage()?.roles[0].rolNombre== 'ROLE_ADMIN') {
      
      return true;
    } else {

      return false;
    }
  }

}
