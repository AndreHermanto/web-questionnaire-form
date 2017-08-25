import styled from 'styled-components';

const AnswerOption = styled.label`
  width: 100%;
  border: ${props => (props.active ? '1px solid #257dda' : '1px solid #eee')};
  padding: 16px 16px 16px 36px !important;
  color: ${props => (props.active ? 'white' : '#666')};
  background-color: ${props => (props.active ? '#3b99fc' : 'white')};
  margin-bottom: 8px;
  border-radius: 27px;
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
`;

export default AnswerOption;
