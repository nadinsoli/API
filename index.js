/**
 * Store
 * State
 * Actions
 * Reducer
 */

const apiEndpoint = 'https://666ffbc40900b5f87248e993.mockapi.io/posts';

const defaultUsername = 'DreamChaser';
const defaultProfilePicture = 'https://image.pngaaa.com/789/3873789-middle.png';

const initialState = {
  posts: []
};

// Actions
const ActionTypes = {
  FETCH_POSTS_SUCCESS: 'FETCH_POSTS_SUCCESS',
  ADD_POST_SUCCESS: 'ADD_POST_SUCCESS',
  TOGGLE_LIKE: 'TOGGLE_LIKE'
};

function fetchPostsSuccess(posts) {
  return {
    type: ActionTypes.FETCH_POSTS_SUCCESS,
    payload: posts
  };
}

function addPostSuccess(newPost) {
  return {
    type: ActionTypes.ADD_POST_SUCCESS,
    payload: newPost
  };
}

function toggleLike(postId) {
  return {
    type: ActionTypes.TOGGLE_LIKE,
    payload: postId
  };
}

// Reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.FETCH_POSTS_SUCCESS:
      return {
        ...state,
        posts: action.payload
      };
    case ActionTypes.ADD_POST_SUCCESS:
      return {
        ...state,
        posts: [...state.posts, action.payload]
      };
    case ActionTypes.TOGGLE_LIKE:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.payload) {
            return {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            };
          }
          return post;
        })
      };
    default:
      return state;
  }
}

// Store
class Store {
  constructor(reducer, initialState) {
    this.reducer = reducer;
    this.state = initialState;
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  dispatch(action) {
    this.state = this.reducer(this.state, action);
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}


const store = new Store(reducer, initialState);


async function fetchPosts() {
  try {
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const data = await response.json();
    store.dispatch(fetchPostsSuccess(data));
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}


async function addPost(postData) {
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
    store.dispatch(addPostSuccess(newPost));
    return newPost;
  } catch (error) {
    console.error('Error adding post:', error);
  }
}


function render() {
  const { posts } = store.getState();
  const container = document.getElementById('posts-container');
  container.innerHTML = ''; 

  posts.forEach(post => {
    const template = document.createElement('div');
    template.classList.add('preview');
    template.innerHTML = `
      <div id="profile" class="d-flex align-items-center">
        <img id="profilePicture" src="${post.profile.profilePicture || defaultProfilePicture}" alt="Profile Picture" class="profile-picture">
        <span id="username" class="username">${post.profile.username || defaultUsername}</span>
      </div>
      <img id="previewImage" src="${post.image}" alt="Image" class="w-100 mb-3">
      <div class="post-details">
        <div class="like-section d-flex justify-content-between align-items-center mb-2">
          <span><span id="likeCount">${post.likes}</span> likes</span>
          <button id="likeButton-${post.id}" class="like-button ${post.isLiked ? 'filled-heart' : 'empty-heart'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
            </svg>
          </button>
        </div>
        <p id="description">${post.description}</p>
      </div>
    `;

    container.appendChild(template);

  
    const likeButton = document.getElementById(`likeButton-${post.id}`);
    likeButton.classList.toggle('filled-heart', post.isLiked); 

    likeButton.addEventListener('click', () => {
      store.dispatch(toggleLike(post.id));
    });
  });
}



store.subscribe(render);


fetchPosts();


document.addEventListener('DOMContentLoaded', () => {
  const addPostForm = document.getElementById('addPostForm');
  const addPostModal = new bootstrap.Modal(document.getElementById('addPostModal'));

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
      const newPost = await addPost(postData);
      // Reset form
      document.getElementById('imageUrl').value = '';
      document.getElementById('description').value = '';

      // Close modal
      addPostModal.hide();
    } catch (error) {
      console.error('Error adding post:', error);
    }
  });
});

