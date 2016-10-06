
import AddBulletinForNewFollower from './AddBulletinForNewFollowerHandler';
import NotifyFollowersOfNewListingHandler from './NotifyFollowersOfNewListingHandler';

export default undefined;

export const eventHandlers = [
  new AddBulletinForNewFollower(),
  new NotifyFollowersOfNewListingHandler(),
];
