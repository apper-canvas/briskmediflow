import userData from '../mockData/user.json'

class UserService {
  constructor() {
    this.user = { ...userData }
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getProfile() {
    await this.delay()
    return { ...this.user }
  }

  async updateProfile(id, data) {
    await this.delay()
    
    if (id !== this.user.Id) {
      throw new Error('User not found')
    }

    // Validate required fields
    if (!data.firstName?.trim() || !data.lastName?.trim() || !data.email?.trim()) {
      throw new Error('Required fields are missing')
    }

    // Update user data
    this.user = {
      ...this.user,
      ...data,
      Id: this.user.Id, // Preserve original ID
      updatedAt: new Date().toISOString()
    }

    return { ...this.user }
  }

  async changePassword(currentPassword, newPassword) {
    await this.delay()
    
    // Simulate password validation
    if (currentPassword !== 'admin123') {
      throw new Error('Current password is incorrect')
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters')
    }

    // In a real app, this would hash and store the password
    this.user.updatedAt = new Date().toISOString()
    
    return { success: true }
  }

  async uploadAvatar(file) {
    await this.delay(1000)
    
    // Simulate file upload
    const avatarUrl = URL.createObjectURL(file)
    this.user.avatar = avatarUrl
    this.user.updatedAt = new Date().toISOString()
    
    return { ...this.user }
  }
}

export default new UserService()