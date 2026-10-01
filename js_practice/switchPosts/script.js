const postContainer = document.querySelector("#root");
const prevPostBtn = document.querySelector(".left");
const nextPostBtn = document.querySelector(".right");

const BASE_URL = "https://jsonplaceholder.typicode.com";
const POST_KEY = "postId";

// Если сохранённого ID нет, начинаем с 1
if (localStorage.getItem(POST_KEY) === null) {
    localStorage.setItem(POST_KEY, "1");
}

const getPostById = async () => {
    const id = Number(localStorage.getItem(POST_KEY));

    // Валидация до запроса
    if (!Number.isInteger(id) || id < 1 || id > 100) {
        throw new Error("ID поста должен быть от 1 до 100");
    }

    postContainer.textContent = "Loading...";

    const response = await fetch(`${BASE_URL}/posts/${id}`);

    if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
    }

    return await response.json();
};

const renderPost = (post) => {
    postContainer.innerHTML = "";

    const card = document.createElement("div");
    const id = document.createElement("h3");
    const title = document.createElement("p");
    const body = document.createElement("p");

    card.classList.add("post");
    title.classList.add("subheader");

    id.textContent = post.id;
    title.textContent = post.title;
    body.textContent = post.body;

    card.append(id, title, body);
    postContainer.append(card);
};

const loadPost = async () => {
    try {
        const post = await getPostById();
        renderPost(post);
    } catch (error) {
        postContainer.textContent = error.message;
    }
};

const changePost = (step) => {
    const currentId = Number(localStorage.getItem(POST_KEY));
    const newId = currentId + step;

    if (newId < 1 || newId > 100) return;

    localStorage.setItem(POST_KEY, String(newId));
    loadPost();

    // Сразу блокируем обе кнопки на 350 мс
    prevPostBtn.disabled = true;
    nextPostBtn.disabled = true;

    setTimeout(() => {
        prevPostBtn.disabled = false;
        nextPostBtn.disabled = false;
    }, 350);
};

prevPostBtn.addEventListener("click", () => changePost(-1));
nextPostBtn.addEventListener("click", () => changePost(1));

loadPost();