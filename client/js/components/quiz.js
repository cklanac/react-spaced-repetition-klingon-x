import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

export class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }
  componentDidMount() {
    this.props.dispatch(actions.fetchQuestions());
  }

  submit(event) {
    event.preventDefault();
    this.props.dispatch(actions.submitAnswer({
      answer: event.target.answer.value,
    }));
    event.target.reset();
  }

  render() {
    const current = this.props.questions[0] || {};
    console.log(this.props.questions);
    return (
      <div>
        <h1>QuiZ</h1>
        <ul>{current.question}, {current.answer}</ul>
        <div>
          <form onSubmit={this.submit}>
            <input name="answer" type="text" autoComplete="off" />
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return { questions: state.questions };
}

export default connect(mapStateToProps)(Quiz);
