import * as React from 'react';
import { observer } from 'mobx-react';

interface IProps {}

const App: React.FC = observer((props: IProps) => <h1>Hello, Euphoria</h1>);

export default App;
