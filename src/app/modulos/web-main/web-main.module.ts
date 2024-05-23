import { NgModule } from "@angular/core";
import { MenuComponent } from "./menu/menu.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FooterComponent } from "./footer/footer.component";

@NgModule({
    declarations: [
        MenuComponent,
        FooterComponent,


    ],
    exports:[
        MenuComponent,
        FooterComponent,


    ],
    imports:[
        CommonModule,
        RouterModule

    ]

})
export class WebMainModule {}