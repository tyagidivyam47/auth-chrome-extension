// {
//   <script type="module">
//     import {firebase} from
//     "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
//   </script>;
// }

const firebaseConfig = {
  apiKey: "AIzaSyB0r_-Dhshdhgc6NqAxzpu27Y4_Bve1SQI",
  authDomain: "chrome-extension-auth-96da0.firebaseapp.com",
  projectId: "chrome-extension-auth-96da0",
  storageBucket: "chrome-extension-auth-96da0.appspot.com",
  messagingSenderId: "322794790468",
  appId: "1:322794790468:web:6c1e82153d346d122d6611",
};

// Initialize Firebase
//   const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);

// Initialize variables
const auth = firebase.auth();
const database = firebase.database();

// Set up our register function
function register() {
  // Get all our input fields
  email = document.getElementById("email").value;
  password = document.getElementById("password").value;
  full_name = document.getElementById("full_name").value;

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    // alert("Email or Password is Outta Line!!");
    document.getElementById("error-line").innerHTML =
      "Email or Password is wrong!";
    return;
    // Don't continue running the code
  }
  if (validate_field(full_name) == false) {
    document.getElementById("error-line").innerHTML = "Name is Required";
    return;
  }

  // Move on with Auth
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(function () {
      // Declare user variable
      var user = auth.currentUser;

      // Add this user to Firebase Database
      var database_ref = database.ref();

      // Create User data
      var user_data = {
        email: email,
        full_name: full_name,
        last_login: Date.now(),
      };

      // Push to Firebase Database
      database_ref.child("users/" + user.uid).set(user_data);

      // DOne
      //   alert("User Created!!");
    })
    .catch(function (error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code;
      var error_message = error.message;

      console.log(error_message);
    });
}

// Set up our login function
function login() {
  // Get all our input fields
  //   var bkg = chrome.extension.getBackgroundPage();
  //   bkg.console.log("foo");
  document.getElementById("error-line").innerHTML = "Loading";
  email = document.getElementById("email").value;
  password = document.getElementById("password").value;

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    document.getElementById("error-line").innerHTML =
      "Email or Password is incorrect";
    return;
    // Don't continue running the code
  }

  auth
    .signInWithEmailAndPassword(email, password)
    .then(function () {
      // Declare user variable
      var user = auth.currentUser;

      // Add this user to Firebase Database
      var database_ref = database.ref();

      // Create User data
      var user_data = {
        last_login: Date.now(),
      };

      // Push to Firebase Database
      database_ref.child("users/" + user.uid).update(user_data);

      //   console.log(user.uid);
      //   console.log(user);

      fetchDataHandler(user.uid);
      // DOne
      //   alert("User Logged In!!");
    })
    .catch(function (error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code;
      var error_message = error.message;

      console.log(error_message);
    });
}

const fetchDataHandler = async (id) => {
  const response = await fetch(
    "https://chrome-extension-auth-96da0-default-rtdb.firebaseio.com/users.json"
  );
  const Data = await response.json();
  const data = await Data[id];

  const toBeHidden = document.getElementById("form_content_inner_container");
  toBeHidden.style.display = "none";

  const toBeShown = document.getElementById("logged_in_content");
  document.getElementById("user-name").innerHTML = data.full_name;

  toBeShown.style.display = "block";
  await console.log("data : ", data);
};

const logoutHandler = () => {
  const toBeHidden = document.getElementById("logged_in_content");
  toBeHidden.style.display = "none";

  const toBeShown = document.getElementById("form_content_inner_container");
  toBeShown.style.display = "initial";
};

// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/;
  if (expression.test(email) == true) {
    // Email is good
    return true;
  } else {
    // Email is not good
    return false;
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false;
  } else {
    return true;
  }
}

function validate_field(field) {
  if (field == null) {
    return false;
  }

  if (field.length <= 0) {
    return false;
  } else {
    return true;
  }
}
