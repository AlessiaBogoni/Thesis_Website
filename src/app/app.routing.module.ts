import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AnalyticsPage } from "./pages/analytics.page";
import { AnalyticsTabulatorPage } from './pages/analytics.tabulator.page';
import { GameComponent } from "./pages/game.component";
import { ScoringInstructionsComponent } from "./pages/scoring-instructions.component";


const routes: Routes = [
  { path: "analytics", component: AnalyticsPage },
  { path: "analyticstabulator", component: AnalyticsTabulatorPage},
  { path: "", component: GameComponent},
  { path: 'scoring-details', component: ScoringInstructionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    scrollPositionRestoration: 'top', 
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
