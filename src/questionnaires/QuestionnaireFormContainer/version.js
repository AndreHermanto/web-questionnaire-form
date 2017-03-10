export default {
  title: '',
  body: [
    {
      id: 1,
      type: 'radio',
      question: 'Are you registering for yourself, your child, or another individual? (1)',
      answers: [
        {
          text: 'Self',
          type: 'radio'
        }, {
          text: 'Child',
          type: 'radio'
        }, {
          text: 'Other (please specify)',
          type: 'radio+text'
        }
      ]
    }, {
      id: 2,
      type: 'section',
      title: 'Genetic Testing'
    }, {
      id: 3,
      type: 'radio',
      question: 'Have you had genetic testing? (2)',
      description: 'Examples: chromosome microarray (CMA), single gene sequencing test, gene panel test, whole exome sequencing (WES), whole genome sequencing (WGS). (2)',
      answers: [
        {
          text: 'Yes',
          type: 'radio'
        }, {
          text: 'No',
          type: 'radio',
          goTo: 'Health and Development'
        }, {
          text: 'No Sure',
          type: 'radio'
        }
      ]
    }, {
      id: 4,
      type: 'checkbox',
      question: ' What type(s) of genetic testing have you had? Please select all that apply. (2b)',
      answers: [
        {
          type: 'checkbox',
          text: 'Chromosomes',
          description: 'Also called chromosome analysis, karyotype, karyotype analysis, or G-band karyotype'
        }, {
          type: 'checkbox',
          text: 'Direct-to-consumer (DTC) genetic test ',
          description: '(Genetic testing that is ordered by and returned directly to the person tested rather than through a doctor, also called DTC. Please specify name of the company and/or test below, such as Counsyl, 23andMe, etc'
        }, {
          type: 'checkbox+other',
          text: 'Other (please specify)'
        }, {
          type: 'checkbox',
          text: 'I am not sure'
        }, {
          type: 'checkbox',
          text: 'Prefer not to answer'
        }
      ]
    }, {
      id: 5,
      type: 'checkbox',
      question: 'What was the reason for your genetic testing? (2c)',
      answers: [
        {
          type: 'checkbox',
          text: 'I have had symptoms of a genetic condition'
        }, {
          type: 'checkbox',
          text: 'The doctor/I wanted to confirm a diagnosis that was suspected based on my symptoms.'
        }, {
          type: 'checkbox',
          text: 'I have a family history of a genetic disorder and was NOT showing symptoms of the disorder – wanted to assess my risk.'
        }, {
          type: 'checkbox',
          text: 'I am healthy and wanted to be proactive about my health.'
        }, {
          type: 'checkbox+other',
          text: 'Other (please specify)'
        }, {
          type: 'checkbox',
          text: 'I am not sure'
        }, {
          type: 'checkbox',
          text: 'Prefer not to answer'
        }
      ]
    }, {
      id: 6,
      type: 'radio',
      question: 'Do you have a copy of your genetic test result(s)? (3)',
      answers: [
        {
          text: 'Yes',
          type: 'radio'
        }, {
          text: 'No',
          type: 'radio'
        }, {
          text: 'No Sure',
          type: 'radio'
        }
      ]
    }, {
      id: 7,
      type: 'checkbox',
      question: 'What were genetic test results? (3b)',
      answers: [
        {
          type: 'checkbox',
          text: 'Negative/normal',
          description: 'The results did not show any reasons for my symptoms, or anything else of interest. The results were considered “normal.”',
          goTo: 'Health and Development'
        }, {
          type: 'checkbox',
          text: 'Positive result with a clear or certain finding',
          description: 'The results showed a genetic change or variant that explained my symptoms or was the same result found in another family member with symptoms.'
        }, {
          type: 'checkbox',
          text: 'Positive result with an unclear or uncertain finding',
          description: 'The test did show something, but it was a genetic change or variant that has uncertain or unclear effects.)'
        }, {
          type: 'checkbox+other',
          text: 'Other (please specify)',
          goTo: 'Health and Development'
        }, {
          type: 'checkbox',
          text: 'I am not sure',
          goTo: 'Health and Development'
        }, {
          type: 'checkbox',
          text: 'Prefer not to answer',
          goTo: 'Health and Development'
        }
      ]
    }, {
      id: 8,
      type: 'section',
      title: 'Positive-clear/certain or Positive-unclear/uncertain (not needed, but in document)'
    }, {
      id: 9,
      type: 'radio',
      question: 'Have any of your family members been tested for the genetic change found on your testing? (3c)',
      answers: [
        {
          text: 'Yes',
          type: 'radio'
        }, {
          text: 'No',
          type: 'radio',
          goTo: 'Health and Development'
        }, {
          text: 'Other (please specify)',
          type: 'radio+other',
          goTo: 'Health and Development'
        }, {
          text: 'I’m not sure',
          type: 'radio',
          goTo: 'Health and Development'
        }, {
          text: 'Prefer not to answer',
          type: 'radio',
          goTo: 'Health and Development'
        }
      ]
    }, {
      id: 10,
      type: 'section',
      title: 'Family Test Results'
    }, {
      id: 11,
      type: 'checkbox',
      question: 'Which family members have been TESTED for the genetic change found on your testing? Select all that apply. (3d)',
      answers: [
        {
          type: 'checkbox',
          text: 'Mother'
        }, {
          type: 'checkbox',
          text: 'Father '
        }, {
          type: 'checkbox',
          text: 'Child'
        }, {
          type: 'checkbox',
          text: 'Sister'
        }, {
          type: 'checkbox',
          text: 'Brother '
        }, {
          type: 'checkbox',
          text: 'Maternal aunt (your mother’s sister)'
        }, {
          type: 'checkbox',
          text: 'Maternal uncle (your mother’s brother)'
        }, {
          type: 'checkbox',
          text: 'Maternal cousin (cousin on your mother’s side)'
        }, {
          type: 'checkbox',
          text: 'Maternal grandmother (your mother’s mother)'
        }, {
          type: 'checkbox',
          text: 'Maternal grandfather (your mother’s father)'
        }, {
          type: 'checkbox',
          text: 'Paternal aunt (your father’s sister) '
        }, {
          type: 'checkbox',
          text: 'Paternal uncle (your father’s brother)'
        }, {
          type: 'checkbox',
          text: 'Paternal cousin (cousin on your father’s side)'
        }, {
          type: 'checkbox',
          text: 'Paternal grandmother (your father’s mother)'
        }, {
          type: 'checkbox',
          text: 'Paternal grandfather (your father’s father)'
        }
      ]
    }, {
      id: 12,
      type: 'checkbox',
      question: 'Which family members were found to have the same genetic change found on your testing? Please select all that apply. (3e)',
      answers: [
        {
          type: 'checkbox',
          text: 'Mother'
        }, {
          type: 'checkbox',
          text: 'Father '
        }, {
          type: 'checkbox',
          text: 'Child'
        }, {
          type: 'checkbox',
          text: 'Sister'
        }, {
          type: 'checkbox',
          text: 'Brother '
        }, {
          type: 'checkbox',
          text: 'Maternal aunt (your mother’s sister)'
        }, {
          type: 'checkbox',
          text: 'Maternal uncle (your mother’s brother)'
        }, {
          type: 'checkbox',
          text: 'Maternal cousin (cousin on your mother’s side)'
        }, {
          type: 'checkbox',
          text: 'Maternal grandmother (your mother’s mother)'
        }, {
          type: 'checkbox',
          text: 'Maternal grandfather (your mother’s father)'
        }, {
          type: 'checkbox',
          text: 'Paternal aunt (your father’s sister) '
        }, {
          type: 'checkbox',
          text: 'Paternal uncle (your father’s brother)'
        }, {
          type: 'checkbox',
          text: 'Paternal cousin (cousin on your father’s side)'
        }, {
          type: 'checkbox',
          text: 'Paternal grandmother (your father’s mother)'
        }, {
          type: 'checkbox',
          text: 'Paternal grandfather (your father’s father)'
        }
      ]
    }, {
      id: 13,
      type: 'radio',
      question: 'Have you been diagnosed with a specific genetic condition? (4)',
      answers: [
        {
          text: 'Yes',
          type: 'radio'
        }, {
          text: 'No',
          type: 'radio',
          goTo: 'Health and Development'
        }, {
          text: 'I’m not sure',
          type: 'radio',
          goTo: 'Health and Development'
        }, {
          text: 'Prefer not to answer',
          type: 'radio',
          goTo: 'Health and Development'
        }
      ]
    }, {
      id: 14,
      type: 'orphanet',
      question: 'What genetic condition(s) have you been diagnosed with? Check all that apply. (4b)',
      answers: [
        {
          type: 'disease'
        }
      ]
    }, {
      id: 15,
      type: 'section',
      title: 'Health and Development',
      description: 'We\'d like to learn about your health and development. Please indicate any health or developmental concerns you currently have, or have had in the past. Include everything, even those things you don\'t think are related to your genetic diagnosis (if you have one). We will ask about each of your different body systems - if you say "yes," that you do have an issue with a particular body system, you will be taken to a set of questions where you can explain your issue in more detail.'
    }, {
      id: 16,
      type: 'section',
      title: 'Pregnancy / Birth and Delivery'
    }, {
      id: 17,
      type: 'radio',
      question: 'I have been told that there were issues during my mother\'s PREGNANCY with me and/or my DELIVERY/BIRTH. (5)',
      description: 'Examples: Mother had to be put on bed rest, there were concerns on ultrasound, you were born early (prematurely), or you had to stay in the neonatal intensive care unit (NICU).',
      answers: [
        {
          text: 'Yes',
          type: 'radio',
          concepts: [
            {
              id: 'HP:0001197',
              type: 'hpo',
              label: 'Abnormality of prenatal development or birth'
            }
          ]
        }, {
          text: 'No',
          type: 'radio',
          goTo: 'Growth'
        }, {
          text: 'I’m not sure',
          type: 'radio',
          goTo: 'Growth'
        }, {
          text: 'Prefer not to answer',
          type: 'radio',
          goTo: 'Growth'
        }
      ]
    }, {
      id: 18,
      type: 'checkbox',
      question: 'What issues were there during your mother\'s PREGNANCY with you and/or your DELIVERY/BIRTH? Please select all that apply.',
      answers: [
        {
          type: 'checkbox',
          text: 'Amniotic fluid issue',
          description: 'Too much fluid, called “polyhydramnios,” or too little fluid, called “oligohydramnios,” in the amniotic sac',
          concepts: [
            {
              id: 'HP:0001560',
              type: 'hpo',
              label: 'Abnormality of the amniotic fluid'
            }
          ]
        }, {
          type: 'checkbox',
          text: 'Decreased fetal movement',
          description: 'Baby moved less than expected during the pregnancy',
          concepts: [
            {
              id: 'HP:0001558',
              type: 'hpo',
              label: 'Decreased fetal movement'
            }, {
              id: '3740weeks',
              type: 'custom',
              label: 'Early- or Near-term birth with complications; No HP term available'
            }
          ]
        }, {
          type: 'checkbox+other',
          text: 'Other (please specify)'
        }, {
          type: 'checkbox',
          text: 'Im not sure'
        }, {
          type: 'checkbox',
          text: 'Prefer not to answer'
        }
      ]
    }, {
      id: 19,
      type: 'section',
      title: 'Growth'
    }, {
      id: 20,
      type: 'radio',
      question: 'I have had issues with my GROWTH. (6)',
      description: 'Examples: You are much shorter or taller than expected for your family, you have had significant and/or lifelong problems gaining weight, or you have significant and/or lifelong problems with obesity. You may have seen an endocrinologist or other specialist for these issues.',
      answers: [
        {
          text: 'Yes',
          type: 'radio'
        }, {
          text: 'No',
          type: 'radio',
          goTo: 'Hormones / Endocrine'
        }, {
          text: 'I’m not sure',
          type: 'radio',
          goTo: 'Hormones / Endocrine'
        }, {
          text: 'Prefer not to answer',
          type: 'radio',
          goTo: 'Hormones / Endocrine'
        }
      ]
    }, {
      id: 21,
      type: 'checkbox',
      question: 'What specific GROWTH issues have you had? Please select all that apply. (7b)',
      answers: [
        {
          type: 'checkbox',
          text: 'Amniotic fluid issue',
          description: 'Too much fluid, called “polyhydramnios,” or too little fluid, called “oligohydramnios,” in the amniotic sac',
          concepts: [
            {
              id: 'HP:0001560',
              type: 'hpo',
              label: 'Abnormality of the amniotic fluid'
            }
          ]
        }, {
          type: 'checkbox',
          text: 'Decreased fetal movement',
          description: 'Baby moved less than expected during the pregnancy',
          concepts: [
            {
              id: 'HP:0001558',
              type: 'hpo',
              label: 'Decreased fetal movement'
            }, {
              id: '3740weeks',
              type: 'custom',
              label: 'Early- or Near-term birth with complications; No HP term available'
            }
          ]
        }, {
          type: 'checkbox+other',
          text: 'Other (please specify)'
        }, {
          type: 'checkbox',
          text: 'Im not sure'
        }, {
          type: 'checkbox',
          text: 'Prefer not to answer'
        }
      ]
    }, {
      id: 22,
      type: 'section',
      title: 'Hormones / Endocrine'
    }, {
      id: 23,
      type: 'radio',
      question: 'I have had issues with my HORMONES or my hormone-producing glands (my ENDOCRINE SYSTEM). (7)',
      description: 'Examples: Issues with estrogen or testosterone levels, or function of the thyroid, parathyroid, or adrenal gland. You may have seen an endocrinologist for these issues.',
      answers: [
        {
          text: 'Yes',
          type: 'radio'
        }, {
          text: 'No',
          type: 'radio',
          goTo: 'Cancer'
        }, {
          text: 'I’m not sure',
          type: 'radio',
          goTo: 'Cancer'
        }, {
          text: 'Prefer not to answer',
          type: 'radio',
          goTo: 'Cancer'
        }
      ]
    }, {
      id: 24,
      type: 'checkbox',
      question: 'What specific HORMONE/ENDOCRINE issues have you had? Please select all that apply. (8b)',
      answers: [
        {
          type: 'checkbox',
          text: 'Amniotic fluid issue',
          description: 'Too much fluid, called “polyhydramnios,” or too little fluid, called “oligohydramnios,” in the amniotic sac',
          concepts: [
            {
              id: 'HP:0001560',
              type: 'hpo',
              label: 'Abnormality of the amniotic fluid'
            }
          ]
        }, {
          type: 'checkbox',
          text: 'Decreased fetal movement',
          description: 'Baby moved less than expected during the pregnancy',
          concepts: [
            {
              id: 'HP:0001558',
              type: 'hpo',
              label: 'Decreased fetal movement'
            }, {
              id: '3740weeks',
              type: 'custom',
              label: 'Early- or Near-term birth with complications; No HP term available'
            }
          ]
        }, {
          type: 'checkbox+other',
          text: 'Other (please specify)'
        }, {
          type: 'checkbox',
          text: 'Im not sure'
        }, {
          type: 'checkbox',
          text: 'Prefer not to answer'
        }
      ]
    }, {
      id: 25,
      type: 'section',
      title: 'Cancer'
    }, {
      id: 26,
      type: 'radio',
      question: 'I have been diagnosed with cancer (any type, at any time). (8)',
      description: 'Examples: Breast cancer, prostate cancer, osteosarcoma, or lymphoma. You may have seen an oncologist for these issues.',
      answers: [
        {
          text: 'Yes',
          type: 'radio'
        }, {
          text: 'No',
          type: 'radio',
          goTo: 'End'
        }, {
          text: 'I’m not sure',
          type: 'radio',
          goTo: 'End'
        }, {
          text: 'Prefer not to answer',
          type: 'radio',
          goTo: 'End'
        }
      ]
    }, {
      id: 27,
      type: 'checkbox',
      question: 'What type(s) of cancer have you been diagnosed with? Please select all that apply. Cancers are grouped, and some specific cancer names are asked.',
      description: 'If you want to provide more information on your cancer type, please type it in the “Additional information” box.',
      answers: [
        {
          text: 'Adrenocortical carcinoma',
          description: 'A tumor in the adrenal gland which affects hormone production',
          concepts: [
            {
              label: 'Adrenocortical carcinoma',
              id: 'HP:0006744',
              type: 'hpo'
            }
          ]
        }, {
          text: 'Breast cancer',
          concepts: [
            {
              label: 'Breast carcinoma',
              id: 'HP:0003002',
              type: 'hpo'
            }
          ]
        }, {
          text: 'Colon cancer',
          concepts: [
            {
              label: 'Colon cancer',
              id: 'HP:0003003',
              type: 'hpo'
            }
          ]
        }, {
          text: 'Hemangioblastoma',
          description: 'A tumor of blood vessel cells originating from the central nervous system',
          concepts: [
            {
              label: 'Hemangioblastoma',
              id: 'HP:0010797',
              type: 'hpo'
            }
          ]
        }, {
          text: 'Intestinal tumors or polyps',
          description: 'Multiple polyps or tumors in the intestines, not just one or a few; sometimes called “polyposis”',
          concepts: [
            {
              label: 'Intestinal polyposis',
              id: 'HP:0200008',
              type: 'hpo'
            }
          ]
        }, {
          text: 'Kidney cancer',
          concepts: [
            {
              label: 'Renal neoplasm',
              id: 'HP:0009726',
              type: 'hpo'
            }
          ]
        }, {
          text: 'Leukemia, juvenile myelomonocytic',
          description: 'JML',
          concepts: [
            {
              label: 'Juvenile myelomonocytic leukemia',
              id: 'HP:0012209',
              type: 'hpo'
            }
          ]
        }, {
          type: 'checkbox+other',
          text: 'Other (please specify)',
          goTo: 'End'
        }, {
          type: 'checkbox',
          text: 'Im not sure',
          goTo: 'End'
        }, {
          type: 'checkbox',
          text: 'Prefer not to answer',
          goTo: 'End'
        }
      ]
    }, {
      id: 28,
      type: 'text',
      question: 'Any additional information on cancer diagnosis',
      answers: [
        {
          text: '', // text dont require a label
          concepts: []
        }
      ]
    }
  ]
};
