
export default undefined;

/*
 * Converts a display name into a username.
 *
 * see http://stackoverflow.com/questions/9364400/remove-not-alphanumeric-characters-from-string-having-trouble-with-the-char
 */
export function convertToUsername(userDisplayName) {
  const displayNameWithoutSpaces = userDisplayName.replace(/\W+/g, '');
  return displayNameWithoutSpaces.toLocaleLowerCase();
}
