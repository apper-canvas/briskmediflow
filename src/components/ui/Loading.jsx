import React from 'react'
import { motion } from 'framer-motion'

const Loading = ({ type = 'default', rows = 5, className = '' }) => {
  if (type === 'table') {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(rows)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm"
          >
            <div className="skeleton w-12 h-12 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4 rounded"></div>
              <div className="skeleton h-3 w-1/2 rounded"></div>
            </div>
            <div className="skeleton h-6 w-20 rounded-full"></div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'cards') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="skeleton h-4 w-24 rounded mb-2"></div>
                <div className="skeleton h-8 w-16 rounded"></div>
              </div>
              <div className="skeleton w-12 h-12 rounded-xl"></div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
      />
      <span className="ml-3 text-gray-500">Loading...</span>
    </div>
  )
}

export default Loading