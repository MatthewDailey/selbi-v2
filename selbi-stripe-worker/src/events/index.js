
import AddBulletinForNewFollower from './AddBulletinForNewFollowerHandler';
import NotifyFollowersOfNewListingHandler from './NotifyFollowersOfNewListingHandler';
import ShouldAddBankAccountHandler from './ShouldAddBankAccountHandler';
import ClearShouldAddBankAccountHandler from './ClearShouldAddBankAccountHandler';

import FlagInappropriateContentHandler from './FlagInappropriateContentHandler';

import VerifyPhoneHandler from '../sms/VerifyPhoneHandler';
import CreatePhoneVerification from '../sms/CreatePhoneVerificationHandler';

export default undefined;

export const eventHandlers = [
  new VerifyPhoneHandler(),
  new CreatePhoneVerification(),
  new ShouldAddBankAccountHandler(),
  new ClearShouldAddBankAccountHandler(),
  new AddBulletinForNewFollower(),
  new NotifyFollowersOfNewListingHandler(),
  new FlagInappropriateContentHandler(),
];
