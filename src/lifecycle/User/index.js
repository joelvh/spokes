export default class User {
  register(spokes) {
    spokes.registerLifecycleEvent('User:SessionStarted', (resolve, reject) => {
      // TODO
    });

    spokes.registerLifecycleEvent('User:Identified', (resolve, reject) => {
      // TODO
    });
  }
}