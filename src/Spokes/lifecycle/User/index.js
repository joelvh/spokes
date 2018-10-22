export default class User {
  register(spokes) {
    const document = this.document;

    spokes.registerLifecycleEvent('User:SessionStarted', (resolve, reject) => {
      // TODO
    });

    spokes.registerLifecycleEvent('User:Identified', (resolve, reject) => {
      // TODO
    });
  }
}