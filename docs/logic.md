# getVisibleResponseElementIds - reducers/index.js Line 150 (The workflow for translating logic)
 - It will filter visibile questions based on type(it will not be visible if it is end page) and logic
 - The values of the logic comes from the builder as a string
 - Convert the string into Object that consist questionId and answerId
    So ({Question Answer / 123 234}) will become {elementId: 123, answerId: 234}
 - Call getResponseElementAnswersById to see if there's an answer with particular answerId, if found should return the object, else should return 'NaN'. NaN.weight > 5 will return NaN
 - Evaluate the statement using !!. If return an object its TRUE, else if it find 'NaN' it will be FALSE because of the !! operator
