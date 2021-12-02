const recipeList = document.querySelector("#recipe-list");

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