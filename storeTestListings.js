import firebase from 'firebase';

const newListings = [
  {
    price: 1,
    title: "autogen1",
    img: {
      url: "https://firebasestorage.googleapis.com/v0/b/selbi-react-prototype.appspot.com/o/" +
      "redbox.jpg?alt=media&token=0a57be6e-e949-4de4-8340-0820151a60ec",
      height: 1005,
      width: 754
    }
  },
  {
    price: 1,
    title: "autogen2",
    img: {
      url: "https://firebasestorage.googleapis.com/v0/b/selbi-react-prototype.appspot.com/o/" +
      "redbox.jpg?alt=media&token=0a57be6e-e949-4de4-8340-0820151a60ec",
      height: 1005,
      width: 754
    }
  },
  {
    price: 1,
    title: "autogen3",
    img: {
      url: "https://firebasestorage.googleapis.com/v0/b/selbi-react-prototype.appspot.com/o/" +
      "redbox.jpg?alt=media&token=0a57be6e-e949-4de4-8340-0820151a60ec",
      height: 1005,
      width: 754
    }
  },
  {
    price: 1,
    title: "autogen4",
    img: {
      url: "https://firebasestorage.googleapis.com/v0/b/selbi-react-prototype.appspot.com/o/" +
      "redbox.jpg?alt=media&token=0a57be6e-e949-4de4-8340-0820151a60ec",
      height: 1005,
      width: 754
    }
  },
  {
    price: 1,
    title: "autogen5",
    img: {
      url: "https://firebasestorage.googleapis.com/v0/b/selbi-react-prototype.appspot.com/o/" +
      "redbox.jpg?alt=media&token=0a57be6e-e949-4de4-8340-0820151a60ec",
      height: 1005,
      width: 754
    }
  },
];

const config = {
  apiKey: 'AIzaSyDRHkRtloZVfu-2CXADbyJ_QG3ECRtZacY',
  authDomain: 'selbi-react-prototype.firebaseapp.com',
  databaseURL: 'https://selbi-react-prototype.firebaseio.com',
  storageBucket: 'selbi-react-prototype.appspot.com',
};
firebase.initializeApp(config);

firebase
  .auth()
  .signInWithEmailAndPassword('test@selbi.io', 'tester')
  .then(() => {
    newListings
      .forEach((listing) => {
        firebase
          .database()
          .ref('listings')
          .push(listing)
      })
  })
  .catch((error) => {
    console.log(error);
  });