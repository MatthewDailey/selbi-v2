
const ADDED_BANK_EVENT = 'added-bank';


export default class NotifyFollowersOfNewListingHandler {
  accept(data) {
    return data.type === ADDED_BANK_EVENT;
  }

  handle(data, firebaseDb) {
    const loadUserBulletins = () => {
      return firebaseDb
        .ref('userBulletins')
        .child(data.owner)
        .once('value')
        .then((bulletinsSnapshot) => {
          if (bulletinsSnapshot.exists()) {
            return bulletinsSnapshot.val();
          }
          return {};
        });
    };

    const markShouldAddBankBulletinAsRead = (bulletins) => {
      const updateShouldAddBankBulletins = []
      Object.keys(bulletins).forEach((key) => {
        if (bulletins[key].type === 'should-add-bank-account') {
          updateShouldAddBankBulletins.push(firebaseDb
            .ref('userBulletins')
            .child(data.owner)
            .child(key)
            .update({
              status: 'read',
            }));
        }
      });
      return Promise.all(updateShouldAddBankBulletins);
    };

    return loadUserBulletins()
      .then(markShouldAddBankBulletinAsRead)
  }
}

