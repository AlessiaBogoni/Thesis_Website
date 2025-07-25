/**
 * @fileoverview Componente di gioco per la gestione delle donazioni e del punteggio.
 *
 * @module GameComponent
 */
import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { CountUp } from "countup.js";
import { SurveyService } from "./survey.service";
import { HttpClient } from "@angular/common/http";
import { combineLatest } from "rxjs";
import { PostSurvey } from "../data/post.survey";
import { Model, SurveyModel } from "survey-core";
import { PreSurvey } from "../data/pre.survey";
import { Router } from "@angular/router";
import {
  textPerGroup,
  Text,
  LastText,
  textPerSecondGroup,
} from "../data/texts";
import { CstService } from "./cst/cst.service";
declare var $, bootstrap: any;
declare var SurveyTheme: any;
declare var Swal: any;

/**
 * Componente di gioco per la gestione delle donazioni e del punteggio.
 *
 * @class
 * @implements {OnInit}
 * @implements {AfterViewInit}
 */
@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {
  internalState = +localStorage.getItem("0state") || State.PRE;
  /**
   * Stato del gioco.
   * @type {typeof State}
   */
  status = State;
  /**
   * Codice macchina.
   * @type {string | null}
   */
  machineCode = localStorage.getItem("0machineCode");
  /**
   * Partita corrente.
   * @type {number}
   */
  currentText = 0;
  /**
   * Modello del sondaggio post-partita.
   * @type {SurveyModel}
   */
  postSurvey: SurveyModel;
  /**
   * Modello del sondaggio pre-partita.
   * @type {SurveyModel}
   */
  preSurvey: SurveyModel;

  consent = localStorage.getItem("0consent");

  referral: string | null = null;

  /**
   * Gruppo di appartenenza del giocatore.
   * @type {string}
   */
  group: string;
  /**
   * Secondo gruppo di appartenenza del giocatore.
   * @type {string}
   */
  secondGroup: string;
  numSecondGroup: number;

  /**
   * Testo da mostrare al giocatore.
   * @type {any[]}
   */
  textToShow: TextResult[] = [];
  lastTextToShow: LastTextResult[] = [];
  isButtonDisabled = true;
  pastTime = 0;

  interacted = {
    accuracy: false,
    readability: false,
    humanSoundness: false,
  };
  highlightSections = [];
  cstSubscription: any;
  cstScore = 0;


  markInteracted(key: "accuracy" | "humanSoundness" | "readability") {
    this.interacted[key] = true;
  }

  allInteracted(): boolean {
    return Object.values(this.interacted).every((val) => val === true);
  }
  get state() {
    return this.internalState;
  }

  /**
   * Setter per lo stato del gioco.
   * @param {number} v - Nuovo stato del gioco.
   */
  set state(v) {
    this.internalState = v;
    if (
      [
        State.TEXT1,
        State.TEXT2,
        State.TEXT3,
        State.TEXT4,
        State.TEXT5,
      ].includes(v)
    ) {
      // Reset the current text to idx
      this.currentText = v - State.TEXT1 + 1; // TEXT1 is 2, so we need to add 1
    }
    localStorage.setItem("0state", v.toString());
  }

  constructor(
    public http: HttpClient,
    private surveyService: SurveyService,
    private cstService: CstService,
    private router: Router
  ) {}

  /**
   * Metodo di inizializzazione del componente.
   * @returns {void}
   */
  async ngOnInit() {
    async function askForConsent() {
      const tracking = [
        "Approximate location (country or city only)",
        "Language settings",
        "Browser and device type",
      ];

      const { isConfirmed, isDenied } = await Swal.fire({
        title: "Consent Required",
        html: `
      <p>To take part in this study, we need your consent to use cookies and collect limited technical data.</p>
      <p>This data is anonymized, used only for research, and only while you're on this page. It cannot identify you or track you elsewhere.</p>
      <p><strong>What we collect:</strong><br>${tracking.join(" · ")}</p>
      <p><strong>If you do not agree, you will be redirected.</strong></p>
    `,
        icon: "info",
        iconColor: "#506da3",
        showCancelButton: false,
        showDenyButton: true,
        confirmButtonColor: "#506da3",
        denyButtonColor: "#aaa",
        confirmButtonText: "I Accept",
        denyButtonText: "I Do Not Accept",
      });

      if (isConfirmed) {
        localStorage.setItem("0consent", "true");
        return "true";
      }

      if (isDenied) {
        const { isConfirmed: confirmExit } = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to participate in the study.",
          icon: "warning",
          iconColor: "#bf191f",
          showCancelButton: true,
          confirmButtonText: "Yes, I'm sure",
          cancelButtonText: "Go back",
          confirmButtonColor: "#bf191f",
          cancelButtonColor: "#506da3",
        });

        if (confirmExit) {
          localStorage.setItem("0consent", "false");
          return "false";
        } else {
          return await askForConsent(); // Loop again
        }
      }

      return null;
    }

    this.cstSubscription = this.cstService.overallCstScore$.subscribe((score) => {
      this.cstScore = score;
      console.log('Current Overall CST Score:', this.cstScore);
    });
    // Usage:
    if (!this.consent) {
      this.consent = await askForConsent();
    }

    if (this.consent === "false") {
      history.back();
      return;
    }
    this.state = this.internalState;

    if (!this.machineCode || location.href.includes("force")) {
      this.machineCode = SurveyService.generateMachineCode();
      localStorage.setItem("0machineCode", this.machineCode);
      this.state = State.PRE;
    }
    this.group = this.machineCode[0]; // Get the group from the first character
    this.secondGroup = this.machineCode[1]; // Get the second character
    console.log("Machine code:", this.machineCode);
    console.log("Group:", this.group);
    console.log("Second group:", this.secondGroup);
    const textToShow = textPerGroup[this.group].map((e) => {
      const textResult = new TextResult();
      textResult.text = e;
      textResult.humanSoundness = 5;
      textResult.accuracy = 5;
      textResult.readability = 5;

      return textResult;
    });

    this.numSecondGroup = +this.secondGroup;
    console.log(this.numSecondGroup);
    console.log(textPerSecondGroup);

    const group = textPerSecondGroup?.[this.numSecondGroup];
    if (Array.isArray(group)) {
      const lastTextToShow = group.map(
        (e) => {
          const lastTextResult = new LastTextResult();
          lastTextResult.lastText = e;
          lastTextResult.humanSoundness = 5;
          lastTextResult.accuracy = 5;
          lastTextResult.readability = 5;
          lastTextResult.highlightSections = [];
          return lastTextResult;
        }
      );

      this.lastTextToShow = lastTextToShow;
    } else {
      console.warn(
        `Invalid group key '${this.numSecondGroup}' or group is not an array`,
        group
      );
    }
    // shuffle the textToShow array with seed this.machineCode
    this.textToShow = textToShow.sort((a, b) =>
      this.machineCode[+a.text.id + 3] > this.machineCode[+b.text.id + 3]
        ? 1
        : -1
    );
