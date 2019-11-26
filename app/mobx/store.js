
import MapStore from './mapStore'
import observableUsersStore from './usersStore';
import DriverStore from './driverStore';
export { Provider } from 'mobx-react';


class RootStore {
  constructor () {
    this.mapStore = new MapStore();
    this.usersStore = new observableUsersStore(this);
    this.driverStore = new DriverStore();
  }
}
export default RootStore;