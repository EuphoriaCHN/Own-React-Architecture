import * as React from 'react';
import { observer } from 'mobx-react';

import ProjectStore from '@store/ProjectStore.js';

interface IProps {}

const App: React.FC = observer((props: IProps) => {
  '123';
  return (
    <div onClick={ProjectStore.toggleText} style={{ width: 100, height: 100, border: '1px solid #000' }}>
      {ProjectStore.text}
    </div>
  );
});

export default App;
