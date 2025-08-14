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
          html: "t_introduction",
        },
        {
          type: "checkbox",
          name: "tos",
          choices: [
            {
              value: "confirmed",
              text: "t_confirmation",
            },
          ],
          title:
            "t_title_confirmation",
          // isRequired: true,
        },
      ],
    },
    {
      name: "demographics",
      elements: [
        {
          type: "text",
          name: "age",
          title: "t_title_age",
          inputType: "number", // Ensures numeric keypad on mobile
          min: 18,
          max: 100,
          validators: [
            {
              type: "numeric",
              minValue: 18,
              maxValue: 100,
              text: "t_age_placeholder",
            },
          ],
        },
        {
          type: "radiogroup",
          name: "gender",
          analytics: true,

          title: "t_title_gender",
          // isRequired: true,
          choices: [
            { value: "male", text: "t_male" },
            { value: "female", text: "t_female" },
            { value: "prefer_not_to_say", text: "t_no_gender" },
          ],
        },
        {
          type: "dropdown",
          name: "education",
          analytics: true,
          title: "t_title_education",
          // isRequired: true,
          choices: [
            { value: "no_degree", text: "t_no_degree" },
            { value: "high_school", text: "t_diploma" },
            { value: "bachelor", text: "t_bachelor" },
            { value: "master", text: "t_master" },
            { value: "doctorate", text: "t_doctorate" },
          ],
        },
        {
          type: "dropdown",
          name: "language",
          analytics: true,
          title: "t_title_language",
          // isRequired: true,
          choices: [
            { value: "A1-A2", text: "A1-A2 - Beginner" },
            { value: "B1-B2", text: "B1-B2 - Intermediate" },
            { value: "C1-C2", text: "C1-C2 - Advanced" },
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
          ],
        },
      ],
    },
    {
      name: "instructions",
      elements: [
        {
          type: "html",
          name: "instructionsText",
          html: `
                <h3 style="color:#7dd1a9">Instructions</h3>
                <p>You will read <strong>5 texts</strong> presented as Q&amp;A exchanges, where each text contains a short question followed by a text answer.</p>
                <p>For each text, an author is provided or declared as "unknown." <strong style="color:#7dd1a9"> When a label is given, it correctly represents the true author of the text</strong>.</p>

                <p><strong style="color:#7dd1a9" >For the first 4 texts:</strong></p>
                <ul>
                  <li>Guess the <strong>source </strong> (author) of the text.</li>
                  <li>Rate the <strong>readability</strong> of the text.</li>
                  <li>Rate the <strong>accuracy</strong> of the text.</li>
                </ul>

                <p><strong style="color:#7dd1a9">For the 5th text:</strong></p>
                <p>You will perform the same tasks as above, and also <strong style="color:#7dd1a9">highlight the parts of the text</strong> where you believe errors are present.</p>

                <p>Your <strong style="color:#7dd1a9">performance</strong> will be evaluated based on:</p>
                <ul>
                  <li>How close your source guesses are to the true authors across all 5 texts.</li>
                  <li>How many errors you correctly identify in the last text.</li>
                </ul>
              `,
        },

        {
          type: "radiogroup",
          name: "attention_check_1",
          title: "You will guess the source (author) of each text.",
          choices: ["True", "False"],
          correctAnswer: "True",
        },
        {
          type: "html",
          name: "ac1_feedback",
          visibleIf: "{attention_check_1} = 'False'",
          html: `<div style='color: red; font-weight: bold;'>Incorrect. You are required to <strong>guess the source (author)</strong> of each text.</div>`,
        },
        {
          type: "radiogroup",
          name: "attention_check_2",
          title: `Only the first 4 texts require you to highlight errors.`,
          choices: ["True", "False"],
          correctAnswer: "False",
        },
        {
          type: "html",
          name: "ac2_feedback",
          visibleIf: "{attention_check_2} = 'True'",
          html: `<div style='color: red; font-weight: bold;'>Incorrect. <strong>Only the 5th text</strong> requires error highlighting.</div>`,
        },
        {
          type: "radiogroup",
          name: "attention_check_3",
          title: `When a label is provided, it correctly represents the true author of the text.`,
          choices: ["True", "False"],
          correctAnswer: "True",
        },
        {
          type: "html",
          name: "ac3_feedback",
          visibleIf: "{attention_check_3} = 'False'",
          html: `<div style='color: red; font-weight: bold;'>Incorrect. If a label is given, it <strong>does correctly represent</strong> the true author.</div>`,
        },

        /* {
          type: "html",
          name: "email_name_info",
          html: `<p>You may choose to <strong>not provide your email</strong>, but in that case you will <strong>not be eligible</strong> for the prize competition.</p>
      <p>Your name will be displayed on the leaderboard, while your email (if provided) will only be used to contact prize winners and will be kept confidential.</p>
              `,
        }, */
        {
          type: "html",
          name: "performance_text",
          html: `
                <p style="color:#7dd1a9"><strong>The best performers will receive prizes!</strong></p>
              `,
        },
        {
          type: "text",
          name: "name",
          title: "Name",
          placeHolder:
            "Enter your name (used to show your result in the final leaerboard)",
        },
        {
          type: "text",
          inputType: "email",
          name: "email",
          title: "Your Contact Email",
          isRequired: false,
          validators: [
            { type: "email", text: "Please enter a valid email address" },
          ],
          placeHolder:
            "Enter your email address (optional, only needed to participate in prize competition)",
        },
        {
          type: "html",
          name: "email_optional_notice",
          visibleIf: "{email} = ''",
          html: `
    <p style="margin-top: 10px; color:rgb(226, 186, 66);">
      You may choose to <strong>not provide your email</strong>, but in that case, you will <strong>not be eligible</strong> for the prize competition. Your email address will be kept confidential and used only to contact you if you win.
    </p>
  `,
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
