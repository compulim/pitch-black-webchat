import { css } from 'glamor';
import { connectToWebChat } from 'botframework-webchat-component';
import React, { useState } from 'react';

const HIDE_SEND_BOX_CSS = css({
  left: -10000,
  position: 'absolute'
});

function getValueOrUndefined(obj, path) {
  const value = obj[path.shift()];

  if (
    !path.length
    || typeof value === 'undefined'
  ) {
    return value;
  } else {
    return getValueOrUndefined(value, path);
  }
}

function narrative({ from: { role }, text }) {
  return (
    text ?
      [
        role === 'bot' ? 'Bot said' : 'You said',
        ', \u201C',
        text,
        '\u201D'
      ]
    : role === 'bot' ?
      ['Bot said nothing.']
    :
      ['You said nothing.']
  ).join('');
}

const IMBack = ({ action, store }) =>
  <button
    onClick={ () => store.dispatch({
      type: 'WEB_CHAT/SEND_MESSAGE',
      payload: {
        text: action.value
      }
    }) }
    type="button"
  >
    { action.title }
  </button>

const MessageBack = ({ action, store }) =>
  <button
    onClick={ () => store.dispatch({
      type: 'WEB_CHAT/SEND_MESSAGE_BACK',
      payload: {
        displayText: action.displayText,
        text: action.text,
        value: action.value
      }
    }) }
  >
    { action.title }
  </button>

const PostBack = ({ action, store }) =>
  <button
    onClick={ () => store.dispatch({
      type: 'WEB_CHAT/SEND_POST_BACK',
      payload: {
        value: action.value
      }
    }) }
    type="button"
  >
    { action.title }
  </button>

const CardAction = ({
  action,
  store
}) => {
  switch (action.type) {
    case 'postBack':
      return <PostBack action={ action } store={ store } />;

    case 'messageBack':
      return <MessageBack action={ action } store={ store } />;

    default:
      return <IMBack action={ action } store={ store } />;
  }
}

const PitchBlack = ({
  activities,
  hideSendBox,
  store,
  suggestedActions
}) => {
  const [sendBoxValue, setSendBoxValue] = useState('');

  return (
    <div role="complementary">
      <div role="log">
        <ul role="none">
          { activities
              .filter(({ type }) => type === 'message')
              .map((activity, index) => {
                const activityState = getValueOrUndefined(activity, ['channelData', 'state']);
                const { from: { role }, text } = activity;
                const postBack = role === 'user' && !!(
                  getValueOrUndefined(activity, ['channelData', 'postBack'])
                  || getValueOrUndefined(activity, ['channelData', 'messageBack'])
                );
                const attachments = activity.attachments || [];

                if (!attachments.length && !text && role !== 'user') {
                  return false;
                }

                return (
                  <li key={ index } role="none">
                    {
                      <React.Fragment>
                        { role === 'user' && !!activityState &&
                          (
                            postBack ?
                              <p>Sending your response</p>
                            :
                              <p>Sending message</p>
                          )
                        }
                        { role === 'user' && activityState === 'send failed' &&
                          <p>Send failed</p>
                        }
                        { !(role === 'user' && postBack) &&
                          <p>{ narrative(activity) }</p>
                        }
                        {
                          !!attachments.length &&
                            <ul role="none">
                              { attachments.map((attachment, index) => {
                                const { content = {}, contentUrl } = attachment;
                                const { buttons = [] } = content;

                                return (
                                  <React.Fragment key={ index }>
                                    <li role="none">
                                      {
                                        contentUrl ?
                                          <a
                                            href={ contentUrl }
                                            rel="noopener noreferrer"
                                            target="_blank"
                                          >
                                            Download file at { contentUrl }
                                          </a>
                                        : content && (content.speak || content.text) ?
                                        // /^application\/vnd\.microsoft\.card\./.test(contentType) ?
                                          <p>A card saying, &ldquo;{ content.speak || content.text }&rdquo;</p>
                                        :
                                          <p>A card without captions.</p>
                                      }
                                    </li>
                                    { !!buttons.length &&
                                      <li key={ index + .5 } role="none">
                                        <p>You can response with these buttons:</p>
                                        <ul role="none">
                                          { buttons.map((button, index) =>
                                              <li key={ index } role="none">
                                                <CardAction action={ button } store={ store } />
                                              </li>
                                          ) }
                                        </ul>
                                      </li>
                                    }
                                  </React.Fragment>
                                );
                              }) }
                            </ul>
                        }
                      </React.Fragment>
                    }
                  </li>
                );
              }
            )
          }
        </ul>
      </div>
      <div
        aria-live="polite"
        role="form"
      >
        { !!suggestedActions.length &&
          <React.Fragment>
            You are suggested to reply with:
            <ul role="none">
              { suggestedActions.map((suggestedAction, index) =>
                <li key={ index } role="none">
                  <CardAction action={ suggestedAction } store={ store } />
                </li>
              ) }
            </ul>
          </React.Fragment>
        }
        <form
          onSubmit={ event => {
            event.preventDefault();

            store.dispatch({
              type: 'WEB_CHAT/SEND_MESSAGE',
              payload: {
                text: sendBoxValue
              }
            });

            setSendBoxValue('');
          } }
          role="none"
        >
          <input
            className={ hideSendBox ? HIDE_SEND_BOX_CSS : '' }
            onChange={ ({ target: { value } }) => setSendBoxValue(value) }
            onKeyDown={ event => {
              const { ctrlKey, keyCode } = event;

              if (ctrlKey && keyCode === 83) {
                event.preventDefault();

                console.log(store.getState());
              }
            } }
            aria-label={ suggestedActions.length ? 'Type your message or press SHIFT-TAB to select a response above' : 'Type your message' }
            placeholder={ suggestedActions.length ? 'Type your message or press SHIFT-TAB to select a response above' : 'Type your message' }
            style={{ width: '80%' }}
            type="text"
            value={ sendBoxValue }
          />
        </form>
      </div>
    </div>
  );
}

export default connectToWebChat(({
  activities,
  store,
  suggestedActions
}) => ({
  activities,
  store,
  suggestedActions
}))(PitchBlack)
