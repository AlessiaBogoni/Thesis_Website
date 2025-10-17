import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SurveyService {
  /**
   * Costruisce l'URL per le richieste HTTP.
   * @param {string} obj - Oggetto da aggiungere all'URL.
   * @returns {string} URL costruito.
   */
static getUrl(obj: string) {
  return `https://leetcodeexp-default-rtdb.firebaseio.com/${obj}.json`;
}


  /**
   * Genera un codice macchina casuale.
   * @returns {string} Codice macchina generato.
   */
static generateMachineCode(): string {
  const groups = ["B", "B", "B", "B"];
  const randomIndex = Math.floor(Math.random() * groups.length);
  const assignedGroup = groups[randomIndex];

  // Generate either '0' or '1' for the second character
  const binaryDigit = Math.random() < 0.5 ? "0" : "1";

  // Generate the rest of the alphanumeric string, excluding the first character
  const restOfCode = Math.random().toString(36).substring(2, 14); // 13 characters

  // Insert binaryDigit as the first character of the code
  const machineCode = `${binaryDigit}${restOfCode}`;

  return `${assignedGroup}${machineCode}`;
}

  getDeviceAndBrowser() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

    // Ottieni informazioni sul browser
    let browser = "Unknown";
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
      browser = "Chrome";
    } else if (userAgent.includes("Firefox")) {
      browser = "Firefox";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      browser = "Safari";
    } else if (userAgent.includes("Edg")) {
      browser = "Edge";
    } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
      browser = "Internet Explorer";
    }

    // Restituisci il risultato
    return {
      browser: browser,
      device: platform,
    };
  }

  async getCountry() {
    try {
      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) {
        throw new Error("Errore nella chiamata API");
      }
      const data = await response.json();
      return {
        country: data.country_name,
        region: data.region,
        city: data.city,
      };
    } catch (error) {
      console.error("Errore nel recupero della posizione:", error);
      return null;
    }
  }
}
