export const PreSurvey = {
  logoPosition: "right",
  completedHtml: "<h3>Thank you!</h3>",

  pages: [
    {
      name: "intro",
      elements: [
        {
          type: "html",
          name: "introduction",
          html: `<p><h3>Introduction to this study</h3>

Welcome and thank you for your interest in this study!

My name is <b> Alessia Bogoni</b>, and I am a Master's student in the International Economic Policy program at the Julius-Maximilians-Universität Würzburg. This experiment is being conducted as part of my Master's thesis, under the supervision of <b>Dr. Professor Steffen Altmann</b> and <b>Dr. Alisa Frey</b> .<br>

The purpose of this study is to explore how people engage with and evaluate written content. 
You will be asked to read a few short texts and answer questions about them. The entire process should take no more than <b> 10 minutes </b> to complete. <br>

Your participation is completely voluntary, and you may exit the study at any time without providing a reason. All responses will be treated confidentially and used solely for academic research purposes. No personal or identifying information will be collected.

If you have any questions or concerns about the study, feel free to contact me at 
<a href="mailto:alessia.bogoni@stud-mail.uni-wuerzburg.de" style="color: #ffffff;">
alessia.bogoni@stud-mail.uni-wuerzburg.de
</a>. <br> 

Thank you for supporting academic research! </p>`,
        },
        {
          type: "checkbox",
          name: "tos",
          choices: [
            {
              value: "confirmed",
              text: "I confirm that I have read and understood the information provided above.",
            },
          ],
          title:
            "By participating, you agree to allow us to use your anonymized data for research. You can leave the study at any time without penalty.",
          isRequired: true,
        },
      ],
    },
  ],
  showProgressBar: "top",
  progressBarType: "questions",
  goNextPageAutomatic: false,
  showQuestionNumbers: "on",
  questionTitleLocation: "top",
  sendResultOnPageNext: true,
};




