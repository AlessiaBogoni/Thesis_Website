export const PostSurvey = {
  logoPosition: "t_logoPosition",
  completedHtml: "t_completedHtml",
  pages: [
    {
      name: "post_knowledge_check",
      elements: [
        {
          type: "text",
          name: "calories",
          title: "t_post_knowledge_check_calories_title",
          analytics: true,
        },
        {
          type: "radiogroup",
          name: "qwerty_origin",
          title: "t_post_knowledge_check_qwerty_origin_title",
          choicesOrder: "random",
          analytics: true,
          choices: [
            "t_post_knowledge_check_qwerty_origin_choice_1",
            "t_post_knowledge_check_qwerty_origin_choice_2",
            "t_post_knowledge_check_qwerty_origin_choice_3",
            "t_post_knowledge_check_qwerty_origin_choice_4",
            "t_post_knowledge_check_qwerty_origin_choice_5",
          ],
          correctAnswer: "t_post_knowledge_check_qwerty_origin_choice_1",
        },
        {
          type: "radiogroup",
          name: "notice_period_general",
          title: "t_post_knowledge_check_notice_period_general_title",
          // choicesOrder: "random",
          choices: [
            "t_post_knowledge_check_notice_period_general_choice_1",
            "t_post_knowledge_check_notice_period_general_choice_2",
            "t_post_knowledge_check_notice_period_general_choice_3",
            "t_post_knowledge_check_notice_period_general_choice_4",
          ],
          correctAnswer:
            "t_post_knowledge_check_notice_period_general_choice_4",
        },
      ],
    },
    {
      name: "post_survey",
      elements: [
        {
          analytics: true,
          type: "matrix",
          name: "post_survey",
          title: "t_post_survey_title",
          columns: [
            { value: 1, text: "t_post_survey_column_1" },
            { value: 2, text: "t_post_survey_column_2" },
            { value: 3, text: "t_post_survey_column_3" },
            { value: 4, text: "t_post_survey_column_4" },
            { value: 5, text: "t_post_survey_column_5" },
          ],
          rows: [
            {
              value: "understanding",
              text: "t_post_survey_row_understanding",
            },
            {
              value: "difficulty_guess",
              text: "t_post_survey_row_difficulty_guess",
            },
            {
              value: "contro_check",
              text: "t_post_survey_row_contro_check",
            },
            {
              value: "difficulty_evaluation",
              text: "t_post_survey_row_difficulty_evaluation",
            },
            {
              value: "include_results",
              text: "t_post_survey_row_include_results",
            },
            {
              value: "effort",
              text: "t_post_survey_row_effort",
            },
          ],
        },
        {
          type: "radiogroup",
          name: "author_belief",
          title: "t_post_survey_author_belief_title",
          analytics: true,
          choices: [
            "t_post_survey_author_belief_choice_1",
            "t_post_survey_author_belief_choice_2",
            "t_post_survey_author_belief_choice_3",
            "t_post_survey_author_belief_choice_4",
            "t_post_survey_author_belief_choice_5",
          ],
        },
        {
          type: "rating",
          rateType: "smileys",
          name: "overall_evaluation",
          analytics: true,
          title: "t_post_survey_overall_evaluation_title",
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
