import React from 'react';
import { Link } from 'react-router';

export default function({
  answeredQuestions,
  pages,
  currentPageIndex,
  children,
  userId,
  questionnaireId
}) {
  if (currentPageIndex === 0) {
    return <div>first page</div>;
  }
  // take the current page
  const currentPage = pages.get(currentPageIndex);
  // get the first question
  const firstQuestionOnPage = currentPage.getIn(['questions', 0]);

  // find the question before that question that was viewed
  const previousQuestion = answeredQuestions.reduce(
    (sum, answeredQuestion) => {
      if (
        !answeredQuestion.viewed ||
        answeredQuestion.id === firstQuestionOnPage.get('id') ||
        sum.found
      ) {
        return {
          found: true,
          previousQuestion: sum.previousQuestion
        };
      }
      return {
        found: false,
        previousQuestion: answeredQuestion
      };
    },
    {
      found: false,
      previousQuestion: null
    }
  ).previousQuestion;

  if (!previousQuestion) {
    return <div>didnt answer any previous questions</div>;
  }

  // find the page with that question
  const previousPage = pages
    .filter(
      page =>
        page
          .get('questions')
          .filter(question => question.get('id') === previousQuestion.id).size
    )
    .get(0);
  // go to it
  const previousPageIndex = pages.reduce((sum, page, index) => {
    if (page.get('id') === previousPage.get('id')) {
      return index;
    }
    return sum;
  }, null);

  return (
    <Link
      to={`/users/${userId}/questionnaires/${questionnaireId}/pages/${previousPageIndex}`}
      className="btn btn-default btn-lg"
    >
      {children}
    </Link>
  );
}
