import { Components } from 'botframework-webchat-component';
import { createDirectLine, createStore } from 'botframework-webchat';
import { css } from 'glamor';
import React from 'react';

import Curtain from './Curtain';
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

const LIGHTS_ON_BUTTON_CSS = css({
  backgroundColor: 'transparent',
  border: 0,
  color: '#060606',
  fontSize: 100
});

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.handleLightClick = this.handleLightClick.bind(this);

    this.state = {
      directLine: createDirectLine({
        secret: 'eD2lmYLFfOs.cwA.AO8.Y7q0ZZEt-0iiZI1Q4BBvRACvJyQXx1PP6vTIgFvOWP4'
      }),
      light: false,
      store: createStore({}, () => next => action => {
        if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
          const textInputElement = document.querySelector('input[type="text"]');

          textInputElement && textInputElement.focus();
        }

        return next(action);
      })
    };
  }

  componentDidMount() {
    const inputBox = document.querySelector('input[type="text"]');

    inputBox && inputBox.focus();
  }

  handleLightClick() {
    this.setState(() => ({ light: true }));
  }

  render() {
    const {
      state: { directLine, light, store }
    } = this;

    return (
      <div className={ ROOT_CSS }>
        <Composer
          directLine={ directLine }
          store={ store }
        >
          <PitchBlack hideSendBox={ !light } />
        </Composer>
        { !light &&
          <Curtain>
            <button
              className={ LIGHTS_ON_BUTTON_CSS }
              onClick={ this.handleLightClick }
              type="button"
            >
              Lights on!
            </button>
          </Curtain>
        }
      </div>
    );
  }
}
