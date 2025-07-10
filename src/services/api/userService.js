import userData from '../mockData/userData';

let currentId = 1;

const userService = {
  // Get all users
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...userData];
  },

  // Get user by ID
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const parsedId = parseInt(id, 10);
    
    if (isNaN(parsedId) || parsedId <= 0) {
      throw new Error('Invalid user ID');
    }
    
    const user = userData.find(u => u.Id === parsedId);
    if (!user) {
      throw new Error('User not found');
    }
    
    return { ...user };
  },

  // Create new user
  create: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newUser = {
      Id: currentId++,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Store in localStorage for persistence
    localStorage.setItem('userProfile', JSON.stringify(newUser));
    
    return { ...newUser };
  },

  // Update user
  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      throw new Error('Invalid user ID');
    }
    
    const existingUser = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (!existingUser.Id || existingUser.Id !== parsedId) {
      throw new Error('User not found');
    }
    
    const updatedUser = {
      ...existingUser,
      ...updateData,
      Id: parsedId, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('userProfile', JSON.stringify(updatedUser));
    return { ...updatedUser };
  },

  // Delete user
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      throw new Error('Invalid user ID');
    }
    
    const existingUser = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (!existingUser.Id || existingUser.Id !== parsedId) {
      throw new Error('User not found');
    }
    
    localStorage.removeItem('userProfile');
    localStorage.removeItem('onboardingComplete');
    
    return { success: true };
  },

  // Get current user profile
  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const user = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (!user.Id) {
      return null;
    }
    
    return { ...user };
  },

  // Update user preferences
  updatePreferences: async (preferences) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const existingUser = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (!existingUser.Id) {
      throw new Error('User not found');
    }
    
    const updatedUser = {
      ...existingUser,
      preferences: {
        ...existingUser.preferences,
        ...preferences
      },
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('userProfile', JSON.stringify(updatedUser));
    return { ...updatedUser };
  }
};

export default userService;