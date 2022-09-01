import React from 'react';
import AppModal from '../Modal';
import Device from '../../components/device/Device';
import Help from '../../components/help/Help';
import './Utterance.scss';


export default class Utterance extends React.Component {
    constructor(props) {
        super(props);
        const { utterance, context, contexts } = props;
        this.state = {
            utterance,
            context: context || this.getRandomContext(contexts),
        };

        this.getApps = this.getApps.bind(this);
        this.handleClickNext = this.handleClickNext.bind(this);
        this.handleClickHelp = this.handleClickHelp.bind(this);
        this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
        this.handleSwitchContextClick = this.handleSwitchContextClick.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.utterance !== this.props.utterance) {
            let { utterance } = this.props;
            utterance = utterance || "";
            this.setState({ utterance });
        }
    }

    handleTextAreaChange(event) {
        const { index, utteranceLimit, disableTextOverflow, onUtteranceChange } = this.props;
        const { context } = this.state;
        const utterance = event.target.value;
        const newUtterance = !disableTextOverflow || utterance.length <= utteranceLimit ? utterance : (this.state.utterance || "");
        this.setState({ utterance: newUtterance });
        onUtteranceChange && onUtteranceChange(index, utterance, context);
    }

    handleSwitchContextClick() {
        const { contexts } = this.props;
        const context = this.getRandomContext(contexts);
        this.setState({ context });
    }

    getApps() {
        return [
            { name: 'Map & Navigation', icon: 'truck' }, { name: 'Weather', icon: 'cloud-sun' }, { name: 'Calendar', icon: 'calendar-date' },
            { name: 'Reminders', icon: 'bookmark' }, { name: 'Messages', icon: 'chat' }, { name: 'Music & Podcasts', icon: 'music-note-beamed' },
            { name: 'Health', icon: 'heart-pulse' }, { name: 'Mail', icon: 'envelope' }, { name: 'Smart Home', icon: 'house' },
            { name: 'Events & Tickets', icon: 'ticket-perforated' }, { name: 'Shopping', icon: 'cart' }, { name: 'photos', icon: 'camera' },
        ];
    }

    getRandomContext(contexts) {
        const context = contexts[Math.floor(Math.random() * contexts.length)];
        const { onContextChange } = this.props;
        onContextChange && onContextChange(context);
        return context;
    }

    isUtteranceValid() {
        const { conjunctionWords, utteranceLimit } = this.props;
        const { utterance } = this.state;
        const conjunctionWords2 = conjunctionWords.reduce((prevVal, w) => (prevVal.concat(w['verification'] || [w['display']])), [])
        const hasUtterance = Boolean(utterance && utterance.trim().length > 0)
        const hasConjunctionWords = Boolean(conjunctionWords2 && conjunctionWords2.length > 0)
        const conjunctionWordsIncluded = (hasUtterance && hasConjunctionWords && conjunctionWords2.filter(w => utterance.toLowerCase().indexOf(w.trim().toLowerCase()) !== -1).length > 0);

        if (!hasUtterance || utterance.split(" ").length <= 2) {
            // the utterance is too short
            this.setState({ valid: false, errorMessage: <span>Please be more creative.</span> })
            return false;
        } else if (hasConjunctionWords && !conjunctionWordsIncluded) {
            // none of the mandaroty conjunctionWords are included
            this.setState({ valid: false, errorMessage: <span>Please use at least 1 of the following word: <strong>{conjunctionWords.map(w => w['display']).join(", ")}</strong>.</span> })
            return false;
        } else if ((utterance.indexOf("?") >= 0 && utterance.indexOf("?") < utterance.length * 0.5) || utterance.trim().split("?").filter(s => s.length > 0).length > 1) {
            // the utterance has been phrased as multiple utterances
            this.setState({ valid: false, errorMessage: <span>Please try to phrase the utterance as a <strong>single</strong> request (and not in multiple phrases).</span> })
            return false;
        } else if (utterance.length > utteranceLimit) {
            // the utterance is too long
            this.setState({ valid: false, errorMessage: <span>Your utterance is too long!</span> })
            return false;
        } else {
            this.setState({ valid: true });
            return true;
        }
    }

    handleClickNext(event) {
        event.preventDefault();

        if (this.isUtteranceValid()) {
            this.props.onClickNext();
        }
    }

    handleClickHelp(event) {
        this.setState({ showHelp: true, });
    }

    render() {
        const { utteranceLimit, onClickBack } = this.props;
        const { utterance, valid, errorMessage, showHelp } = this.state;
        const apps = this.getApps();

        if (showHelp) {
            return (
                <AppModal show={showHelp} onHide={() => this.setState({ showHelp: false })}>
                    <Help />
                </AppModal>
            );
        }

        return (
            <div className="utterance px-4 py-5 my-5">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="header text-center">
                                <h1 className='text-center'><span className="title-small">Your task:</span>Write a Complex Command</h1>
                                <p>Follow the requirements and write a complex
                                    command to your virtual assistant. Use the
                                    following apps in your request.</p>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-3 mb-3">
                        <div className="col">
                            <Device apps={apps} />
                        </div>
                        <div className="col align-self-center">
                            <div className="card mt-4">
                                <div className="card-header">
                                    <h3 className="text-center"><span className="intent-icon bi bi-keyboard" />Write here</h3>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <form className="g-3 needs-validation pt-1" onSubmit={this.handleSubmit} noValidate>
                                                <div className="has-validation">
                                                    <label className="form-label" style={{ "display": "none" }}>Write a complex command</label>
                                                    <textarea className={`input-textarea utterance-text form-control mb-3 ${(valid === true && "is-valid") || (valid === false && "is-invalid")}`}
                                                        rows="5" value={utterance} type="text" id="utterance" aria-describedby="help"
                                                        onChange={this.handleTextAreaChange} placeholder="Type your complex command here..." required>
                                                    </textarea>
                                                    <div className="p-1 m-1">
                                                        <span className={(utterance || "").length > utteranceLimit ? 'text-danger' : ''}>{(utterance || "").length}</span> / {utteranceLimit}
                                                    </div>
                                                    <div className="invalid-feedback">{errorMessage}</div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div >
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            <div className="actions bottom mt-4 d-grid gap-2 d-sm-flex justify-content-sm-center">
                                <button type="button" className="btn btn-outline-secondary btn-lg px-4 gap-3" onClick={onClickBack}><i className="bi bi-chevron-left" /></button>
                                <button type="button" className="btn btn-primary btn-lg px-4" onClick={this.handleClickNext}><i className="bi bi-chevron-right" /></button>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="actions float">
                    <button type="button" className="btn btn-outline-secondary btn-lg px-4 gap-3" onClick={this.handleClickHelp}><i className="bi bi-life-preserver" />Help</button>
                </div>
            </div >
        );
    }
}