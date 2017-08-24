import React from 'react';
import styled from 'styled-components';
import genomeone from '../assets/images/genomeone.jpg';
import monarch from '../assets/images/monarch.jpg';
import hpo from '../assets/images/hpo.jpg';

const DashboardFooter = styled.div`
  width: 100%;
  min-height: 110px;
  position: absolute;
  left: 0px;
  bottom: 0px;
  padding-bottom: 25px;
  background-color: #fff;
  border-top: 1px solid #c9c9c9;
`;

const LogosContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  top: 15px;
`;

const Logo = styled.div`
  display: inline-block;
  width: 120px;
  height: 65px;
  margin: 10px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url(${props => props.url});
`;

export default class Footer extends React.Component {
  render() {
    return (
      <DashboardFooter>
        <LogosContainer>
          <Logo url={genomeone} />
          <Logo url={monarch} />
          <Logo url={hpo} />
        </LogosContainer>
      </DashboardFooter>
    );
  }
}
