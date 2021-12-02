const recipeList = document.querySelector("#recipe-list");
const form = document.querySelector("#recipe-form");
const btnUnsubscribe = document.querySelector("#btn-unsubscribe");

const addToList = ({
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

const removeFromList = (removedRecipeID) => {
    Array.from(recipeList.children).forEach((recipe) => {
        const recipeID = recipe.getAttribute("data-id");
        if (recipeID === removedRecipeID) {
            recipe.remove();
        }
    });
};


const unsubListner = db.collection("recipes").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(changedDocInfo => {

        const changeType = changedDocInfo.type;

        if (changeType === "added") {
            addToList(changedDocInfo.doc.data(), changedDocInfo.doc.id);
        } else if (changeType === "removed") {
            removeFromList(changedDocInfo.doc.id);
        }
    });;
});

btnUnsubscribe.addEventListener("click", () => {
    unsubListner();

});


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