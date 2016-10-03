
import config from '../../config';

export default undefined;

export function getListingShareUrl(listingId) {
  const link = `${config.domain}/listing/${listingId}`;
  const shareUrl = `${config.deeplinkDomain}?link=${link}&isi=1156524902&ibi=io.selbi.app`;
  console.log(shareUrl)
  return shareUrl;
}
