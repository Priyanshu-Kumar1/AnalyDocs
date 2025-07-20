const base_url = 'https://analydocs.onrender.com/api/auth/'

async function login() {
    console.log('Login function called');
    const username_input = document.querySelector('.login-username-input')
    const password_input = document.querySelector('.login-password-input')

    const username = username_input.value.trim();
    const password = password_input.value.trim();
    if (!username || !password) {
        alert('Username and password cannot be empty');
        return;
    }

    try {
        const response = await fetch(base_url + 'login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        // Assuming the response contains a token or user data call prompt to notify the user
        const data = await response.json();
        alert(`Login successful! Welcome ${data.username}`);

        // redirect to console page
        window.location.href = '/console';
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }

    console.log(getCookie('access_token'));
}

async function signup() {
    console.log('Signup function called');
    const username_input = document.querySelector('.signup-username-input');
    const email_input = document.querySelector('.signup-email-input');
    const password_input = document.querySelector('.signup-password-input');

    const username = username_input.value.trim();
    const email = email_input.value.trim();
    const password = password_input.value.trim();
    if (!username || !email || !password) {
        alert('Username, email, and password cannot be empty');
        return;
    }

    try {
        const response = await fetch(base_url + 'register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Signup failed');
        }

        const data = await response.json();
        alert(`Signup successful! Welcome ${data.username || username}`);
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed. Please try again.');
    }
}

// Attach functions to window object so they can be accessed globally
window.login = login;
window.signup = signup;

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (let c of cookies) {
    const [key, value] = c.split('=');
    if (key === name) return value;
  }
  return null;
}