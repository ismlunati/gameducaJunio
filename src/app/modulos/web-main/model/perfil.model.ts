import { Artefacto } from "../../artefactos/model/Artefacto";
import { Logro } from "../../logros/model/Logro";

export interface Perfil{

    idAlumno:number,
    nombreUsuario:string,
    nombreReal:string,
    puntos:number;
    listaLogros:Logro[],
    listaArtefactos:Artefacto[],
    imagen:string | undefined;

}