
import AddBulletinForNewFollower from './AddBulletinForNewFollowerHandler';
import NotifyFollowersOfNewListingHandler from './NotifyFollowersOfNewListingHandler';
import ShouldAddBankAccountHandler from './ShouldAddBankAccountHandler';
import ClearShouldAddBankAccountHandler from './ClearShouldAddBankAccountHandler';

export default undefined;

export const eventHandlers = [
  new ShouldAddBankAccountHandler(),
  new ClearShouldAddBankAccountHandler(),
  new AddBulletinForNewFollower(),
  new NotifyFollowersOfNewListingHandler(),
];
