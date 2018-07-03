import React, { Component } from 'react';
import Markdown from 'react-markdown';
import { Icon, Image } from 'semantic-ui-react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import cuid from 'cuid';

const covertVideoToEmbededUrl = url => {
  /* eslint-disable no-useless-escape */
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `//www.youtube.com/embed/${match[2]}`;
  }

  return undefined;
};

const YouTube = ({
  src,
  title,
  width,
  height,
  frameborder,
  allowfullscreen
}) => {
  const embededSrc = covertVideoToEmbededUrl(src);
  if (!embededSrc) return <div>No Video Found</div>;

  return (
    <iframe
      title={title}
      src={embededSrc}
      width={width}
      height={height}
      frameBorder={frameborder}
      allowFullScreen={allowfullscreen}
    />
  );
};
YouTube.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  frameborder: PropTypes.string,
  allowfullscreen: PropTypes.bool
};
YouTube.defaultProps = {
  title: cuid(),
  width: '560',
  height: '315',
  frameborder: '0',
  allowfullscreen: true
};

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
        {blah.map((textParts, index) => {
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
                key={index}
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
                            {glossaryTermAnnotation.glossaryTerm.synonyms &&
                              glossaryTermAnnotation.glossaryTerm.synonyms.join(
                                ', '
                              )}
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
                          <dd>
                            {glossaryTermAnnotation.glossaryTerm.image && (
                              <Image
                                src={glossaryTermAnnotation.glossaryTerm.image}
                              />
                            )}
                          </dd>
                          <dt>Video Link</dt>
                          <dd>
                            {glossaryTermAnnotation.glossaryTerm.videoLink && (
                              <YouTube
                                src={
                                  glossaryTermAnnotation.glossaryTerm.videoLink
                                }
                              />
                            )}
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
            return <span key={index}>{textParts}</span>;
          }
        })}
      </span>
    );
  }
}
