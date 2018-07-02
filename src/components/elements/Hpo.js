import React, { Component } from 'react';
import { Label, FormGroup, FormControl, Glyphicon } from 'react-bootstrap';
import styled from 'styled-components';
import { connect } from 'react-redux';
import toJS from '../toJS';
import get from 'lodash.get';
import { fetchConcepts } from '../../actions/concepts';
import { getAllConcepts } from '../../reducers/concepts';

const HPOBox = styled.div`
  color: #424a54;
  padding: 15px;
  display: block;
  margin: 5px 0 5px 0;
  border: 1px solid rgb(227, 231, 241);
  wordbreak: break-all;
  &:hover {
    text-decoration: none;
    color: black;
  }
  &:focus {
    outline: none;
    text-decoration: none;
  }
`;
const TrashButton = styled(Glyphicon)`
  margin-left: 6px;
  color: #d66 !important;
  cursor: pointer;
`;
const HPO = styled(Label)`
  margin-right: 4px;
  margin-top: 5px;
  display: -webkit-inline-box !important;
  padding: 8px !important;
  font-weight: 300 !important;
  background-color: #fff !important;
  color: #333 !important;
  border: 1px solid #eee;
`;

class Hpo extends Component {
  state = {};
  excludeConcepts = (concepts, selectedConcepts) => {
    const ids = selectedConcepts.map(c => c.id);
    return concepts.filter(obj => {
      return !ids.includes(obj.uri);
    });
  };
  render() {
    const {
      onHpoChanged,
      concepts,
      answers,
      setAnswerValue,
      responseElementAnswers
    } = this.props;
    const { searchText } = this.state;
    const selectedConcepts = get(
      responseElementAnswers,
      `${answers[0].id}.concepts`,
      []
    );
    const unelectedConcepts = this.excludeConcepts(concepts, selectedConcepts);
    const datasources = get(answers, '0.datasources', []).join(',');
    return (
      <div>
        <form>
          <FormGroup>
            <FormControl
              componentClass="input"
              name="concepts"
              onChange={e => {
                this.setState({ searchText: e.target.value });
                if (e.target.value) {
                  onHpoChanged(e.target.value, datasources);
                }
              }}
            />
          </FormGroup>

          <FormGroup>
            {searchText &&
              unelectedConcepts.length > 0 &&
              unelectedConcepts.map((hpo, i) => {
                return (
                  <HPOBox key={i}>
                    {hpo.label ? hpo.label : hpo.displayLabel}
                    <button
                      type="button"
                      className="btn btn-xs btn-default pull-right"
                      onClick={concept => {
                        selectedConcepts.push({
                          id: hpo.uri,
                          label: hpo.label ? hpo.label : hpo.displayLabel,
                          datasource: hpo.datasource.acronym,
                          datasourceVersion: hpo.dataSourceVersion
                            ? hpo.dataSourceVersion.id
                            : hpo.datasource.version
                        });
                        setAnswerValue(
                          answers[0].id,
                          'concepts',
                          selectedConcepts
                        );
                      }}
                    >
                      Add
                    </button>
                    {hpo.synonyms !== undefined &&
                      hpo.synonyms.length > 0 && (
                        <p className="text-muted">
                          Also called: {hpo.synonyms.map(s => s).join(', ')}
                        </p>
                      )}
                  </HPOBox>
                );
              })}
          </FormGroup>
          <FormGroup>
            <div className="form-group">
              {selectedConcepts.map((c, ci) => {
                return (
                  <HPO key={ci}>
                    {c.id}
                    <TrashButton
                      glyph="trash"
                      onClick={() => {
                        setAnswerValue(
                          answers[0].id,
                          'concepts',
                          selectedConcepts.filter(
                            concept => concept.id !== c.id
                          )
                        );
                      }}
                    />
                  </HPO>
                );
              })}
            </div>
          </FormGroup>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const concepts = getAllConcepts(state.getIn(['entities', 'concepts']));
  return {
    concepts
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onHpoChanged: (concept, datasources) => {
      dispatch(fetchConcepts(concept, datasources));
    },
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(toJS(Hpo));
