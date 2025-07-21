async function createProject(data) {
    try {
        const accessToken = localStorage.getItem('access_token'); // See security note above
        if (!accessToken) {
            throw new Error('No access token found. Please log in.');
        }

        const response = await fetch('projectmanager/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Important if your Django backend uses session cookies/CSRF
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            let errorMessage = 'Failed to create project.';
            // Try to parse error details from the response body if available
            try {
                const errorData = await response.json();
                if (errorData && errorData.detail) {
                    errorMessage = errorData.detail; // Common for DRF
                } else if (errorData && typeof errorData === 'object') {
                    // Try to flatten other error objects if present
                    errorMessage = JSON.stringify(errorData);
                }
            } catch (jsonError) {
                // If response is not JSON or parsing fails
                errorMessage = `HTTP error! Status: ${response.status} ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        // Successfully created project
        const responseData = await response.json(); // Await the JSON parsing
        alert('Project created successfully!'); // Consider better UX than alert
        console.log('Project created successfully, data:', responseData);
        return responseData;

    } catch (error) {
        console.error('There was a problem creating the project:', error);
        alert('Error creating project: ' + error.message); // Notify user
        // You might want to re-throw or return an error object depending on how
        // you want the calling code to handle failures.
        throw error; // Re-throw to propagate the error
    }
}