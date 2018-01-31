export const getCompletedQuestionnaires = questionnaireVersions =>
  questionnaireVersions.reduce(
    (previousResult, questionnaireVersion) => {
      return {
        all: !!(
          previousResult.all &&
          questionnaireVersion &&
          questionnaireVersion.response &&
          questionnaireVersion.response.completed
        ),
        beforePayment: !!(
          previousResult.beforePayment &&
          questionnaireVersion &&
          (questionnaireVersion.afterPayment ||
            (questionnaireVersion.response &&
              questionnaireVersion.response.completed))
        )
      };
    },
    { all: true, beforePayment: true }
  );
