import React, {
  Component
} from 'react';
import {
  ProgressBar,
  PanelGroup,
  Panel,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
} from 'react-bootstrap';
import {
  hashHistory
} from 'react-router';
import { fromJS } from 'immutable';
import _ from 'lodash';

const significantHealthProblems = [
  'Alcoholism',
  'Arthritis',
  'Mental illness (such as depression or anxiety)',
  'Cancer',
  'Birth defects (including heart defects or spina bifida)',
  'Heart Disease',
  'Hypertension',
  'Osteoporosis',
  'Stroke',
  'Diabetes',
  'Blood clots or deep vein thrombosis (DVT)/ Pulmonary embolism',
  'Intellectual disabilities including Fragile X Syndrome or learning disabilities',
  'Repeat pregnancy loss',
  'Autoimmune conditions'
];

class FamilyHistoryContainer extends Component {
  static updateResponse(questionnaireResponse) {
    return fetch(`${process.env.REACT_APP_BASE_URL}/responses/${questionnaireResponse.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(questionnaireResponse)
    })
    .catch(console.error);
  }

  static getResponse(questionnaireId, userId) {
    return fetch(`${process.env.REACT_APP_BASE_URL}/responses?questionnaireId=${questionnaireId}&userId=${userId}`)
    .catch(console.error);
  }

  constructor(props) {
    super(props);

    const relationships = [
      'Father',
      'Mother',
      'Paternal Grandfather',
      'Paternal Grandmother',
      'Maternal Grandfather',
      'Maternal Grandmother'
      // 'Brother/Sister',
      // 'Children',
      // 'Aunts/Uncles',
      // 'Other relatives'
    ];

    const blahs = [
      // 'Brother/Sister',
      // 'Children',
      // 'Aunts/Uncles',
      // 'Other relatives'
    ]

    this.state = {
      activeKey: 0,
      selectedPageIndex: 0,
      section: 'buildingFamilyTree',
      familyHistory: fromJS(relationships.map(relationship => ({
        name: relationship,
        relationship,
        significantHealthProblems: significantHealthProblems.map(significantHealthProblem => ({
          name: significantHealthProblem,
          present: false
        }))
      })))
    };
    this.handleFamilyChange = this.handleFamilyChange.bind(this);
    this.handleGenerateFamily = this.handleGenerateFamily.bind(this);
    this.goToSection = this.goToSection;
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
  }
  handleFamilyChange(pathArray, value) {
    this.setState({
      familyHistory: this.state.familyHistory.setIn(pathArray, value)
    });
  }
  goToSection(section) {
    this.setState({
      selectedPageIndex: this.state.selectedPageIndex + 1,
      section
    });
  }
  handleGenerateFamily(relationship, count) {
    const familyHistory = new Array(parseInt(count)).fill(undefined).map((number, index) => ({
      relationship,
      name: `${relationship} ${index + 1}`,
      significantHealthProblems: significantHealthProblems.map(significantHealthProblem => ({
        name: significantHealthProblem,
        present: false
      }))
    }));
    // console.log('new family history', familyHistory, new Array(3).fill(undefined));
    this.setState({
      familyHistory: this.state.familyHistory.concat(fromJS(familyHistory))
    });
  }
  handleSelect(activeKey) {
    this.setState({ activeKey });
  }

  render() {
    const percentComplete =
      ((this.state.selectedPageIndex) / (2 + this.state.familyHistory.count())) * 100;

    function FieldGroup({ id, label, help, ...props }) {
      return (
        <FormGroup controlId={id}>
          <ControlLabel>{label}</ControlLabel>
          <FormControl {...props} />
          {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
      );
    }

    const relationshipsWithCounts = [
      ''
    ]

    return (
      <div className="container">
        {/* <h1 style={{ marginBottom: 32 }}>{this.state.version.get('title')}</h1> */}
        <h2>Family History</h2>

        {this.state.section === 'buildingFamilyTree' &&
        <div style={{ backgroundColor: 'white', padding: '24' }}>
          <h3>Building Your Family Tree</h3>
          <p>Gathering family details. Mother, father and grandparents are automatically recorded.</p>
          <div className="form-group">
            <label>
              How many brothers do you have?
            </label>
            <input
              type="number"
              className="form-control"
              placeholder=""
              onChange={e => this.handleGenerateFamily('Brother', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              How many sisters do you have?
            </label>
            <input
              type="number"
              className="form-control"
              placeholder=""
              onChange={e => this.handleGenerateFamily('Sister', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              How many sons do you have?
            </label>
            <input
              type="number"
              className="form-control"
              placeholder=""
              onChange={e => this.handleGenerateFamily('Son', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              How many daughters do you have?
            </label>
            <input
              type="number"
              className="form-control"
              placeholder=""
              onChange={e => this.handleGenerateFamily('Daughter', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              How many maternal uncles do you have (mothers side)?
            </label>
            <input
              type="number"
              className="form-control"
              placeholder=""
              onChange={e => this.handleGenerateFamily('Maternal Uncle', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              How many maternal aunts do you have (mothers side)?
            </label>
            <input
              type="number"
              className="form-control"
              placeholder=""
              onChange={e => this.handleGenerateFamily('Maternal Aunt', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              How many paternal uncles do you have?
            </label>
            <input
              type="number"
              className="form-control"
              placeholder=""
              onChange={e => this.handleGenerateFamily('Paternal Uncle', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              How many paternal aunts do you have (fathers side)?
            </label>
            <input
              type="number"
              className="form-control"
              id="exampleInputEmail1"
              placeholder=""
              onChange={e => this.handleGenerateFamily('Paternal Aunt', e.target.value)}
            />
          </div>
          <button
            className="btn btn-lg btn-success"
            onClick={() => this.goToSection('nameFamily')}
          >
            Next
          </button>
        </div>}

        {this.state.section === 'nameFamily' &&
        <div style={{ backgroundColor: 'white', padding: '24', marginTop: 24 }}>
          <h3>Name Family</h3>
          <p className="text-muted">
            Update the names of your family members.
            If you dont know a name, you can leave it as it is.
          </p>
          {this.state.familyHistory.map((family, index) =>
            <div>
              <FormGroup
                controlId="formBasicText"
                // validationState={this.getValidationState()}
              >
                <ControlLabel>{family.get('relationship')}</ControlLabel>
                <FormControl
                  type="text"
                  value={family.get('name')}
                  placeholder="Update Name"
                  onChange={e => this.handleFamilyChange([index, 'name'], e.target.value)}
                />
                <FormControl.Feedback />
                {/* <HelpBlock>Validation is based on string length.</HelpBlock> */}
              </FormGroup>
            </div>
          )}
          <button
            className="btn btn-lg btn-success"
            onClick={() => this.goToSection('medicalHistory')}
          >
            Next
          </button>
        </div>}

        {/* {this.state.section === 'medicalHistory' && */}
        <div style={{ backgroundColor: 'white', padding: '24', marginTop: 24 }}>
          <h3>Significant Medical History</h3>
          <p>For each family member, describe their medical history if you can.</p>
          <PanelGroup activeKey={this.state.activeKey} onSelect={this.handleSelect} accordion>
            {this.state.familyHistory.map((family, relationshipIndex) =>
              <Panel
                header={`${family.get('relationship')} - ${family.get('name')} (Click here)`}
                eventKey={relationshipIndex}
                key={family.get('name')}
              >
                <div>
                  <div>
                    <p><strong>Is {family.get('name')} alive?</strong></p>
                    <div className="radio">
                      <label>
                        <input type="radio" /> Yes
                      </label>
                    </div>
                    <div className="radio">
                      <label>
                        <input type="radio" /> No
                      </label>
                    </div>
                    <div className="radio">
                      <label>
                        <input type="radio" /> Unknown
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Current Age / Age at Death</label>
                    <input
                      type="number"
                      className="form-control" placeholder=""
                      value={this.state.familyHistory.getIn([relationshipIndex, 'age'])}
                      onChange={e => this.handleFamilyChange([relationshipIndex, 'age'], e.target.value)}
                    />
                  </div>

                  <h3>Health Problems</h3>
                  {family.get('significantHealthProblems').map((significantHealthProblem, significantHealthProblemIndex) =>
                    <div style={{ border: '1px solid #eee', padding: '8px 16px' }} key={significantHealthProblem.get('name')}>
                      <div className="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            checked={this.state.familyHistory.getIn([relationshipIndex, 'significantHealthProblems', significantHealthProblemIndex, 'present'])}
                            onChange={e => this.handleFamilyChange([relationshipIndex, 'significantHealthProblems', significantHealthProblemIndex, 'present'], e.target.checked)}
                          />
                          {significantHealthProblem.get('name')}
                        </label>
                      </div>
                      {this.state.familyHistory.getIn([relationshipIndex, 'significantHealthProblems', significantHealthProblemIndex, 'present']) &&
                      <div>
                        <div className="form-group">
                          <label>Age of Onset</label>
                          <input
                            type="text"
                            className="form-control"
                            value={this.state.familyHistory.getIn([relationshipIndex, 'significantHealthProblems', significantHealthProblemIndex, 'ageOfOnset'])}
                            onChange={e => this.handleFamilyChange([relationshipIndex, 'significantHealthProblems', significantHealthProblemIndex, 'ageOfOnset'], e.target.value)}
                          />
                        </div>

                        <div className="checkbox">
                          <label>
                            <input
                              type="checkbox"
                              checked={this.state.familyHistory.getIn([relationshipIndex, 'significantHealthProblems', significantHealthProblemIndex, 'deathFrom'])}
                              onChange={e => this.handleFamilyChange([relationshipIndex, 'significantHealthProblems', significantHealthProblemIndex, 'deathFrom'], e.target.checked)}
                            /> Death From?
                          </label>
                        </div>

                        <div className="form-group">
                          <label>Additional Information</label>
                          <textarea
                            type="text"
                            className="form-control"
                            value={this.state.familyHistory.getIn([relationshipIndex, 'significantHealthProblems', significantHealthProblemIndex, 'additionalInformation'])}
                            onChange={e => this.handleFamilyChange([relationshipIndex, 'significantHealthProblems', significantHealthProblemIndex, 'additionalInformation'], e.target.value)}
                          />
                        </div>
                      </div>}
                    </div>
                  )}
                </div>
                <button
                  className="btn btn-lg btn-success"
                  onClick={() => this.handleSelect(this.state.activeKey + 1)}
                >
                  Next
                </button>
              </Panel>
            )}
          </PanelGroup>
          <button className="btn btn-lg btn-success">
            Done
          </button>
        </div>
      // }
      </div>
    );
  }
}

export default FamilyHistoryContainer;
