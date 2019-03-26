import { Components } from 'botframework-webchat-component';
import { createDirectLine } from 'botframework-webchat';
import { css } from 'glamor';
import React from 'react';

import PitchBlack from './PitchBlack';

const { Composer } = Components;

css.global('html, body, #root', {
  height: '100%'
});

const ROOT_CSS = css({
  height: '100%',

  '> *': {
    height: '100%'
  }
});

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      directLine: createDirectLine({
        secret: 'eD2lmYLFfOs.cwA.AO8.Y7q0ZZEt-0iiZI1Q4BBvRACvJyQXx1PP6vTIgFvOWP4'
      })
    };
  }

  componentDidMount() {
    const inputBox = document.querySelector('input[type="text"');

    inputBox && inputBox.focus();
  }

  render() {
    const {
      state: { directLine }
    } = this;

    return (
      <div className={ ROOT_CSS }>
        <Composer
          directLine={ directLine }
        >
          <PitchBlack />
        </Composer>
      </div>
    );
  }
}
