import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "home",
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "solicitudes",
    loadChildren: () =>
      import("./solicitudes/solicitudes-tab/solicitudes-tab.module").then(
        (m) => m.SolicitudesTabPageModule
      ),
  },
  {
    path: "autotirzaciones",
    loadChildren: () =>
      import(
        "./autorizaciones/autotirzaciones-tab/autotirzaciones-tab.module"
      ).then((m) => m.AutotirzacionesTabPageModule),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./@auth/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "sign-up",
    loadChildren: () =>
      import("./@auth/sign-up/sign-up.module").then((m) => m.SignUpPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: "legacy",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
