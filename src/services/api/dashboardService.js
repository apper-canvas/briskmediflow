import { delay } from '@/utils/helpers'

export const getDashboardStats = async () => {
  await delay(300)
  
  return [
    {
      title: 'Total Patients',
      value: '1,247',
      icon: 'Users',
      change: '+12% from last month',
      changeType: 'positive',
      color: 'primary'
    },
    {
      title: "Today's Appointments",
      value: '18',
      icon: 'Calendar',
      change: '3 pending confirmation',
      changeType: 'neutral',
      color: 'secondary'
    },
    {
      title: 'Revenue (Month)',
      value: '$24,350',
      icon: 'DollarSign',
      change: '+8.2% from last month',
      changeType: 'positive',
      color: 'accent'
    },
    {
      title: 'Low Stock Items',
      value: '5',
      icon: 'AlertTriangle',
      change: 'Requires immediate attention',
      changeType: 'negative',
      color: 'warning'
    }
  ]
}