import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SolicitudesTabPage } from "./solicitudes-tab.page";

const routes: Routes = [
  {
    path: "",
    component: SolicitudesTabPage,
    children: [
      {
        path: "pendientes",
        loadChildren: () =>
          import("../pendientes/pendientes.module").then(
            (m) => m.PendientesPageModule
          ),
      },

      {
        path: "",
        redirectTo: "/solicitudes/pendientes",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "create",
    loadChildren: () =>
      import("../create-solicitud/create-solicitud.module").then(
        (m) => m.CreateSolicitudPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudesTabPageRoutingModule {}
