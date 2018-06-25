import React, { Component } from 'react';
import Markdown from 'react-markdown';
import { Icon } from 'semantic-ui-react';
import { Modal, Button } from 'react-bootstrap';

export default class GlossaryAnnotator extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event, text) {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      [text]: !this.state.text
    });
  }
  render() {
    const { text, glossaryTermAnnotations } = this.props;
    return (
      <Markdown
        source={text}
        escapeHtml={true}
        skipHtml={true}
        renderers={{
          text: ({ literal }) => {
            return this.renderTextWithAnnotations(
              literal,
              glossaryTermAnnotations
            );
          }
        }}
      />
    );
  }
  renderTextWithAnnotations(text, glossaryTermAnnotations) {
    if (!glossaryTermAnnotations || !glossaryTermAnnotations.length) {
      return <span>{text}</span>;
    }
    // are there any annotations in this text?

    const regexString = glossaryTermAnnotations.map(gta => gta.text).join('|');
    const re = new RegExp(`(${regexString})`);
    const blah = text.split(re);
    return (
      <span>
        {blah.map(textParts => {
          // find the matching annotation
          const glossaryTermAnnotation = glossaryTermAnnotations.find(
            gta => gta.text === textParts
          );
          if (!!glossaryTermAnnotation) {
            return (
              <span
                style={{
                  borderBottom: '1px dashed blue'
                }}
              >
                <span>{textParts}</span>
                {!this.state[glossaryTermAnnotation.text] && (
                  <button
                    onClick={e =>
                      this.handleClick(e, glossaryTermAnnotation.text)}
                    style={{
                      border: 'none',
                      backgroundColor: 'none',
                      color: 'blue',
                      width: '30px',
                      height: '30px'
                    }}
                  >
                    <Icon name="book" />
                  </button>
                )}
                {this.state[glossaryTermAnnotation.text] && (
                  <span
                    style={{
                      marginLeft: '3px',
                      fontFamily: 'serif',
                      backgroundColor: '#eeeeee',
                      fontStyle: 'italic',
                      padding: '3px 6px',
                      borderRadius: '3px'
                    }}
                  >
                    {glossaryTermAnnotation.glossaryTerm.displayText}

                    <button
                      style={{
                        color: 'blue',
                        backgroundColor: 'transparent',
                        border: 'none',
                        height: '30px'
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        this.setState({ showModalFor: null });
                        this.setState({
                          showModalFor: glossaryTermAnnotation.text
                        });
                      }}
                    >
                      Full Definition
                    </button>
                    <Modal
                      show={
                        this.state.showModalFor === glossaryTermAnnotation.text
                      }
                    >
                      <Modal.Header>
                        <Modal.Title>
                          {glossaryTermAnnotation.glossaryTerm.name}
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <dl>
                          <dt>Definition</dt>
                          <dd>
                            {glossaryTermAnnotation.glossaryTerm.definition}
                          </dd>
                          <dt>Synonyms</dt>
                          <dd>
                            {glossaryTermAnnotation.glossaryTerm.synonyms}
                          </dd>
                          <dt>Definition</dt>
                          <dd>
                            {glossaryTermAnnotation.glossaryTerm.definition}
                          </dd>
                          <dt>Display Text</dt>
                          <dd>
                            {glossaryTermAnnotation.glossaryTerm.displayText}
                          </dd>
                          <dt>Phonetic Representation</dt>
                          <dd>
                            {
                              glossaryTermAnnotation.glossaryTerm
                                .phoneticRepresentation
                            }
                          </dd>
                          <dt>Image</dt>
                          <dd>{glossaryTermAnnotation.glossaryTerm.image}</dd>
                          <dt>Video Link</dt>
                          <dd>
                            {glossaryTermAnnotation.glossaryTerm.videoLink}
                          </dd>
                          <dt>External Resource Link</dt>
                          <dd>
                            {
                              glossaryTermAnnotation.glossaryTerm
                                .externalResourceLink
                            }
                          </dd>
                        </dl>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            this.setState({ showModalFor: null });
                          }}
                        >
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </span>
                )}
              </span>
            );
          } else {
            return <span>{textParts}</span>;
          }
        })}
      </span>
    );
  }
}
