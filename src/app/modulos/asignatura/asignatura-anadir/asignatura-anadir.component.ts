import { Profesor } from '../../usuario/model/Profesor';
import { Component, OnInit } from '@angular/core';
import { AsignaturaService } from '../asignatura.service';
import { Asignatura } from '../model/asignatura';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignatura-anadir',
  templateUrl: './asignatura-anadir.component.html'})
export class AsignaturaAnadirComponent implements OnInit {

  asignaturaForm: UntypedFormGroup;
  crearEditar:string='Crear';
  idAsignatura:number | null = null;

  asignatura!: Asignatura;

  constructor(private fb: UntypedFormBuilder,private asignaturaService: AsignaturaService,
      private route: ActivatedRoute, private router: Router) {

    this.asignaturaForm = this.fb.group({
      nombre: '',
      descripcion: '',
      curso: ''
      // puedes agregar más controles de formularios aquí
    });
   }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idAsignatura = Number(params.get('id'));
      console.log("Este es el id", this.idAsignatura);
      if (this.idAsignatura) {
        // Aquí va la lógica si existe id
        console.log(`El id es ${this.idAsignatura}`);
        this.crearEditar="Editar"

        this.asignaturaService.getAsignaturaPorId(this.idAsignatura).subscribe(asignatura => {
          this.asignatura = asignatura;
  
          console.log("Procedo a imprimir los alumnos");
          console.log("Procedo a imprimir idAsignatura");
          console.log(asignatura);
          console.log(this.idAsignatura);

          this.asignaturaForm.patchValue({
            nombre: this.asignatura.nombre,
            descripcion: this.asignatura.descripcion,
            curso: this.asignatura.curso
          });
        });


      } else {
        // Aquí va la lógica si no existe id
        console.log('Es operacion /save');
      }
    });


  }

  metodoActualizarCrear():void{
    if(this.idAsignatura!==0){
      console.log("actualizar")
      this.actualizarAsignatura();

    }else {
      this.crearAsignatura()
      console.log("crearAsignatura")
    }

    
  }


  navegarAsignaturas(){
    this.router.navigate(['/asignaturas']);
  }

  crearAsignatura(): void {
    this.asignaturaService.crearAsignatura(this.asignaturaForm.value)
      .subscribe((asignaturaCreada: Asignatura) => {
        console.log('Asignatura creada', asignaturaCreada);
        this.navegarAsignaturas();
        Swal.fire('Asignatura', `Se ha creado la asignatura con exito`, 'success');

        // Aquí podrías redirigir al usuario, actualizar la lista de asignaturas, etc.
      });
  }


  actualizarAsignatura(): void {

    Object.assign(this.asignatura, this.asignaturaForm.value);


    this.asignaturaService.actualizarAsignatura(this.asignatura)
      .subscribe((asignaturaCreada: Asignatura) => {
        console.log('Asignatura actualizada', asignaturaCreada);
        this.navegarAsignaturas();
        Swal.fire('Asignatura', `Se ha actualizado la asignatura con exito`, 'success');


        // Aquí podrías redirigir al usuario, actualizar la lista de asignaturas, etc.
      });
  }

}
