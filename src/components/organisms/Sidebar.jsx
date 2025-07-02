import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onClose }) => {
const navigationItems = [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/patients', label: 'Patients', icon: 'Users' },
    { path: '/appointments', label: 'Appointments', icon: 'Calendar' },
    { path: '/doctors', label: 'Doctors', icon: 'UserCheck' },
    { path: '/billing', label: 'Billing', icon: 'Receipt' },
    { path: '/inventory', label: 'Inventory', icon: 'Package' },
    { path: '/reports', label: 'Reports', icon: 'BarChart3' },
    { path: '/notifications', label: 'Notifications', icon: 'Bell' },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-3">
          <ApperIcon name="Activity" size={20} className="text-white" />
        </div>
        <h1 className="text-xl font-bold gradient-text font-display">
          MediFlow Hub
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => window.innerWidth < 1024 && onClose()}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border border-primary-200'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`
            }
          >
            <ApperIcon name={item.icon} size={18} className="mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg p-4">
          <div className="flex items-center">
            <ApperIcon name="Lightbulb" size={20} className="text-accent-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-accent-800">Need Help?</p>
              <p className="text-xs text-accent-600">View documentation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar