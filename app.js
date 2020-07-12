function setupGuides(docs) {
  let html = "";
  docs.forEach((doc) => {
    let li = `
    <li>
    <div class="collapsible-header grey lighten-4">${doc.data().title}</div>
  <div class="collapsible-body white">
    <span>${doc.data().content}</span>
  </div>
    </li>
    `;
    html += li;
  });
  let ul = document.querySelector("ul.guides");
  ul.innerHTML = html;
}

let loggedInLinks = document.querySelectorAll(".logged-in");
let loggedOutLinks = document.querySelectorAll(".logged-out");
let accdetails = document.querySelector(".account-details");
function toggleNav(user) {
  if (user) {
    loggedInLinks.forEach((item) => {
      item.style.display = "block";
    });
    loggedOutLinks.forEach((item) => {
      item.style.display = "none";
    });
    //now get data
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        const html = `
    <h6>Logged in as ${user.email}</h6>
    <h6>${doc.data().bio}</h6>
    `;
        console.log(doc.data().bio);
        accdetails.innerHTML = html;
      });
  } else {
    loggedInLinks.forEach((item) => {
      item.style.display = "none";
    });
    loggedOutLinks.forEach((item) => {
      item.style.display = "block";
    });
    accdetails.innerHTML = "";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});
