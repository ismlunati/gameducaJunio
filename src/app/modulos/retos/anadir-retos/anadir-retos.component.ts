import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AsignaturaService } from 'src/app/modulos//asignatura/asignatura.service';
import { AuthService } from 'src/app/modulos//usuario/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Reto } from 'src/app/modulos/retos/model/Reto';
import { Asignatura } from 'src/app/modulos/asignatura/model/asignatura';
import { Logro } from 'src/app/modulos/logros/model/Logro';
import moment from 'moment';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-anadir-retos',
  templateUrl: './anadir-retos.component.html'
})
export class AnadirRetosComponent implements OnInit {

  retoForm!: UntypedFormGroup;
  crearEditar:string='Crear';
  logrosAsignatura!: Logro[];
  idAsignatura: number | null = null;

  idReto: number | null = null;

  reto!: Reto;
  asignatura!: Asignatura;

  constructor(private fb: UntypedFormBuilder, private asignaturaService: AsignaturaService,
    private route: ActivatedRoute, private authService: AuthService, private router: Router) {

    // this.retoForm = this.fb.group({
    //   nombre: [''],
    //   descripcion: [''],
    //   puntosOtorgados: [''],
    //   temporal: [false],
    //   fechaInicio: [{value: '', disabled: true}],
    //   fechaFin: [{value: '', disabled: true}],
    //   logro: ['']
    // });
    // puedes agregar más controles de formularios aquí
  }

  ngOnInit(): void {
    //this.route.snapshot.parent?.paramMap.get('id')

    const esAlumno=!this.esProfesor();

    this.retoForm = this.fb.group({
      nombre: new UntypedFormControl({ value: '', disabled: esAlumno }),
      descripcion: new UntypedFormControl({ value: '', disabled: esAlumno }),
      puntosOtorgados: new UntypedFormControl({ value: '', disabled: esAlumno }),
      temporal: new UntypedFormControl({ value: false, disabled: esAlumno }),
      fechaInicio: new UntypedFormControl({ value: '', disabled: true }),
      fechaFin: new UntypedFormControl({ value: '', disabled: true }),
      logro: new UntypedFormControl({ value: '', disabled: esAlumno })
    });

    this.idAsignatura = +this.route.snapshot.parent?.paramMap.get('id')!;

    this.idReto = +this.route.snapshot?.paramMap.get('id')!;
    console.log("Este es el id", this.idAsignatura);

    console.log("Este es el id del reto", this.idReto);

    this.asignaturaService.getLogrosPorAsignatura(this.idAsignatura).subscribe(logros => {
      this.logrosAsignatura = logros;
      console.log("Estos son los logros disponibles", logros);
      console.log("logro de prueba:", logros[0]);

    });

    if (this.idReto !== 0) {
      // Aquí va la lógica si existe id
      console.log(`El id es ${this.idAsignatura}`);

      this.crearEditar=this.esProfesor()?"Editar":'';



      forkJoin({
        reto: this.asignaturaService.getRetoPorId(this.idAsignatura, this.idReto),
        logros: this.asignaturaService.getLogrosPorAsignatura(this.idAsignatura)
      }).subscribe(({ reto, logros }) => {
        this.reto = reto;
        this.logrosAsignatura = logros;
    
        console.log("ESTE ES EL RETO", reto);
        console.log(this.logrosAsignatura);
        console.log(moment(this.reto.fechaInicio).format('YYYY-MM-DD'))
        this.retoForm.patchValue({
          nombre: this.reto.nombre,
          descripcion: this.reto.descripcion,
          puntosOtorgados: this.reto.puntosOtorgados,
          temporal: this.reto.temporal,
          logro: this.logrosAsignatura.find(l => l.id === this.reto.logro.id),
          fechaInicio:  this.reto.temporal? moment(this.reto.fechaInicio).format('YYYY-MM-DD') :'',
          fechaFin: this.reto.temporal? moment(this.reto.fechaFin).format('YYYY-MM-DD'):'' 
        });


        console.log("retoforma", this.retoForm);
      });













      // this.asignaturaService.getRetoPorId(this.idAsignatura, this.idReto).subscribe(reto => {
      //   this.reto = reto;


      //   console.log("ESTE ES EL RETO", reto);
      //   console.log(this.logrosAsignatura);
      //   console.log(moment(this.reto.fechaInicio).format('YYYY-MM-DD'))
      //   this.retoForm.patchValue({
      //     nombre: this.reto.nombre,
      //     descripcion: this.reto.descripcion,
      //     puntosOtorgados: this.reto.puntosOtorgados,
      //     temporal: this.reto.temporal,
      //     automatico: this.reto.automatico,
      //     logro: this.logrosAsignatura.find(l => l.id === this.reto.logro.id),
      //     fechaInicio:  this.reto.temporal? moment(this.reto.fechaInicio).format('YYYY-MM-DD') :'',
      //     fechaFin: this.reto.temporal? moment(this.reto.fechaFin).format('YYYY-MM-DD'):'' 
      //   });

        
      // });

      console.log("fecha prueba",this.reto)


    } else {
      // Aquí va la lógica si no existe id
      console.log('Es operacion /save');
    }




    this.retoForm.get('temporal')?.valueChanges.subscribe(temporal => {
      if (temporal) {
        this.retoForm.get('fechaInicio')?.enable();
        this.retoForm.get('fechaFin')?.enable();
      } else {
        this.retoForm.get('fechaInicio')?.disable();
        this.retoForm.get('fechaFin')?.disable();
      }
    });


  }

  metodoActualizarCrear(): void {
    if (this.idReto !== 0) {
      console.log("actualizar", this.retoForm.value)
      this.actualizarReto();

    } else {

      this.crearReto()
      console.log("crearReto", this.retoForm.value)
    }

  }


  navegarListadoRetos(){
    this.router.navigate(['/asignaturas',this.idAsignatura,'retos','listado']);

  }

  crearReto(): void {
    this.asignaturaService.crearReto(this.retoForm.value, this.idAsignatura!)
      .subscribe((retoCreado: Reto) => {
        console.log('Reto creada', retoCreado);
        Swal.fire('Reto', `Se ha creado el reto con exito`, 'success');
        this.navegarListadoRetos();


        // Aquí podrías redirigir al usuario, actualizar la lista de asignaturas, etc.
      });
  }


  actualizarReto(): void {
    console.log("actualizando");
    Object.assign(this.reto, this.retoForm.value);


    this.asignaturaService.actualizarReto(this.reto, this.idAsignatura!)
      .subscribe((retoCreado: Reto) => {
        console.log('Reto actualizado', retoCreado);
        Swal.fire('Reto', `Se ha actualizado el reto con exito`, 'success');
        this.navegarListadoRetos();

        // Aquí podrías redirigir al usuario, actualizar la lista de asignaturas, etc.
      });
  }

  esProfesor(): boolean {

    if (this.authService.getUserFromSessionStorage()?.roles[0].rolNombre == 'ROLE_ADMIN') {

      return true;
    } else {

      return false;
    }
  }

}
