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
    <div class="post m-3 d-flex flex-column" style="width: 320px">
    <div class="d-block">
     <button class="post-item" id="${item.id}"><img class="card-image" style="width: 320px" src="${item.image}"/></button>
     </div>

     <div class="buttons d-block            ">
     
     <button id="${item.id}"class="btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal">

     <img src="https://pics.freeicons.io/uploads/icons/png/19067155231543238878-512.png" class=" ">

     </button>

     <button class="btn-delete" id="${item.id}">

      <img src="https://pics.freeicons.io/uploads/icons/png/18192734801556282330-512.png" class=" ">

      </button>
      </div>

    <div class="post-text d-block mb-3">
    <h5>${item.header}</h5>
    <span>${item.desc}</span>
    
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
});

//! delete
$(document).on("click", ".btn-delete", async (event) => {
  let id = event.currentTarget.id;
  await fetch(`${api}/${id}`, {
    method: "DELETE",
  });
  getPosts();
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
