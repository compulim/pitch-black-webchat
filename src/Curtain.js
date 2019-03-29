import { css } from 'glamor';
import React from 'react';

const ROOT_CSS = css({
  backgroundColor: 'Black',
  height: '100%',
  left: 0,
  position: 'fixed',
  top: 0,
  width: '100%'
});

export default ({ children }) =>
  <div className={ ROOT_CSS }>
    { children }
  </div>
