// import pageMaker from './pageMaker';
//
// jest.mock('cuid');
// const cuid = require('cuid');
//
// // set cuid to return 1
// const cuidValue = 1;
// cuid.mockReturnValue(cuidValue);
//
// it('returns an array', () => {
//   const pages = pageMaker([]);
//   expect(Array.isArray(pages)).toBe(true);
// });
//
// it('creates a page when there is a heading', () => {
//   const pages = pageMaker([{
//     id: 28,
//     type: 'text',
//     question: 'Any additional information on cancer diagnosis',
//     answers: [
//       {
//         id: 10000000,
//         text: '', // text dont require a label
//         concepts: []
//       }
//     ]
//   }, {
//     id: 2,
//     type: 'section',
//     title: 'Genetic Testing'
//   }, {
//     id: 1,
//     type: 'radio',
//     question: 'Are you registering for yourself, your child, or another individual? (1)',
//     answers: [
//       {
//         id: 1,
//         text: 'Self',
//         type: 'radio'
//       }
//     ]
//   }, {
//     id: 3,
//     type: 'section',
//     title: 'Genetic HEading 2'
//   }, {
//     id: 3,
//     type: 'radio',
//     question: 'Have you had genetic testing? (2)',
//     description: 'Examples: chromosome microarray (CMA), single gene sequencing test, gene panel test, whole exome sequencing (WES), whole genome sequencing (WGS). (2)',
//     answers: [
//       {
//         id: 4,
//         text: 'Yes',
//         type: 'radio'
//       }
//     ]
//   }]);
//   expect(pages).toEqual([{
//     id: 1,
//     heading: '',
//     questions: [
//       {
//         id: 28,
//         type: 'text',
//         question: 'Any additional information on cancer diagnosis',
//         answers: [
//           {
//             id: 10000000,
//             text: '', // text dont require a label
//             concepts: []
//           }
//         ]
//       }
//     ]
//   }, {
//     id: 1,
//     heading: 'Genetic Testing',
//     sectionId: 2,
//     questions: [
//       {
//         id: 1,
//         type: 'radio',
//         question: 'Are you registering for yourself, your child, or another individual? (1)',
//         answers: [
//           {
//             id: 1,
//             text: 'Self',
//             type: 'radio'
//           }
//         ]
//       }
//     ]
//   }, {
//     id: 1,
//     heading: 'Genetic HEading 2',
//     sectionId: 3,
//     questions: [{
//       id: 3,
//       type: 'radio',
//       question: 'Have you had genetic testing? (2)',
//       description: 'Examples: chromosome microarray (CMA), single gene sequencing test, gene panel test, whole exome sequencing (WES), whole genome sequencing (WGS). (2)',
//       answers: [
//         {
//           id: 4,
//           text: 'Yes',
//           type: 'radio'
//         }
//       ]
//     }]
//   }]);
// });
//
//
// it('creates a page when there is skip logic', () => {
//   const pages = pageMaker([{
//     id: 2,
//     type: 'section',
//     title: 'Genetic Testing'
//   }, {
//     id: 1,
//     type: 'radio',
//     question: 'Are you registering for yourself, your child, or another individual? (1)',
//     answers: [
//       {
//         id: 1,
//         text: 'Self',
//         type: 'radio',
//         goTo: 'Hormones / Endocrine'
//       }
//     ]
//   }, {
//     id: 3,
//     type: 'radio',
//     question: 'Have you had genetic testing? (2)',
//     description: 'Examples: chromosome microarray (CMA), single gene sequencing test, gene panel test, whole exome sequencing (WES), whole genome sequencing (WGS). (2)',
//     answers: [
//       {
//         id: 4,
//         text: 'Yes',
//         type: 'radio'
//       }
//     ]
//   }, {
//     id: 4,
//     type: 'radio',
//     question: 'Are you registering for yourself, your child, or another individual? (1)',
//     answers: [
//       {
//         id: 1,
//         text: 'Self',
//         type: 'radio',
//         goTo: 'Hormones / Endocrine'
//       }
//     ]
//   }]);
//
//   expect(pages).toEqual([{
//     id: 1,
//     heading: 'Genetic Testing',
//     sectionId: 2,
//     questions: [
//       {
//         id: 1,
//         type: 'radio',
//         question: 'Are you registering for yourself, your child, or another individual? (1)',
//         answers: [
//           {
//             id: 1,
//             text: 'Self',
//             type: 'radio',
//             goTo: 'Hormones / Endocrine'
//           }
//         ]
//       }
//     ]
//   }, {
//     id: 1,
//     heading: 'Genetic Testing',
//     sectionId: 2,
//     questions: [{
//       id: 3,
//       type: 'radio',
//       question: 'Have you had genetic testing? (2)',
//       description: 'Examples: chromosome microarray (CMA), single gene sequencing test, gene panel test, whole exome sequencing (WES), whole genome sequencing (WGS). (2)',
//       answers: [
//         {
//           id: 4,
//           text: 'Yes',
//           type: 'radio'
//         }
//       ]
//     }, {
//       id: 4,
//       type: 'radio',
//       question: 'Are you registering for yourself, your child, or another individual? (1)',
//       answers: [
//         {
//           id: 1,
//           text: 'Self',
//           type: 'radio',
//           goTo: 'Hormones / Endocrine'
//         }
//       ]
//     }]
//   }]);
// });
