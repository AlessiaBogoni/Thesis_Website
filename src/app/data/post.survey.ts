export const PostSurvey = {
  logoPosition: "right",
  completedHtml: "<h3>Thank you for participating!</h3>",
  pages: [
    {
      name: "post_survey",
      elements: [
        {
          analytics: true,
          isRequired: true,
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
            {
              value: "AI_experience",
              text: "I am familiar with the use of AI",
            },
            {
              value: "forum_experience",
              text: "I am familiar with forums and Q&A setups",
            },
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
              text: "In the real life I would choose the same way I did here",
            },
            /*  {
              value: "reality_scenario",
              text: "I think the proposed scenario is credible",
            }, */
          ],
        },
        {
          type: "text",
          name: "calories",
          title: "How many calories does an average man need per day?",
          isRequired: true,
          analytics: true,
        },
        {
          type: "text",
          name: "other",
          title: "Another check question???????",
          isRequired: true,
          analytics: true,
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
