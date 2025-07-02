import React, { useState } from 'react'
import Sidebar from '@/components/organisms/Sidebar'
import Header from '@/components/organisms/Header'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  // Enhanced search functionality - now properly processes search
  const handleSearchChange = (value) => {
    setSearchValue(value)
    // Trigger search processing in child components
    if (value.trim()) {
      console.log('Processing search for:', value)
    }
  }

  // Clear search functionality
  const clearSearch = () => {
    setSearchValue('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Header
          onMenuToggle={() => setSidebarOpen(true)}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onClearSearch={clearSearch}
        />
        
        <main className="py-6 px-4 lg:px-6">
          {/* Clone children and pass search props */}
          {React.cloneElement(children, { 
            searchValue, 
            onSearchChange: handleSearchChange,
            onClearSearch: clearSearch 
          })}
        </main>
      </div>
    </div>
  )
}

export default Layout