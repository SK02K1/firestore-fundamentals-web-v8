const recipeList = document.querySelector("#recipe-list");
const form = document.querySelector("#recipe-form");

const showRecipeList = ({
    title,
    author,
    createdAt
}, id) => {
    recipeList.innerHTML += `
    <li data-id="${id}" >
        <div>Recipe title: ${title}</div>
        <div>Author: ${author}</div>
        <div>Created at: ${createdAt.toDate()}</div>
        <button>delete</button>
    </li>
    `;
};

db.collection("recipes").get().then((snapshot) => {
    snapshot.docs.forEach((recipeDoc) => {
        showRecipeList(recipeDoc.data(), recipeDoc.id)
    });
}).catch((err) => console.log(err));


form.addEventListener("submit", (e) => {
    e.preventDefault();
    const now = new Date();
    const newRecipeData = {
        title: form.title.value,
        author: form.author.value,
        createdAt: firebase.firestore.Timestamp.fromDate(now)
    };

    db.collection("recipes").add(newRecipeData)
        .then(() => {
            form.reset();
            Toastify({
                text: "new recipe added",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true
            }).showToast();
            console.log("new recipe added")
        })
        .catch((err) => console.log(err));
});


recipeList.addEventListener("click", (e) => {
    const target = e.target;
    if (target.tagName === "BUTTON") {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const recipeID = target.parentElement.getAttribute("data-id");
                db.collection("recipes").doc(recipeID).delete().then(() => {
                    console.log("recipe deleted");
                }).catch((err) => console.log(err));
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        });
    }
})