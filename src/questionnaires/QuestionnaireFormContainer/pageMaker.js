import cuid from 'cuid';
import _ from 'lodash';

function pageMaker(questions) {
  return questions.reduce((sum, question, index) => {
    let page;
    // new section
    if (question.type === 'section') {
      // if its a heading, or the first question
      if (question.size === 1 || index === 0) {
        page = {
          id: cuid(),
          heading: question.title,
          sectionId: question.id,
          questions: []
        };
        sum.push(page);
        return sum;
      }

      if (question.size === 2) {
        // look at the previous page
        const previousPage = sum[sum.length - 1];
        if (!previousPage.questions.length) {
          // previous page was just a heading, no questions
          // so add to that
          previousPage.heading2 = question.title;
        } else {
          page = {
            id: cuid(),
            heading: previousPage.heading,
            heading2: question.title,
            heading3: undefined,
            sectionId: question.id,
            questions: []
          };
          sum.push(page);
        }
        return sum;
      }

      if (question.size === 3) {
        // look at the previous page
        const previousPage = sum[sum.length - 1];
        if (!previousPage.questions.length) {
          // previous page was just a heading, no questions
          // so add to that
          previousPage.heading3 = question.title;
        } else {
          page = {
            id: cuid(),
            heading: previousPage.heading,
            heading2: previousPage.heading2,
            heading3: question.title,
            sectionId: question.id,
            questions: []
          };
          sum.push(page);
        }
        return sum;
      }
    }

    // its a question
    // if (question.type !== 'section') {
      // first question, so add a page
    if (sum.length === 0) {
      sum.push({
        id: cuid(),
        heading: '',
        questions: []
      });
    }
    page = sum[sum.length - 1];
    page.questions.push(question);

    // has skip logic, so add a new page after this question
    const hasSkipLogic = _.find(question.answers, answer => answer.goTo);
    if (hasSkipLogic && index !== questions.length - 1) {
      sum.push({
        id: cuid(),
        heading: page.heading,
        heading2: page.heading2,
        heading3: page.heading3,
        sectionId: page.sectionId,
        questions: []
      });
    }
    // }
    return sum;
  }, []);
}

export default pageMaker;
