const api = "http://localhost:8000/posts";
let searchValue = "";

let inpHeader = $(".inp-header");
let inpDesc = $(".inp-desc");
let inpImage = $(".inp-image");
let addForm = $(".add-form");

addForm.on("submit", async (event) => {
  event.preventDefault();
  let header = inpHeader.val().trim();
  let desc = inpDesc.val().trim();
  let image = inpImage.val().trim();

  let newPost = {
    header: header,
    desc: desc,
    image: image,
  };
  for (let key in newPost) {
    if (!newPost[key]) {
      alert("Заполните все поля");
      return;
    }
  }
  const response = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });
  inpHeader.val("");
  inpDesc.val("");
  inpImage.val("");
  getPosts();
  Toastify({
    text: "Succesfully added",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "left",
    stopOnFocus: true,
    style: {
      background: "green",
    },
  }).showToast();
});

//! read

let postsList = $(".posts-list");

async function getPosts() {
  const response = await fetch(`${api}?q=${searchValue}`);
  const data = await response.json();

  let first = currentPage * postsPerPage - postsPerPage;
  let last = currentPage * postsPerPage;

  const currentPosts = data.slice(first, last);
  lastPage = Math.ceil(data.length / postsPerPage);

  if (currentPage === 1) {
    prevBtn.addClass("disabled");
  } else {
    prevBtn.removeClass("disabled");
  }

  if (currentPage === lastPage) {
    nextBtn.addClass("disabled");
  } else {
    nextBtn.removeClass("disabled");
  }

  console.log(currentPosts);
  postsList.html("");
  currentPosts.forEach((item) => {
    postsList.append(`
        <div class="post col-md-4 col-xs-12 col-sm-6 g-4">
        <div class="card post-item" id="${item.id}" >
        <img class="card-img-top" src="${item.image}"/>
        <div class="card-body">
        <button id="${
          item.id
        }"class="btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal">

          <img src="https://pics.freeicons.io/uploads/icons/png/19067155231543238878-512.png" class=" ">

         </button>

        <button class="btn-delete" id="${item.id}">

      <img src="https://pics.freeicons.io/uploads/icons/png/18192734801556282330-512.png" class=" ">

      </button>
      <button class="btn-like" id="${item.id}" >
      <image src="https://cdn-icons-png.flaticon.com/128/1029/1029132.png" class="">
    </button>
    <span>${item.likes || 0}</span>


      <h5 class="card-title">${item.header}</h5>
        <p class="card-text card-desc">${item.desc}</p>
        
        </div>
        </div>

        </div>
    
    
    
    
    `);
  });
}

getPosts();

//! Update

let editHeader = $(".edit-inp-header");
let editDesc = $(".edit-inp-desc");
let editImg = $(".edit-inp-image");
let editForm = $(".edit-form");
let editModal = $(".edit-modal");

$(document).on("click", ".btn-edit", async (event) => {
  let id = event.currentTarget.id;
  editForm.attr("id", id);
  const response = await fetch(`${api}/${id}`);
  const data = await response.json();
  editHeader.val(data.header);
  editDesc.val(data.desc);
  editImg.val(data.image);
});
editForm.on("submit", async (event) => {
  event.preventDefault();
  let header = editHeader.val().trim();
  let desc = editDesc.val().trim();
  let image = editImg.val().trim();
  let editedPost = {
    header: header,
    desc: desc,
    image: image,
  };
  let id = event.currentTarget.id;
  await fetch(`${api}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedPost),
  });
  getPosts();
  editModal.modal("hide");
  Toastify({
    text: "Succesfully updated",
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "left",
    stopOnFocus: true,
    style: {
      background: "yellow",
    },
  }).showToast();
});

//! likes

let likeCounter = $(".btn-like");

count = 0;
$(document).on("click", ".btn-like", async (event) => {
  let id = event.currentTarget.id;
  const response = await fetch(`${api}/${id}`);
  const data = await response.json();
  let likes = data.likes || 0;
  await fetch(`${api}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ likes: likes + 1 }),
  });
  getPosts();
});

//! delete
$(document).on("click", ".btn-delete", async (event) => {
  let id = event.currentTarget.id;
  await fetch(`${api}/${id}`, {
    method: "DELETE",
  });
  getPosts();
  Toastify({
    text: "Succesfully deleted",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "red",
    },
  }).showToast();
});

//! Pagination

let prevBtn = $(".prev-btn");
let nextBtn = $(".next-btn");

let postsPerPage = 6;
let currentPage = 1;
let lastPage = 1;

nextBtn.on("click", () => {
  if (currentPage === lastPage) {
    return;
  }
  currentPage++;
  getPosts();
  window.scrollTo(0, 0);
});

prevBtn.on("click", () => {
  if (currentPage === 1) {
    return;
  }
  currentPage--;
  getPosts();
  window.scrollTo(0, 0);
});

//! Search

let searchInp = $(".inp-search");
searchInp.on("input", (event) => {
  searchValue = event.target.value;
  currentPage = 1;
  getPosts();
});
