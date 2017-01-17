import React from 'react';
import { connect } from 'react-redux';
import { fetchQuestions } from './actions';

export class Questions extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchQuestions());
  }

  render() {
    const questions = this.props.questions.map((question, index) => <li key={index}>{question.question} : {question.answer}</li>);
    return <ul>{questions}</ul>;
  }
}

const mapStateToProps = (state, props) => ({
  questions: state.questions
});

export default connect(mapStateToProps)(Questions);

