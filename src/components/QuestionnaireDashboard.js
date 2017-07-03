import React from 'react';
import styled from 'styled-components';

const HeadingThree = styled.h3`
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 1px;
  color: #fff;
  text-align: center;
  margin: 5px 0px 0px 0px;
`;

export default function QuestionnaireDashboard() {
  return (
    <div className="container">
      <div className="dashboard-intro-copy">
        <h2 className="colour-dark-blue">Welcome back</h2>
        <h2 className="colour-light-blue">Its time to complete your profile</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
          vitae purus eleifend, faucibus velit at, feugiat risus. Donec mauris
          magna, rhoncus quis tristique a, facilisis eget metus. In et dolor
          arcu. Fusce at diam dui. Vestibulum sed lacinia mauris, sit amet
          vestibulum lorem. Class aptent taciti sociosqu ad litora torquent per
          conubia nostra, per inceptos himenaeos.
        </p>
      </div>
      <div className="row dashboard-container">
        <div className="col-xs-12 dashboard-header">
          <div className="dashboard-icon">
            <div className="icon" />
            <HeadingThree className="colour-dark-blue">
              PROFILE QUESTIONS
            </HeadingThree>
            <HeadingThree className="colour-light-grey fw-400">
              3 of 7 modules complete
            </HeadingThree>
          </div>
          <hr />
        </div>
        <div className="col-xs-12 col-sm-6">
          <div className="col-questionnaires">
            <HeadingThree className="colour-dark-blue">
              IN PROGRESS
            </HeadingThree>
            <ul>
              <li className="questionnaire-item">
                <div className="questionnaire-info">
                  <span className="colour-dark-blue fw-800">
                    Family History
                  </span>
                  <span className="colour-light-grey fw-400">15% complete</span>
                  <div className="percentage-complete-container">
                    <div
                      className="percentage-complete-fill"
                      style={{ width: '15%' }}
                    >
                      {' '}
                    </div>
                  </div>
                </div>
                <div className="btn-dashboard-base btn-in-progress">RESUME</div>
              </li>
              <li className="questionnaire-item">
                <div className="questionnaire-info">
                  <span className="colour-dark-blue fw-800">
                    Cultural/Social
                  </span>
                  <span className="colour-light-grey fw-400">45% complete</span>
                  <div className="percentage-complete-container">
                    <div
                      className="percentage-complete-fill"
                      style={{ width: '45%' }}
                    >
                      {' '}
                    </div>
                  </div>
                </div>
                <div className="btn-dashboard-base btn-in-progress">RESUME</div>
              </li>
            </ul>
            <HeadingThree className="colour-dark-blue">TO DO</HeadingThree>
            <ul>
              <li className="questionnaire-item">
                <div className="questionnaire-info">
                  <span className="colour-dark-blue fw-800">
                    Self-Phenotyping
                  </span>
                  <span className="colour-light-grey fw-400">0% complete</span>
                  <div className="percentage-complete-container">
                    <div
                      className="percentage-complete-fill"
                      style={{ width: '2%' }}
                    >
                      {' '}
                    </div>
                  </div>
                </div>
                <div className="btn-dashboard-base btn-to-do">START</div>
              </li>
              <li className="questionnaire-item">
                <div className="questionnaire-info">
                  <span className="colour-dark-blue fw-800">
                    Screening questionnaire
                  </span>
                  <span className="colour-light-grey fw-400">0% complete</span>
                  <div className="percentage-complete-container">
                    <div
                      className="percentage-complete-fill"
                      style={{ width: '2%' }}
                    >
                      {' '}
                    </div>
                  </div>
                </div>
                <div className="btn-dashboard-base btn-to-do">START</div>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6">
          <div className="col-questionnaires">
            <HeadingThree className="colour-forrest-green">
              COMPLETED
            </HeadingThree>
            <ul>
              <li className="questionnaire-item item-completed">
                <div className="questionnaire-info">
                  <div className="tick-icon" />
                  <span className="colour-forrest-green fw-800">
                    Exposure A
                  </span>
                  <span className="colour-light-grey fw-400">
                    100% complete
                  </span>
                </div>
                <div className="btn-dashboard-base btn-completed">REVIEW</div>
              </li>
              <li className="questionnaire-item item-completed">
                <div className="questionnaire-info">
                  <div className="tick-icon" />
                  <span className="colour-forrest-green fw-800">
                    Exposure B
                  </span>
                  <span className="colour-light-grey fw-400">
                    100% complete
                  </span>
                </div>
                <div className="btn-dashboard-base btn-completed">REVIEW</div>
              </li>
              <li className="questionnaire-item item-completed">
                <div className="questionnaire-info">
                  <div className="tick-icon" />
                  <span className="colour-forrest-green fw-800">
                    Exposure C
                  </span>
                  <span className="colour-light-grey fw-400">
                    100% complete
                  </span>
                </div>
                <div className="btn-dashboard-base btn-completed">REVIEW</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
