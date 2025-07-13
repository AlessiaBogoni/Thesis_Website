export const PostSurvey = {
  logoPosition: "right",
  completedHtml: "<h3>Thank you for participating!</h3>",
  pages: [
    {
      name: "post_survey",
      elements: [
        {
          analytics: true,
          // isRequired: true,
          type: "matrix",
          name: "post_survey",
          title: "Please answer the following questions",
          columns: [
            { value: 1, text: "Definitely not" },
            { value: 2, text: "Not much" },
            { value: 3, text: "Neutral" },
            { value: 4, text: "Yes" },
            { value: 5, text: "Yes a lot" },
          ],
          rows: [
            /* {
              value: "self_performance",
              text: "I think I was quite good at these tasks",
            }, */
            {
              value: "understanding",
              text: "I understood what the aim of this study is",
            },
            {
              value: "difficulty_guess",
              text: "Guessing the source of the texts was difficult",
            },
            {
              value: "difficulty_evaluation",
              text: "Evaluating the texts was difficult",
            },
            {
              value: "reality_behaviour",
              text: "In an exam I would answer in the same way I did here",
            },
            {
              value: "effort",
              text: "I put much effort in reading and understanding the texts",
            },
            /*  {
              value: "reality_scenario",
              text: "I think the proposed scenario is credible",
            }, */
          ],
        },
        {
          type: "radiogroup",
          name: "author_belief",
          title:
            "To what extent did you believe the author information shown above each texts?",
          analytics: true,
          choices: [
            "Completely",
            "Mostly",
            "A little",
            "Not at all",
            "I don’t remember noticing who the authors were",
          ],  
        },
        {
          type: "text",
          name: "calories",
          title: "How many calories does an average man need per day?",
          // isRequired: true,
          analytics: true,
        },
        {
          type: "radiogroup",
          name: "qwerty_origin",
          title: "Why is the QWERTY keyboard called so?",
          choicesOrder: "random",
          // isRequired: true,
          analytics: true,
          choices: [
            "Because the first six letters on the top letter row spell 'QWERTY'.",
            "It is named after the inventor, Quentin Werty.",
            "I'm not sure.",
            "QWERTY is an acronym for 'Quick Efficient Writing Equipment Ready To Yield'.",
            "It was randomly chosen by typewriter manufacturers.",
          ],
          correctAnswer:
            "Because the first six letters on the top letter row spell 'QWERTY'.",
        },
        {
          type: "checkbox",
          name: "rental_agreements_knowledge",
          title:
            "Which of the following statements about rental agreements are generally true? (Select all that apply.)",
          choicesOrder: "random",
          // isRequired: true,
          analytics: true,
          choices: [
            "Tenants often need to provide at least 30 days’ notice before moving out.",
            "Landlords can increase rent without any advance notice.",
            "Finding new tenants usually takes time, often more than two weeks.",
            "Tenants can break a lease at any time without penalty.",
            "Landlords are responsible for maintaining the property in livable condition.",
          ],
          correctAnswer: [
            "Tenants often need to provide at least 30 days’ notice before moving out.",
            "Finding new tenants usually takes time, often more than two weeks.",
            "Landlords are responsible for maintaining the property in livable condition.",
          ],
        },
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
