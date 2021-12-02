const recipeList = document.querySelector("#recipe-list");
const form = document.querySelector("#recipe-form");

const showRecipeList = ({title, author, createdAt}) => {
    recipeList.innerHTML += `
    <li>
        <div>Recipe title: ${title}</div>
        <div>Author: ${author}</div>
        <div>Created at: ${createdAt.toDate()}</div>
    </li>
    `;
};

db.collection("recipes").get().then((snapshot) => {
    snapshot.docs.forEach((recipeDoc) => {
        showRecipeList(recipeDoc.data())
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
    .then(() =>  {
        form.reset();
        console.log("new recipe added")
    })
    .catch((err) => console.log(err));
});