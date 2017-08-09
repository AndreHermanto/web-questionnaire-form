# getVisibleResponseElementIds - reducers/index.js Line 150 (The workflow for translating logic)
 - Convert the string into Object that consist questionId and answerId
    So ({Question Answer / 123 234}) will become {elementId: 123, answerId: 234}
 - Call getResponseElementAnswersById to see if there's an answer with particular answerId, if found should return the object, else should return 'NaN'. NaN.weight > 5 will return NaN
 - Evaluate the statement using !!. If return an object its TRUE, else it find 'NaN' it will be FALSE
