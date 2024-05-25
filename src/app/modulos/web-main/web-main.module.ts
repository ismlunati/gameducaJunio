import { NgModule } from "@angular/core";
import { MenuComponent } from "./menu/menu.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FooterComponent } from "./footer/footer.component";
import { MatDialogModule } from '@angular/material/dialog';
import { PerfilComponent } from "./perfil/perfil.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
    declarations: [
        MenuComponent,
        FooterComponent,
        PerfilComponent


    ],
    exports:[
        MenuComponent,
        FooterComponent,
        PerfilComponent


    ],
    imports:[
        CommonModule,
        RouterModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule


    ]
})
export class WebMainModule {}