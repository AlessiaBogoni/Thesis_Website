import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app.routing.module";
import { AppComponent } from "./app.component";
import { SurveyComponent } from "./components/survey.component";
import { SurveyAnalyticsComponent } from "./components/survey.analytics.component";
import { SurveyAnalyticsTabulatorComponent } from "./components/survey.analytics.tabulator";
import { SurveyAnalyticsDatatablesComponent } from "./components/survey.analytics.datatables";

import { AnalyticsPage } from "./pages/analytics.page";
import { AnalyticsTabulatorPage } from "./pages/analytics.tabulator.page";

import { SurveyModule } from "survey-angular-ui";
import { SurveyCreatorModule } from "survey-creator-angular";
import { GameComponent } from "./pages/game.component";
import { AngularD3CloudModule } from "angular-d3-cloud";
import { TextHighlightComponent } from "./pages/text-higlighter/text-highlight.component";
import { ToastComponent } from "./pages/toast/toast.component";
import { CstService } from "./pages/cst/cst.service";
import { CstTrackerDirective } from "./pages/cst/cst-tracker.directive";
import { LeaderboardComponent } from "./components/leaderboard/leaderboard.component";

@NgModule({
  declarations: [
    AppComponent,
    SurveyComponent,
    SurveyAnalyticsComponent,
    SurveyAnalyticsDatatablesComponent,
    SurveyAnalyticsTabulatorComponent,
    AnalyticsPage,
    GameComponent,
    TextHighlightComponent,
    AnalyticsTabulatorPage,
    ToastComponent,
    CstTrackerDirective,
    LeaderboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SurveyModule,
    SurveyCreatorModule,
    AngularD3CloudModule,
    FormsModule,
  ],
  providers: [CstService],
  bootstrap: [AppComponent],
})
export class AppModule {}
