Selbi Firebase Backendend
-------------------------
This repo includes the schema for Selbi Firebase and includes a suite of unit tests to verify that
schema and demonstrate how to properly query.

We prefer a flat schema because Firebase loads the entire json hierarchy below the query. For
example, /users will load all user data but /users/<uid> will only load that user's data.


Query Types
===========
1. Find listings near me.
- Query /geolistings to get ids
- Query /listings/<listing id>


2. Find my friend's listings.
Steps:
- Query /users/<uid>/friends to get list of friend user ids.
- Query /users/<friend uid>/active_listings for list of listing ids.
- Query /listings/<listing id> for listing data.

Note the first query should be cached locally already.


Interaction Types
=================
1. Create / update user data.

2. Create / update listing.

3. Purchase listing.


Note on Object Creation Order
============================
We always create the object (eg user or listing) then bind it to an index (eg. geolistings). This
ordering means that when searching the index, we will always find valid data.


Firebase Database Endpoints
===========================

/users
- user data.
- conatins pointers to all listings, chatRooms


/userListings/<uid>/inactive - editable by user
/userListings/<uid>/private - editable by user
/userListings/<uid>/public - editable by user
/userListings/<uid>/purchasePending - editable only by service account
/userListings/<uid>/sold - editable only by service account

/listings
- listing data.
- intended to be access directly (eg. /listings/<listing_id>)

/geolistings
- tie together: geo + listing id
- https://github.com/firebase/geofire-js/blob/master/docs/reference.md

/requestedPayments
- only visible to service account
- listened to by stripe managing server.

/historicalPayments
- complete history of payment data.
- write only, not editable.
- should be put in cold storage system.

/historicalEmails
- complete history of emails sent.
- should be put in cold storage system.

/chatRooms
- tie together: listing, seller id and buyer id + pointer to list of messages.
- /chatRooms/<id>/ visible to participants. can be created by anyone

/chatMessages/<room id>
- actual list of messages
- only visible to chat room participants


Friends format and process
==========================
Friends are modelled as a bi-directional link.

/friendRequests/$uid
- get list of people requesting to be friends with user

/friends/$uid
- get list of people who have accepted friends



Listings States and where they'll be stored.
===========================================

Inactive
- only visible to owner
- data in /listings/<listing id>
- pointer in /users/<uid>/listings/inactive

Private Active
- visible only to friends and via direct link
- data in /listings/<listing id>
- pointer in /users/<uid>/listings/private

Public Active
- visible to anyone and via direct link
- data in /listings/<listing id>
- pointer in /users/<uid>/listings/public
- pointer in /geolistings

Purchase Pending
- visible to owner and buyer
- data in /listings/<listing id>
- pointer in /users/<uid>/listings/purchasePending
- pointer in /purchasePending

Sold
- only visible to owner.
- data in /listings/<listing id>
- temporary pointer in /saleAcknowledged
- pointer in /users/<uid>/listings/sold



How a Purchase Works
====================
1. Buyer adds listing id to /purchasePending. This locks updates to /listing/<listing id> so price is fixed.
2. Service account watching /purchasePending marks the listing for itself.
3. Service account moves the listing from 'private' or 'public' to /users/<seller id>/listings/purchasePending
4. Service account sends notification emails/texts to buyer and seller (plus logging).

[seller approves]
5. Seller puts positive answer in /saleAcknowledged with pointer to listing. [If shipping enabled, includes package tracking info]
6. Service account watching /saleAcknowledged markes the sale for itself.
7. Service account removes /saleAcknowledged, handles stripe payments, moves listing from /users/../purchasePending to sold and removes from /purchasePending

[seller denies]
5. Seller put negative answer in /saleAcknowledge with pointer to listing.
6. Service account watching /saleAcknowledged markes the sale for itself.
7. Service account send notification emails, moves listing from /users/../purchasePending back to inactive and removes from /purchasePending

[seller doesn't acknowledge]
5. Buyer contacts support and we handle it manually.