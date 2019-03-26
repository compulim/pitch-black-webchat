import React, { useState } from 'react';
import { connectToWebChat } from 'botframework-webchat-component';

const PitchBlack = ({
  activities,
  store
}) => {
  const [sendBoxValue, setSendBoxValue] = useState('');

  return (
    <div>
      <h1>This is Web Chat.</h1>
      <ul>
        { activities
            .filter(({ type }) => type === 'message')
            .map(({ attachments = [], from: { role }, id, text }, index) =>
              <li key={ id || index }>
                {
                  role === 'bot' ?
                    <span>Bot:&nbsp;</span>
                  :
                    <span>You:&nbsp;</span>
                }
                <span>{ text }</span>
                {
                  !!attachments.length &&
                    <ul>
                      { attachments.map(attachment =>
                        <li>
                          <pre>{ JSON.stringify(attachment.content, null, 2) }</pre>
                        </li>
                      ) }
                    </ul>
                }
              </li>
            )
        }
      </ul>
      <form onSubmit={ event => {
        event.preventDefault();

        store.dispatch({
          type: 'WEB_CHAT/SEND_MESSAGE',
          payload: {
            text: sendBoxValue
          }
        });

        setSendBoxValue('');
      } }>
        <input
          onChange={ ({ target: { value } }) => setSendBoxValue(value) }
          type="text"
          value={ sendBoxValue }
        />
      </form>
    </div>
  );
}

export default connectToWebChat(({
  activities,
  store
}) => ({
  activities,
  store
}))(PitchBlack)
