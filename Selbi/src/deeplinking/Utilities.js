
import config from '../../config';

const openListingUrlPrefix = `${config.domain}/listing/`;

export default undefined;

export function getListingShareUrl(listingId) {
  const link = `${openListingUrlPrefix}${listingId}`;
  const shareUrl = `${config.deeplinkDomain}?link=${link}&isi=1156524902&ibi=io.selbi.app`;
  return shareUrl;
}

export function parseListingUrl(url) {
  if (url.startsWith(openListingUrlPrefix)) {
    return url.replace(openListingUrlPrefix, '');
  }
  return undefined;
}
