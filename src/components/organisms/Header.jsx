import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'

const Header = ({ onMenuToggle, searchValue, onSearchChange }) => {
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
        <Button
          variant="ghost"
          icon="Bell"
          className="!p-2 relative"
        >
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
        </Button>
        
        <Button
          variant="ghost"
          icon="Settings"
          className="!p-2"
        />

        <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
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