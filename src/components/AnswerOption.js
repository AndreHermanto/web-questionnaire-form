import styled from 'styled-components';

const AnswerOption = styled.label`
  width: 100%;
  border: ${props => (props.active ? '1px solid #96C65E' : '1px solid #eee')};
  padding: 16px 16px 16px 36px !important;
  color: ${props => (props.active ? '#7bb13d' : '#666')};
  background-color: ${props => (props.active ? '#F0F7E7' : 'white')};
  margin-bottom: 8px;
`;

export default AnswerOption;
