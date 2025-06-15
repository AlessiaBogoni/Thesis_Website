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
    {
      name: "demographics",
      elements: [
        {
          type: "dropdown",
          name: "age_group",
          analytics: true,
          title: "Select your age group:",
          isRequired: true,
          choices: [
            { value: "18_25", text: "18-25" },
            { value: "26_35", text: "26-35" },
            { value: "36_45", text: "36-45" },
            { value: "46_60", text: "46-60" },
            { value: "60_plus", text: "Over 60" },
          ],
        },
        {
          type: "radiogroup",
          name: "gender",
          analytics: true,

          title: "What is your gender?",
          isRequired: true,
          choices: [
            { value: "male", text: "Male" },
            { value: "female", text: "Female" },
            { value: "prefer_not_to_say", text: "Prefer not to say/Other" },
          ],
        },
        {
          type: "dropdown",
          name: "education",
          analytics: true,
          title: "What is your highest level of education?",
          isRequired: true,
          choices: [
            { value: "no_degree", text: "No degree" },
            { value: "high_school", text: "High School Diploma" },
            { value: "bachelor", text: "Bachelor's Degree" },
            { value: "master", text: "Master's Degree" },
            { value: "doctorate", text: "Doctorate" },
          ],
        },
        /*         {
          type: "dropdown",
          name: "employment_status",
          analytics: true,

          title: "What is your current employment status?",
          isRequired: true,
          choices: [
            { value: "unemployed", text: "Unemployed" },
            { value: "student", text: "Student" },
            { value: "working-student", text: "Working student" },
            { value: "employed", text: "Employed" },
            { value: "retired", text: "Retired" },
          ],
        }, */
        /*  {
          type: "dropdown",
          visibleIf: "{employment_status}='employed'",
          name: "income",
          analytics: true,
          title: "What is your monthly income?",
          choices: [
            { value: "0_500", text: "0-500" },
            { value: "501_1000", text: "501-1000" },
            { value: "1001_1500", text: "1001-1500" },
            { value: "1501_2000", text: "1501-2000" },
            { value: "2001_plus", text: "Over 2000" },
          ],
        }, */
        /* {
          type: "dropdown",
          name: "parental_education",
          analytics: true,
          title: "What is the highest level of education of your parents?",
          choices: [
            { value: "no_degree", text: "No degree" },
            { value: "high_school", text: "High School Diploma" },
            { value: "bachelor", text: "Bachelor's Degree" },
            { value: "master", text: "Master's Degree" },
            { value: "doctorate", text: "Doctorate" },
          ],
        }, */
        /* {
          type: "matrix",
          name: "personal_info",
          analytics: true,
          title: "Please answer the following questions",
          columns: [
            { value: 1, text: "Definitely not" },
            { value: 2, text: "Not much" },
            { value: 3, text: "Neutral" },
            { value: 4, text: "Yes" },
            { value: 5, text: "Yes a lot" },
          ],
          rows: [
            { value: "generous", text: "I am generous" },
            { value: "competitive", text: "I am competitive " },
          ],
        }, */
        {
          type: "rating",
          rateType: "smileys",
          name: "overall_evaluation",
          analytics: true,
          title: "How would you rate your overall experience in this study?",
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
