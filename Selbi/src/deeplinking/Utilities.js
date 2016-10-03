
import config from '../../config';

export default undefined;

export function getListingShareUrl(listingId) {
  const link = `${config.domain}/listing/${listingId}`;
  const shareUrl = `${config.deeplinkDomain}?link=${link}&idi=io.selbi.app`;
  console.log(shareUrl)
  return shareUrl;
}
