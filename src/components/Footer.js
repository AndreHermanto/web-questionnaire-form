import React from 'react';
import styled from 'styled-components';

const DashboardFooter = styled.div`
  width: 100%;
  min-height: 120px;
  bottom: 0px;
  padding-bottom: 30px;
  background-color: #fff;
  border-top: 1px solid #C9C9C9;
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
          <Logo url="static/media/genomeone.1d30bbc8.jpg" />
          <Logo url="static/media/monarch.9124de21.jpg" />
          <Logo url="static/media/hpo.617083f9.jpg" />
        </LogosContainer>
      </DashboardFooter>
    );
  }
}
