import { observable, action } from 'mobx';

class Project {
  @observable text = 'Mobx';
  @action.bound
  toggleText() {
    if (this.text === 'Mobx') {
      this.text = 'Euphoria';
    } else {
      this.text = 'Mobx';
    }
  }
}

export default new Project();
