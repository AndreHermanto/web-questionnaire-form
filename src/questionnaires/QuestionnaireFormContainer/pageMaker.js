import cuid from 'cuid';
import _ from 'lodash';

function pageMaker(questions) {
  return questions.reduce((sum, question, index) => {
    let page;
    // new section
    if (question.type === 'section') {
      page = {
        id: cuid(),
        heading: question.title,
        sectionId: question.id,
        questions: []
      };
      sum.push(page);
      return sum;
    }
    // its a question
    if (question.type !== 'section') {
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
          sectionId: page.sectionId,
          questions: []
        });
      }
    }
    return sum;
  }, []);
}

export default pageMaker;
