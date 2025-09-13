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
          title: "t_title_confirmation",
          //  isREquired: true,
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
          inputType: "number",
          min: 18,
          max: 100,
          //  isREquired: true,
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
          //  isREquired: true,
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
          //  isREquired: true,
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
          //  isREquired: true,
          choices: [
            { value: "A1-A2", text: "t_A1-A2" },
            { value: "B1-B2", text: "t_B1-B2" },
            { value: "C1-C2", text: "t_C1-C2" },
            { value: "Native speaker", text: "t_native_speaker" },
          ],
        },
        {
          analytics: true,
          //  isREquired: true,
          type: "matrix",
          name: "generalPpreviousKnowledge",
          title: "t_previous_knowledge_title",
          columns: [
            { value: 1, text: "t_definitely_not" },
            { value: 2, text: "t_not_much" },
            { value: 3, text: "t_neutral" },
            { value: 4, text: "t_yes" },
            { value: 5, text: "t_yes_a_lot" },
          ],
          rows: [
            { value: "AI_experience", text: "t_AI_experience" },
            { value: "forum_experience", text: "t_forum_experience" },
            { value: "NFC_positive", text: "t_NFC_positive" },
            { value: "NFC_negative", text: "t_NFC_negative" },
          ],
        },
        {
          analytics: true,
          //  isREquired: true,
          type: "matrix",
          name: "specificPreviousKnowledge",
          title: "t_previous_knowledge_title",
          columns: [
            { value: 1, text: "t_definitely_not" },
            { value: 2, text: "t_not_much" },
            { value: 3, text: "t_neutral" },
            { value: 4, text: "t_yes" },
            { value: 5, text: "t_yes_a_lot" },
          ],
          rows: [
            { value: "computer_experience", text: "t_computer_experience" },
            { value: "pet_experience", text: "t_pet_experience" },
            { value: "reading_experience", text: "t_reading_experience" },
            { value: "nutrition_experience", text: "t_nutrition_experience" },
            { value: "renting_experience", text: "t_renting_experience" },
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
          html: "t_instructions_html",
        },
                {
          type: "html",
          name: "scoringDetailsLink",
          html: "t_scoring_details_link",
        },
                        {
          type: "html",
          name: "checIntro",
          html: "t_intro_attention_check",
        },
        {
          type: "radiogroup",
          //  isREquired: true,
          name: "attention_check_1",
          title: "t_attention_check_1",
          choices: [
            { value: true, text: "t_true" },
            { value: false, text: "t_false" },
          ],
          correctAnswer: false,
        },
        {
          type: "html",
          name: "ac1_feedback",
          visibleIf: "{attention_check_1} = true",
          html: "t_ac1_feedback",
        },
        {
          type: "radiogroup",
          //  isREquired: true,
          name: "attention_check_2",
          title: "t_attention_check_2",
          choices: [
            { value: true, text: "t_true" },
            { value: false, text: "t_false" },
          ],
          correctAnswer: false,
        },
        {
          type: "html",
          name: "ac2_feedback",
          visibleIf: "{attention_check_2} = true",
          html: "t_ac2_feedback",
        },
        {
          type: "radiogroup",
          //  isREquired: true,
          name: "attention_check_3",
          title: "t_attention_check_3",
          choices: [
            { value: true, text: "t_true" },
            { value: false, text: "t_false" },
          ],
          correctAnswer: true,
        },
        {
          type: "html",
          name: "ac3_feedback",
          visibleIf: "{attention_check_3} = false",
          html: "t_ac3_feedback",
        },
/*         {
          type: "html",
          name: "performance_text",
          html: "t_performance_text",
        }, */
                        {
          type: "html",
          name: "details_prize",
          html: "t_details_prize",
        },
        {
          type: "text",
          name: "name",
          title: "t_name",
          placeHolder: "t_name_placeholder",
        },
        {
          type: "text",
          inputType: "email",
          name: "email",
          title: "t_email",
          isRequired: false,
          validators: [{ type: "email", text: "t_email_invalid" }],
          placeHolder: "t_email_placeholder",
        },
        {
          type: "html",
          name: "email_optional_notice",
          visibleIf: "{email} = ''",
          html: "t_email_optional_notice",
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