/*
    if (this.secondGroup === "0") {
      this.lastTextToShow[0] = this.lastTextToShow[0];
    } else {
      this.lastTextToShow[0] = this.lastTextToShow[1];
    } */

    const url = this.router.url;
    const fragment = url.split("?")[1]; // Get everything after `?`
    const params = new URLSearchParams(fragment);
    this.referral = params.get("referral");
    console.log("Referral source:", this.referral);

    this.preSurvey = new Model(PreSurvey);
    // Ottiene il dispositivo e il browser dell'utente.
    const device = this.surveyService.getDeviceAndBrowser();
    this.preSurvey.setValue("refer", this.referral);
    this.preSurvey.setValue(
      "experiment_group",
      this.machineCode[0] === "0" ? "anonimo" : "non_anonimo"
    );
    this.preSurvey.setValue("device", device.device);
    this.preSurvey.setValue("browser", device.browser);
    this.preSurvey.setValue("start_time", new Date().toISOString());

    // Ottiene il paese dell'utente.
    try {
      this.surveyService
        .getCountry()
        .then((country) => {
          this.preSurvey.setValue("country", country.country);
          this.preSurvey.setValue("city", country.city);
          this.preSurvey.setValue("region", country.region);
        })
        .catch(() => {
          this.preSurvey.setValue("country", "unknown");
        });
    } catch (e) {
      this.preSurvey.setValue("country", "unknown");
    }
    this.preSurvey.showPrevButton = false;
    this.preSurvey.applyTheme(SurveyTheme.ContrastDark);
    this.preSurvey.cookieName = this.machineCode;
    this.preSurvey.onComplete.add(() => {
      this.state = State.TEXT1;
      this.currentText = 1;
      this.pastTime = (new Date()).getTime();
      this.preSurvey.setValue("startTexts", new Date());
      this.sendData("pre", this.preSurvey).subscribe(() => {});
    });
    this.postSurvey = new Model(PostSurvey);
    this.postSurvey.applyTheme(SurveyTheme.ContrastDark);
    this.postSurvey.showPrevButton = false;
    this.postSurvey.cookieName = this.machineCode;
    this.postSurvey.onComplete.add(() => {
      this.sendData("post", this.postSurvey).subscribe(() => {});
      this.http
        .put(SurveyService.getUrl(this.machineCode + "/totalScore"), 0)
        .subscribe(() => {});
      this.state = State.FINISHED;
    });
  }

  /**
   * Metodo chiamato dopo l'inizializzazione della vista.
   * @returns {void}
   */
  ngAfterViewInit() {}

  /**
   * Metodo per inviare i dati del sondaggio.
   * @param {string} bin - Tipo di sondaggio (pre o post).
   * @param {SurveyModel} sender - Modello del sondaggio.
   * @returns {Observable<any>}
   */
  sendData(bin: string, sender: SurveyModel) {
    return this.http.put(
      SurveyService.getUrl(this.machineCode + "/" + bin),
      sender.getData()
    );
  }

  isMobile() {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      ) {
        check = true;
      }
    })(navigator.userAgent || navigator.vendor);
    return check;
  }

  ngOnDestroy() {
    if (this.cstSubscription) {
      this.cstSubscription.unsubscribe();
    }
  }

  nextText() {
    setTimeout(function () {
      window.focus();
      document.body.scrollTop = 0;
    }, 200);
    this.isButtonDisabled = true;
    this.interacted = {
      accuracy: false,
      readability: false,
      humanSoundness: false,
    };
    const result = { ...this.textToShow[this.currentText - 1] } as TextResult;
    result.attention = this.cstScore;
    delete result.text.text;
    delete result.text.author;
    delete result.text.title;
    this.textToShow[this.currentText - 1].deltaTime = (new Date()).getTime() - this.pastTime;
    // result.deltaTime = (new Date()).getTime() - this.pastTime;
    this.pastTime = (new Date()).getTime();
    this.http
      .put(
        SurveyService.getUrl(this.machineCode + "/results/" + this.currentText),
        this.textToShow[this.currentText - 1]
      )
      .subscribe(() => {
        console.log("Text result sent:", this.textToShow[this.currentText - 1]);
        if (this.currentText < this.textToShow.length) {
          this.currentText++;
          this.state = State["TEXT" + this.currentText];
        } else {
          this.state = State.TEXT5;
          console.log(this.state)
        }
      });
  }

  toPostSurvey() {
    const result = { ...this.lastTextToShow[this.currentText - 5] };
    delete result.lastText.text;
    delete result.lastText.author;
    delete result.lastText.title;
    result.attention = this.cstScore;
    this.lastTextToShow[this.currentText - 5].highlightSections.forEach((section) => {
      delete section.element;
      delete section.color

    });
    this.lastTextToShow[this.currentText - 5].deltaTime = (new Date()).getTime() - this.pastTime;
    this.pastTime = (new Date()).getTime();
    this.http
      .put(
        SurveyService.getUrl(this.machineCode + "/results/" + this.currentText),
        this.lastTextToShow[this.currentText - 5]
      )
      .subscribe(() => {
        console.log(
          "Text result sent:",
          this.lastTextToShow[this.currentText - 5]
        );
        this.state = State.POST;
      });
  }

  markdownToHtml(markdown) {
    if (!markdown) {
      return '';
    }
    return (
      markdown
        // Headers
        .replace(/^###### (.*$)/gim, "<h6>$1</h6>")
        .replace(/^##### (.*$)/gim, "<h5>$1</h5>")
        .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/---/gm, "<hr>")

        // Bold
        .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")

        // Italic
        .replace(/\*(.*?)\*/gim, "<em>$1</em>")

        // Inline code
        .replace(/`(.*?)`/gim, "<code>$1</code>")

        // Single line breaks
        .replace(/\n/gim, "<br>")

        // Wrap the whole content in <p> (optional)
        .replace(/^/, "<p>")
        .replace(/$/, "</p>")
    );
  }

}

/**
 * Classe che rappresenta gli stati del gioco.
 * @class
 */
export class State {
  static POST = 7;
  static PRE = 1;
  static TEXT1 = 2;
  static TEXT2 = 3;
  static TEXT3 = 4;
  static TEXT4 = 5;
  static TEXT5 = 6;
  static FINISHED = 8;
}

/**
 * Classe che rappresenta una donazione.
 * @class
 */
class TextResult {
  text: Text;
  attention: number;

  humanSoundness: number;
  accuracy: number;
  readability: number;
  deltaTime: number;
}

class LastTextResult {
  lastText: LastText;
  humanSoundness: number;
  accuracy: number;
  readability: number;
  highlightSections: any[];
  deltaTime: number;
  attention: number

  // highlights: { start: number; end: number }[] = [];

}




