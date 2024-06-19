const apiEndpoint = 'https://666ffbc40900b5f87248e993.mockapi.io/posts';

const defaultUsername = 'DreamChaser';
const defaultProfilePicture = 'https://image.pngaaa.com/789/3873789-middle.png';

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
    profilePicture.src = post.profile.profilePicture || defaultProfilePicture;
    profilePicture.alt = `${post.profile.username || defaultUsername}'s profile picture`;

    // username
    const username = template.querySelector('#username');
    username.textContent = post.profile.username || defaultUsername;

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
      post.isLiked = !post.isLiked;
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

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('.addBtn');
  const addPostForm = document.getElementById('addPostForm');
  const addPostModal = new bootstrap.Modal(document.getElementById('addPostModal'));

  addBtn.addEventListener('click', () => {
      addPostModal.show();
  });

  addPostForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const imageUrl = document.getElementById('imageUrl').value;
      const description = document.getElementById('description').value;

      
      const postData = {
          profile: {
              username: defaultUsername,
              profilePicture: defaultProfilePicture
          },
          image: imageUrl,
          description: description,
          likes: 0,
          isLiked: false
      };

      try {
          const response = await fetch(apiEndpoint, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(postData)
          });

          if (!response.ok) {
              throw new Error('Failed to add post');
          }

          const newPost = await response.json();

          // Reset form 
          document.getElementById('imageUrl').value = '';
          document.getElementById('description').value = '';

         
          renderSinglePost(newPost);

          // Close modal
          addPostModal.hide();
      } catch (error) {
          console.error('Error adding post:', error);
      }
  });
});

function renderSinglePost(post) {
  const template = document.getElementById('preview').cloneNode(true);
  template.style.display = 'block';

  const profilePicture = template.querySelector('#profilePicture');
  profilePicture.src = post.profile.profilePicture || defaultProfilePicture;
  profilePicture.alt = `${post.profile.username || defaultUsername}'s profile picture`;

  const username = template.querySelector('#username');
  username.textContent = post.profile.username || defaultUsername;

  const img = template.querySelector('#previewImage');
  img.src = post.image;

  const description = template.querySelector('#previewDescription');
  description.textContent = post.description;

  const likeCount = template.querySelector('#likeCount');
  likeCount.textContent = post.likes;

  const likeButton = template.querySelector('#likeButton');
  likeButton.addEventListener('click', () => {
      post.isLiked = !post.isLiked;
      likeButton.classList.toggle('empty-heart');
      likeButton.classList.toggle('filled-heart');
      if (post.isLiked) {
          post.likes++;
      } else {
          post.likes--;
      }
      likeCount.textContent = post.likes;
  });

  const container = document.getElementById('posts-container');
  container.prepend(template);
}

