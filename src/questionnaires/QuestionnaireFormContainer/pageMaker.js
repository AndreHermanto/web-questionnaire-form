import cuid from 'cuid';
import _ from 'lodash';

function pageMaker(elements) {
  return elements.reduce((sum, element, index) => {
    let page;
    // new section
    if (element.type === 'section') {
      // if its a heading, or the first element
      if (element.size === 1 || index === 0) {
        page = {
          id: cuid(),
          heading: element.title,
          sectionId: element.id,
          questions: []
        };
        sum.push(page);
        return sum;
      }

      if (element.size === 2) {
        // look at the previous page
        const previousPage = sum[sum.length - 1];
        if (!previousPage.questions.length) {
          // previous page was just a heading, no questions
          // so add to that
          previousPage.heading2 = element.title;
        } else {
          page = {
            id: cuid(),
            heading: previousPage.heading,
            heading2: element.title,
            heading3: undefined,
            sectionId: element.id,
            questions: []
          };
          sum.push(page);
        }
        return sum;
      }

      if (element.size === 3) {
        // look at the previous page
        const previousPage = sum[sum.length - 1];
        if (!previousPage.questions.length) {
          // previous page was just a heading, no questions
          // so add to that
          previousPage.heading3 = element.title;
        } else {
          page = {
            id: cuid(),
            heading: previousPage.heading,
            heading2: previousPage.heading2,
            heading3: element.title,
            sectionId: element.id,
            questions: []
          };
          sum.push(page);
        }
        return sum;
      }
    }

    // its a question
    // if (element.type !== 'section') {
      // first question, so add a page
    if (sum.length === 0) {
      sum.push({
        id: cuid(),
        heading: '',
        questions: []
      });
    }
    page = sum[sum.length - 1];
    page.questions.push(element);

    // has skip logic, so add a new page after this question
    const hasSkipLogic = _.find(element.answers, answer => answer.goTo);
    if (hasSkipLogic && index !== elements.length - 1) {
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
