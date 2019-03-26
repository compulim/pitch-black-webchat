import React, { useState } from 'react';
import { connectToWebChat } from 'botframework-webchat-component';

function narrative({ from: { role }, text }) {
  return [
    role === 'bot' ? 'Bot said' : 'You said',
    ', \u201C',
    text,
    '\u201D'
  ];
}

const PitchBlack = ({
  activities,
  store
}) => {
  const [sendBoxValue, setSendBoxValue] = useState('');
  const botActivities = activities.filter(({ from: { role } }) => role === 'bot');
  const userActivities = activities.filter(({ from: { role } }) => role === 'user');
  const lastBotActivity = botActivities[botActivities.length - 1];
  const lastUserActivity = userActivities[userActivities.length - 1];

  // if (lastUserActivity) {
  //   console.log(`${ lastUserActivity.id } ---`);
  //   console.log(lastUserActivity.channelData.state);
  //   console.log();
  // }

  return (
    <div>
      <h1>This is Web Chat.</h1>
      {/* <div role="status">
        { lastUserActivity ?
            lastUserActivity.channelData.state === 'sending' ?
              'Sending message'
            : lastUserActivity.channelData.state === 'sent' ?
              'Message sent'
            : false
          :
            false
        }
      </div> */}
      <div role="log">
        <ul role="presentation">
          { activities
              .filter(({ type }) => type === 'message')
              .map((activity, index) =>
                <React.Fragment key={ index }>
                  { activity.from.role === 'user' && !!activity.channelData && !!activity.channelData.state &&
                    <li role="presentation">Sending message</li>
                  }
                  { activity.from.role === 'user' && !!activity.channelData && activity.channelData.state === 'send failed' &&
                    <li role="presentation">Send failed</li>
                  }
                  <li role="presentation">
                    { narrative(activity) }
                    {
                      !!(activity.attachments || []).length &&
                        <ul>
                          { activity.attachments.map(({ content, contentType }, index) =>
                            <li key={ index }>
                              {
                                /^application\/vnd\.microsoft\.card\./.test(contentType) ?
                                  <span>A card saying, &ldquo;{ content.speak }&rdquo;</span>
                                :
                                  false
                              }
                            </li>
                          ) }
                        </ul>
                    }
                  </li>
                </React.Fragment>
              )
          }
        </ul>
      </div>
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
          placeholder="Type your message"
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
