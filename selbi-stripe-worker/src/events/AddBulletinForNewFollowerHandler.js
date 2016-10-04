
export default class AddBulletinForNewFollower {
  accept(data) {
    return data.type === 'follow';
  }

  handle(data, firebaseDb) {

  }
}

