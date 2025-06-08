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
          type: "rating",
          rateType: "smileys",
          name: "overall_evaluation",
          analytics: true,
          title: "How would you rate your overall experience in this study?",
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
