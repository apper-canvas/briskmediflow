import mockData from '@/services/mockData/notifications.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage with mock data
let notifications = [...mockData]
let nextId = Math.max(...mockData.map(n => n.Id)) + 1

const notificationService = {
  async getAll() {
    await delay(300)
    return [...notifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  async getById(id) {
    await delay(200)
    const notification = notifications.find(n => n.Id === parseInt(id))
    if (!notification) {
      throw new Error('Notification not found')
    }
    return { ...notification }
  },

  async create(notificationData) {
    await delay(400)
    const newNotification = {
      Id: nextId++,
      ...notificationData,
      timestamp: new Date().toISOString(),
      read: false
    }
    notifications.push(newNotification)
    return { ...newNotification }
  },

  async update(id, notificationData) {
    await delay(300)
    const index = notifications.findIndex(n => n.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Notification not found')
    }
    
    // Prevent updating the Id field
    const { Id, ...updateData } = notificationData
    notifications[index] = { 
      ...notifications[index], 
      ...updateData 
    }
    return { ...notifications[index] }
  },

  async delete(id) {
    await delay(250)
    const index = notifications.findIndex(n => n.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Notification not found')
    }
    
    const deletedNotification = notifications[index]
    notifications.splice(index, 1)
    return { ...deletedNotification }
  },

  async markAllAsRead() {
    await delay(400)
    notifications = notifications.map(n => ({ ...n, read: true }))
    return [...notifications]
  },

  async getUnreadCount() {
    await delay(150)
    return notifications.filter(n => !n.read).length
  }
}

export default notificationService