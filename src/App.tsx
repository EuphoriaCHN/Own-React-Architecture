import { hot } from 'react-hot-loader';
import * as React from 'react';

import avatar from './common/images/euphoria.jpg';

import './index.scss';

const App: React.FC<{}> = (props) => {
  const render = React.useMemo(() => (
    <div className={'home'}>
      <img src={avatar} alt={'LOGO'} className={'logo'} />
      <h2>Euphoria Happy Every Day ✨</h2>
    </div>
  ), []);

  return render;
};

export default hot(module)(App);
