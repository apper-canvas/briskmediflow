import React from 'react'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
const SearchBar = ({ 
  value, 
  onChange, 
  onClear,
  placeholder = 'Search...', 
  className = '' 
}) => {
  const handleChange = (e) => {
    const newValue = e.target.value
    onChange(newValue)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // Search is now processed in real-time via onChange
    }
  }

  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        icon="Search"
        className={`max-w-md ${className}`}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
        >
          <ApperIcon name="X" size={16} />
        </button>
      )}
    </div>
  )
}

export default SearchBar