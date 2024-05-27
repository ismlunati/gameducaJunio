import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadisticasService } from '../estadisticas.service';
import { TierList } from '../model/TierList';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { InformacionEnum } from '../model/InformacionEnum';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tier-list',
  templateUrl: './tier-list.component.html',
  styleUrl: '../styles.css'
})
export class TierListComponent implements OnInit{

  idAsignatura!:number;

  listaTiers!:TierList[];

  constructor(private estadisticaService: EstadisticasService, private route: ActivatedRoute, private router: Router, private dialog:MatDialog) {
    this.idAsignatura= +this.route.snapshot.parent?.paramMap.get('id')!;


  }

  ngOnInit(): void {
    this.idAsignatura= +this.route.snapshot.parent?.paramMap.get('id')!;

    this.estadisticaService.getTierList(this.idAsignatura).subscribe(response=>{


      this.listaTiers= response;

      console.log("impriendo lista de tiers", this.listaTiers);


    })

  }


  navegar(id: number) {
    console.log("Navegando");
    this.router.navigate(['/asignaturas', this.idAsignatura, 'estadisticas', id, 'configurarTierList']);
  }


  openInfoDialog() {
    this.dialog.open(InfoDialogComponent, {
      data: {
        message: InformacionEnum.ListaTierList
      }
    });
  }

}
