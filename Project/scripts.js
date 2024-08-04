// scripts.js

// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (username && password) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password); // For demo purposes
        window.location.href = 'feed.html';
    } else {
        alert('Please enter a username and password.');
    }
});

// Handle Sign Up
document.getElementById('signupForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const newUsername = document.getElementById('newUsername').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    if (newUsername && newPassword) {
        localStorage.setItem('username', newUsername);
        localStorage.setItem('password', newPassword); // For demo purposes
        window.location.href = 'feed.html';
    } else {
        alert('Please enter a username and password.');
    }
});

// Handle Logout
document.getElementById('logoutBtn')?.addEventListener('click', function() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    window.location.href = 'index.html';
});

// Load Posts and Comments
window.onload = function() {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = 'index.html';
    } else {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(posts => {
                const postsContainer = document.getElementById('posts-container');
                posts.forEach(post => {
                    const postDiv = document.createElement('div');
                    postDiv.classList.add('post');
                    postDiv.innerHTML = `
                        <div class="post-header">
                            <img src="profile-placeholder.png" alt="Profile" class="profile-pic">
                            <div>
                                <div class="username">${username}</div>
                                <div class="timestamp">${new Date().toLocaleString()}</div>
                            </div>
                        </div>
                        <h2>${post.title}</h2>
                        <p>${post.body}</p>
                        <div id="comments-${post.id}" class="comments"></div>
                    `;
                    postsContainer.appendChild(postDiv);

                    // Fetch and display comments for each post
                    fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`)
                        .then(response => response.json())
                        .then(comments => {
                            const commentsContainer = document.getElementById(`comments-${post.id}`);
                            comments.forEach(comment => {
                                const commentDiv = document.createElement('div');
                                commentDiv.classList.add('comment');
                                commentDiv.innerHTML = `
                                    <strong>${comment.name}</strong>
                                    <p>${comment.body}</p>
                                `;
                                commentsContainer.appendChild(commentDiv);
                            });
                        })
                        .catch(error => console.error('Error fetching comments:', error));
                });
            })
            .catch(error => console.error('Error fetching posts:', error));
    }
};
