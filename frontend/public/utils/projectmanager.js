window.createProject = async (formData) => { // Now accepts FormData
    try {
        const response = await fetch('https://analydocs.onrender.com/api/projectmanager/create/', {
            method: 'POST',
            body: formData, // Send the FormData object directly
            credentials: 'include', // Important for cookies
            // DO NOT set 'Content-Type' header here.
            // The browser will set it correctly to multipart/form-data automatically.
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to create project');
        }

        return await response.json();
    } catch (error) {
        alert(`Error creating project: ${error.message}`);
        throw error;
    }
};