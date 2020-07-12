//admin UI
const adminForm = document.querySelector(".admin-actions");
adminForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const addAdminRole = functions.httpsCallable("addAdminRole");
  addAdminRole({ email: adminForm["admin-email"].value }).then((result) => {
    console.log(result);
  });
});

//tracking auth status
auth.onAuthStateChanged((user) => {
  if (user) {
    user.getIdTokenResult().then((idTokenResult) => {
      user.admin = idTokenResult.claims.admin;
      toggleNav(user);
    });
    //database get
    db.collection("guides").onSnapshot(
      (snapshot) => {
        setupGuides(snapshot.docs);
      },
      (err) => {
        console.log(err.message);
      }
    );
  } else {
    toggleNav(user);
    let ul = document.querySelector("ul.guides");
    ul.innerHTML = `<h5 class="center-align">Please Log In to view the documents</h5>`;
  }
});

//toggling loading functions
const progressBar = document.querySelectorAll(".pb");
function startSpin() {
  progressBar.forEach((item) => {
    item.classList.add("progress");
  });
}
function stopSpin() {
  progressBar.forEach((item) => {
    item.classList.remove("progress");
  });
}

//create a new account

const signupForm = document.querySelector("#signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
  startSpin();
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      console.log("user cred on signup", cred.user.uid);
      db.collection("users")
        .doc(cred.user.uid)
        .set({ bio: signupForm["signup-bio"].value })
        .then((res) => {
          stopSpin();
          const modal = document.querySelector("#modal-signup");
          M.Modal.getInstance(modal).close();
          signupForm.reset();
        })
        .catch((err) => {
          console.log("Error on bio: ", err);
        });
    })
    .catch((err) => {
      console.log("Error on signup: ", err);
    });
});

//logging out
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut();
  location.reload();
});

//signing users in

const loginForm = document.querySelector("#login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;
  startSpin();
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    stopSpin();
    const modal = document.querySelector("#modal-login");
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });
});

//create form

const createForm = document.querySelector("#create-form");
createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  startSpin();
  db.collection("guides")
    .add({
      title: createForm["title"].value,
      content: createForm["content"].value,
    })
    .then((res) => {
      stopSpin();
      createForm.reset();
      const modal = document.querySelector("#modal-create");
      M.Modal.getInstance(modal).close();
    })
    .catch((err) => {
      console.log(err.message);
    });
});
