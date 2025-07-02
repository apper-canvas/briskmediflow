import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import NotificationPanel from '@/components/molecules/NotificationPanel'
import notificationService from '@/services/api/notificationService'

const Header = ({ onMenuToggle, searchValue, onSearchChange }) => {
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getAll()
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.read).length)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }

  const handleNotificationRead = async (id) => {
    try {
      const notification = notifications.find(n => n.Id === id)
      if (notification && !notification.read) {
        await notificationService.update(id, { ...notification, read: true })
        await loadNotifications()
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6"
    >
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          icon="Menu"
          onClick={onMenuToggle}
          className="lg:hidden !p-2"
        />
        
        <div className="hidden lg:block">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search patients, doctors, appointments..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
<div className="relative">
          <Button
            variant="ghost"
            icon="Bell"
            className="!p-2 relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-error text-white text-xs rounded-full flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
          
          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications.slice(0, 5)}
            onNotificationRead={handleNotificationRead}
          />
        </div>
        
        <Button
          variant="ghost"
          icon="Settings"
          className="!p-2"
/>

        <div 
          className="flex items-center space-x-3 pl-3 border-l border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors duration-200"
          onClick={() => navigate('/profile')}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">Dr. Admin</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header