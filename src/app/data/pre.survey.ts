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

Your participation is completely voluntary, and you may exit the study at any time without providing a reason. All responses will be treated confidentially and used solely for academic research purposes.

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
          // isRequired: true,
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
          // isRequired: true,
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
          // isRequired: true,
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
          // isRequired: true,
          choices: [
            { value: "no_degree", text: "No degree" },
            { value: "high_school", text: "High School Diploma" },
            { value: "bachelor", text: "Bachelor's Degree" },
            { value: "master", text: "Master's Degree" },
            { value: "doctorate", text: "Doctorate" },
          ],
        },
        {
          type: "dropdown",
          name: "language",
          analytics: true,
          title: "What is your English level?",
          // isRequired: true,
          choices: [
            { value: "A1-A2", text: "A1-A2" },
            { value: "B1-B2", text: "B1-B2" },
            { value: "C1-C2", text: "C1-C2" },
            { value: "Native speaker", text: "Native speaker" },
          ],
        },
        {
          analytics: true,
          // isRequired: true,
          type: "matrix",
          name: "previousKnowledge",
          title: "Please answer the following questions",
          columns: [
            { value: 1, text: "Definitely not" },
            { value: 2, text: "Not much" },
            { value: 3, text: "Neutral" },
            { value: 4, text: "Yes" },
            { value: 5, text: "Yes a lot" },
          ],
          rows: [
            {
              value: "AI_experience",
              text: "I am familiar with the use of AI (LLM)",
            },
            {
              value: "forum_experience",
              text: "I am familiar with forums and Q&A setups",
            },
            {
              value: "computer_experience",
              text: "I am familiar with computers and software",
            },
            {
              value: "pet_experience",
              text: "I am familiar with pet care",
            },
            {
              value: "reading_experience",
              text: "I am confident in reading texts",
            },
            {
              value: "nutrition_experience",
              text: "I am confident and familiar with topics related to nutrition and health.",
            },
            {
              value: "NFC_positive",
              text: "I enjoy figuring things out, even if it takes a while.",
            },
            {
              value: "NFC_negative",
              text: "I usually prefer quick summaries over reading full explanations.",
            },
            /* {
              value: "self_performance",
              text: "I think I was quite good at these tasks",
            }, */
            /*  {
              value: "reality_scenario",
              text: "I think the proposed scenario is credible",
            }, */
          ],
        },

        /*         {
          type: "dropdown",
          name: "employment_status",
          analytics: true,

          title: "What is your current employment status?",
          // isRequired: true,
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
      ],
    },
     {
          name: "instructions",
          elements: [
            {
              type: "html",
              name: "instructionsText",
              html: `
                <h3>Instructions</h3>
                <p>You will read <strong>5 texts</strong> presented as Q&amp;A exchanges, where each text contains a short question followed by a text answer.</p>
                <p>For each text, an author is provided or declared as "unknown." When a label is given, it correctly represents the true author of the text.</p>

                <p><strong>For the first 4 texts:</strong></p>
                <ul>
                  <li>Guess the source (author) of the text.</li>
                  <li>Rate the readability of the text.</li>
                  <li>Rate the accuracy of the text.</li>
                </ul>

                <p><strong>For the 5th text:</strong></p>
                <p>You will perform the same tasks as above, <strong>and</strong> also highlight the parts of the text where you believe errors are present.</p>

                <p>Your <strong>performance</strong> will be evaluated based on:</p>
                <ul>
                  <li>How close your source guesses are to the true authors across all 5 texts.</li>
                  <li>How many errors you correctly identify in the last text.</li>
                </ul>

                <p>The best performers will receive prizes!</p>

                <p>You may choose to <strong>not provide your email</strong>, but in that case you will <strong>not be eligible</strong> for the prize competition.</p>
                <p>Your name will be displayed on the leaderboard, while your email (if provided) will only be used to contact prize winners and will be kept confidential.</p>
              `
            },
            {
              type: "text",
              name: "name",
              title: "Your Name",
              isRequired: true,
              placeHolder: "Enter your name"
            },
            {
              type: "text",
              inputType: "email",
              name: "email",
              title: "Your Contact Email",
              isRequired: false,
              validators: [{ type: "email", text: "Please enter a valid email address" }],
              placeHolder: "Enter your email address (optional, needed to participate in prize)"
            }
          ]
        }

  ],
  showProgressBar: "top",
  progressBarType: "questions",
  goNextPageAutomatic: false,
  showQuestionNumbers: "on",
  questionTitleLocation: "top",
  sendResultOnPageNext: true,
};
