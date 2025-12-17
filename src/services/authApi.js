const serverUrl = import.meta.env.VITE_SERVER_URL;
const authAPI_Url = '/api/auth';

export default class AuthApi {
    constructor() {
        this.baseUrl = serverUrl+authAPI_Url;
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.baseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            // Parse JSON response for both success and error cases
            const data = await response.json();
            console.log('Login response data:', data);

            if (!response.ok) {
                // Use the backend error message
                throw new Error(data.message || `Login failed: ${response.status} ${response.statusText}`);
            }

            // Success case
            localStorage.setItem('token', data.token);
            return data;

        } catch (error) {
            console.error('Login error:', error);
            if (error instanceof TypeError || error.message.includes('Failed to fetch')) {
                throw new Error(`Network error detected. Your login may have been successful, but the server did not respond correctly. Please check your account status before trying again.`);
            }
            throw error; // Re-throw to let calling code handle it
        }
    }

    async register(username, firstName, lastName, email, password) {
        try {
            const response = await fetch(`${this.baseUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, firstName, lastName, email, password }),
                credentials: 'include'
            });
            
            console.log('Register response:', response);
            
            // Parse the JSON response for both success and error cases
            const data = await response.json();
            console.log('Register response data:', data);
            
            if (!response.ok) {
                // Now you can access data.message which contains your backend error message
                console.log('Registration failed:', data.message);
                throw new Error(data.message || `Registration failed: ${response.status} ${response.statusText}`);
            }

            // Success case
            localStorage.setItem('token', data.token);
            return data;

        } catch (error) {
            console.error('Registration error:', error);
            if (error instanceof TypeError || error.message.includes('Failed to fetch')) {
                throw new Error(`Network error detected. Your account may have been created, but the server did not respond correctly. Please try logging in.`);
            }
            throw error; // Re-throw to let calling code handle it
        }
    }

    async checkAuth() {
        try {
            const token = this.getToken();
            
            // If no token exists, return false immediately
            if (!token) {
                return { isAuthenticated: false, user: null };
            }

            // Validate token with backend
            const response = await fetch(`${this.baseUrl}/check`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            // Parse JSON response
            const data = await response.json();
            console.log('Auth check response data:', data);

            if (!response.ok) {
                // If token is invalid/expired, remove it
                this.removeToken();
                return { 
                    isAuthenticated: false, 
                    user: null,
                    error: data.message || 'Authentication check failed'
                };
            }

            // Return the parsed data from backend
            return {
                isAuthenticated: data.isAuthenticated,
                user: data.user || null
            };

        } catch (error) {
            console.error('Auth check failed:', error);
            
            // If token is invalid/expired, remove it
            this.removeToken();
            
            return { 
                isAuthenticated: false, 
                user: null,
                error: error.message 
            };
        }
    }

    // Helper method to get token (you'll need to implement this)
    getToken() {
        return localStorage.getItem('token');
    }

    // Helper method to remove token (you'll need to implement this)
    removeToken() {
        localStorage.removeItem('token');
    }

    // Helper method to logout
    logout() {
        this.removeToken();
        return { success: true, message: 'Logged out successfully' };
    }
}