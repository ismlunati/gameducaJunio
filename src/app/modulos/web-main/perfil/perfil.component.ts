import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { AsignaturaService } from '../../asignatura/asignatura.service';
import { Asignatura } from '../../asignatura/model/asignatura';
import { NavService } from '../nav.service';
import { Perfil } from '../model/perfil.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {

  asignaturas: Asignatura[] = [];
  asignaturaSeleccionada:number=0;
  perfil:Perfil | null=null;
  perfilForm: FormGroup;

  base64Image: string | undefined;
  selectedFile: File | null = null;

  constructor(public dialogRef: MatDialogRef<PerfilComponent>,
    private asignaturaService: AsignaturaService,
    private navService: NavService,
    private fb: FormBuilder
  ){

    this.perfilForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      nombreReal: ['', Validators.required],
      puntos: [{ value: '', disabled: true }],
      listaLogros: [''],
      listaArtefactos:['']
    });

  }


  ngOnInit(): void {

    this.asignaturaService.getAsignaturas().subscribe(asignaturas => {
      this.asignaturas = asignaturas;
      console.log("procedo a imprimir las asignaturas",this.asignaturas);
      //console.log("Estoy imprimiendo el valor de alumno", this.alumno);
    });
    
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  cambiarFotoPerfil() {
    const input = document.getElementById('fotoPerfil') as HTMLInputElement;
    input.click();
  }

  buscarPerfil() {
    if (this.asignaturaSeleccionada) {
      console.log('Buscando perfil para la asignatura:', this.asignaturaSeleccionada);
      this.navService.getPerfil(this.asignaturaSeleccionada).subscribe(perfil=>{
        this.perfil= perfil;

        console.log("perfil obtenido", perfil)
        this.perfilForm.patchValue({
          nombreUsuario: this.perfil.nombreUsuario,
          nombreReal: this.perfil.nombreReal,
          puntos: this.perfil.puntos,
          listaLogros: this.perfil.listaLogros,
          listaArtefactos: this.perfil.listaArtefactos
        });


        console.log("perfilFormPatched", this.perfilForm.value)

      })
      // Aquí iría tu lógica de búsqueda
    } else {
      console.log('Por favor, selecciona una asignatura.');
    }
  }


  guardarPerfil(){

    const nombreUsuario = this.perfilForm.get('nombreUsuario')?.value;
    const nombreReal = this.perfilForm.get('nombreReal')?.value;

    this.navService.editarPerfil(this.asignaturaSeleccionada, nombreUsuario, nombreReal ).subscribe(res=>{
      console.log("perfil actualizado", res);
    })
  }



  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.base64Image = reader.result as string;
      };
    }
  }
}
