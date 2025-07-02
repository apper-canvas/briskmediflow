import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import userService from '@/services/api/userService'

const UserProfile = ({ mode: propMode }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(propMode === 'edit' || location.pathname.includes('/edit'))
  const [formData, setFormData] = useState({})

  useEffect(() => {
    loadProfile()
  }, [])

  useEffect(() => {
    setIsEditing(propMode === 'edit' || location.pathname.includes('/edit'))
  }, [propMode, location.pathname])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userService.getProfile()
      setProfile(data)
      setFormData(data)
    } catch (err) {
      setError('Failed to load profile')
      console.error('Error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.firstName?.trim() || !formData.lastName?.trim() || !formData.email?.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSaving(true)
      const updatedProfile = await userService.updateProfile(profile.Id, formData)
      setProfile(updatedProfile)
      setIsEditing(false)
      navigate('/profile')
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error('Failed to update profile')
      console.error('Error updating profile:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    navigate('/profile/edit')
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
    navigate('/profile')
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProfile} />
  if (!profile) return <Error message="Profile not found" />

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Profile' : 'User Profile'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'Update your personal information' : 'Manage your account settings'}
            </p>
          </div>
          
          {!isEditing && (
            <Button
              onClick={handleEdit}
              icon="Edit"
              className="self-start sm:self-auto"
            >
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-6"
        >
          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={32} className="text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Picture</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Update your profile picture to personalize your account
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    <ApperIcon name="Upload" size={16} className="mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="First Name"
                    required
                    value={formData.firstName || ''}
                    onChange={(value) => handleInputChange('firstName', value)}
                    placeholder="Enter first name"
                  />
                  
                  <FormField
                    label="Last Name"
                    required
                    value={formData.lastName || ''}
                    onChange={(value) => handleInputChange('lastName', value)}
                    placeholder="Enter last name"
                  />
                  
                  <FormField
                    label="Email"
                    type="email"
                    required
                    value={formData.email || ''}
                    onChange={(value) => handleInputChange('email', value)}
                    placeholder="Enter email address"
                  />
                  
                  <FormField
                    label="Phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(value) => handleInputChange('phone', value)}
                    placeholder="Enter phone number"
                  />
                  
                  <FormField
                    label="Department"
                    value={formData.department || ''}
                    onChange={(value) => handleInputChange('department', value)}
                    placeholder="Enter department"
                  />
                  
                  <FormField
                    label="Position"
                    value={formData.position || ''}
                    onChange={(value) => handleInputChange('position', value)}
                    placeholder="Enter position"
                  />
                </div>
                
                <div className="mt-6">
                  <FormField
                    label="Bio"
                    type="textarea"
                    value={formData.bio || ''}
                    onChange={(value) => handleInputChange('bio', value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={saving}
                  className="sm:order-2"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={32} className="text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-gray-600 mt-1">{profile.position}</p>
                  <p className="text-sm text-gray-500">{profile.department}</p>
                </div>
              </div>

              {/* Information Grid */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center text-gray-900">
                        <ApperIcon name="Mail" size={16} className="mr-2 text-gray-500" />
                        {profile.email}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="flex items-center text-gray-900">
                        <ApperIcon name="Phone" size={16} className="mr-2 text-gray-500" />
                        {profile.phone || 'Not provided'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <div className="flex items-center text-gray-900">
                        <ApperIcon name="Building" size={16} className="mr-2 text-gray-500" />
                        {profile.department}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Member Since
                      </label>
                      <div className="flex items-center text-gray-900">
                        <ApperIcon name="Calendar" size={16} className="mr-2 text-gray-500" />
                        {new Date(profile.joinDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                {profile.bio && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <p className="text-gray-900 leading-relaxed bg-gray-50 rounded-lg p-4">
                      {profile.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default UserProfile