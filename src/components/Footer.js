import React from 'react';

export default class Footer extends React.Component {
  render() {
    return (
      <div className="dashboard-footer">
        <div className="logos-container">
          <div className="footer-logo genome-one" />
          <div className="footer-logo monarch" />
          <div className="footer-logo hpo" />
        </div>
      </div>
    );
  }
}
