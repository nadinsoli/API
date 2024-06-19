const apiEndpoint = 'https://666ffbc40900b5f87248e993.mockapi.io/posts';

async function fetchData(endpoint) {
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data;
}

function renderPosts(data) {
  const container = document.getElementById('posts-container');

  data.forEach(post => {
    const template = document.getElementById('preview').cloneNode(true);
    template.style.display = 'block'; 

    // profile picture
    const profilePicture = template.querySelector('#profilePicture');
    profilePicture.src = post.profile.profilePicture;
    profilePicture.alt = `${post.profile.username}'s profile picture`;

    // username
    const username = template.querySelector('#username');
    username.textContent = post.profile.username;

    // image source
    const img = template.querySelector('#previewImage');
    img.src = post.image;

    // description
    const description = template.querySelector('#previewDescription');
    description.textContent = post.description;

    // like count
    const likeCount = template.querySelector('#likeCount');
    likeCount.textContent = post.likes;

    // initial like button
    const likeButton = template.querySelector('#likeButton');
    likeButton.addEventListener('click', () => {
      post.isLiked =!post.isLiked;
      likeButton.classList.toggle('empty-heart');
      likeButton.classList.toggle('filled-heart');
      if (post.isLiked) {
        post.likes++;
      } else {
        post.likes--;
      }
      likeCount.textContent = post.likes;
    });

    container.appendChild(template);
  });
}

(async () => {
  const data = await fetchData(apiEndpoint);
  renderPosts(data);
})();