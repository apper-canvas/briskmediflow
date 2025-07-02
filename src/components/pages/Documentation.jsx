import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'

const Documentation = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSection, setActiveSection] = useState('getting-started')

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: 'PlayCircle' },
    { id: 'dashboard', title: 'Dashboard Guide', icon: 'LayoutDashboard' },
    { id: 'patients', title: 'Patient Management', icon: 'Users' },
    { id: 'appointments', title: 'Appointments', icon: 'Calendar' },
    { id: 'doctors', title: 'Doctor Management', icon: 'UserCheck' },
    { id: 'billing', title: 'Billing & Invoices', icon: 'Receipt' },
    { id: 'inventory', title: 'Inventory Management', icon: 'Package' },
    { id: 'reports', title: 'Reports & Analytics', icon: 'BarChart3' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: 'AlertCircle' },
    { id: 'support', title: 'Support & Contact', icon: 'HelpCircle' }
  ]

  const faqItems = [
    {
      question: 'How do I add a new patient?',
      answer: 'Navigate to the Patients page and click the "Add Patient" button. Fill in the required information including personal details, contact information, and medical history.'
    },
    {
      question: 'How can I schedule an appointment?',
      answer: 'Go to the Appointments page, click "Schedule Appointment", select the patient and doctor, choose an available time slot, and confirm the booking.'
    },
    {
      question: 'How do I generate reports?',
      answer: 'Visit the Reports page, select the type of report you need, choose the date range, and click "Generate Report". You can export reports in PDF or Excel format.'
    },
    {
      question: 'How do I manage medicine inventory?',
      answer: 'Use the Inventory page to view current stock levels, add new medicines, update quantities, and set low-stock alerts for automatic notifications.'
    }
  ]

  const getContentForSection = (sectionId) => {
    const content = {
      'getting-started': {
        title: 'Getting Started with MediFlow Hub',
        content: (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <ApperIcon name="Info" size={20} className="text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-blue-800">Welcome to MediFlow Hub</h3>
              </div>
              <p className="text-blue-700">
                MediFlow Hub is a comprehensive hospital management system designed to streamline your healthcare operations. 
                This documentation will help you get the most out of all features.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Start Guide</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-primary-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Set Up Your Profile</h4>
                    <p className="text-gray-600 text-sm">Complete your user profile with your role and contact information.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-primary-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Explore the Dashboard</h4>
                    <p className="text-gray-600 text-sm">Familiarize yourself with the main dashboard and key metrics.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-primary-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Start Managing Data</h4>
                    <p className="text-gray-600 text-sm">Begin adding patients, scheduling appointments, and managing your workflow.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      },
      'dashboard': {
        title: 'Dashboard Overview',
        content: (
          <div className="space-y-6">
            <p className="text-gray-600">
              The dashboard provides a comprehensive overview of your hospital's key metrics and activities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Patient Statistics</h4>
                <p className="text-gray-600 text-sm">View total patients, new registrations, and patient demographics.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Appointment Overview</h4>
                <p className="text-gray-600 text-sm">Monitor today's appointments, upcoming schedules, and appointment trends.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Revenue Tracking</h4>
                <p className="text-gray-600 text-sm">Track daily, weekly, and monthly revenue with detailed analytics.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Inventory Alerts</h4>
                <p className="text-gray-600 text-sm">Monitor low-stock medicines and upcoming expiry dates.</p>
              </div>
            </div>
          </div>
        )
      },
      'support': {
        title: 'Support & Contact',
        content: (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <ApperIcon name="MessageCircle" size={20} className="text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-green-800">Need Additional Help?</h3>
              </div>
              <p className="text-green-700 mb-4">
                Our support team is here to help you with any questions or issues you may encounter.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <ApperIcon name="Mail" size={16} className="text-green-600 mr-2" />
                  <span className="text-green-700">support@mediflow.com</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Phone" size={16} className="text-green-600 mr-2" />
                  <span className="text-green-700">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Clock" size={16} className="text-green-600 mr-2" />
                  <span className="text-green-700">Monday - Friday, 9 AM - 6 PM EST</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Additional Resources</h3>
              <div className="space-y-2">
                <a href="#" className="flex items-center text-primary-600 hover:text-primary-700">
                  <ApperIcon name="ExternalLink" size={16} className="mr-2" />
                  Video Tutorials
                </a>
                <a href="#" className="flex items-center text-primary-600 hover:text-primary-700">
                  <ApperIcon name="ExternalLink" size={16} className="mr-2" />
                  Community Forum
                </a>
                <a href="#" className="flex items-center text-primary-600 hover:text-primary-700">
                  <ApperIcon name="ExternalLink" size={16} className="mr-2" />
                  Feature Requests
                </a>
              </div>
            </div>
          </div>
        )
      }
    }
    
    return content[sectionId] || content['getting-started']
  }

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredFAQs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center mb-4">
          <ApperIcon name="BookOpen" size={32} className="text-primary-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
            <p className="text-gray-600">Everything you need to know about MediFlow Hub</p>
          </div>
        </div>
        
        <div className="max-w-md">
          <SearchBar
            placeholder="Search documentation..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
            <h3 className="font-semibold text-gray-800 mb-4">Table of Contents</h3>
            <nav className="space-y-2">
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <ApperIcon name={section.icon} size={16} className="mr-2" />
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {getContentForSection(activeSection).title}
              </h2>
            </div>
            <div className="p-6">
              {getContentForSection(activeSection).content}
            </div>
          </div>

          {/* FAQ Section */}
          {(searchTerm === '' || filteredFAQs.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <ApperIcon name="HelpCircle" size={24} className="text-primary-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <details className="group">
                      <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                        <span className="font-medium text-gray-800">{faq.question}</span>
                        <ApperIcon name="ChevronDown" size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="p-4 pt-0 text-gray-600">
                        {faq.answer}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Documentation