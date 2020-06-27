import * as React from 'react';
import logo from './euphoria.jpg';

import './App.scss';

interface IProps { }

const App: React.FC<IProps> = props => {
  const render = React.useMemo(() => (
    <div className={'main'}>
      <img className={'logo'} src={logo} />
      <h2>Euphoria Happy Every Day ✨</h2>
    </div>
  ), []);

  return render;
};

export default App;
