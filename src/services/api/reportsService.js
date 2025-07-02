import { delay } from '@/utils/helpers'

export const getReportsData = async () => {
  await delay(500)
  
  return {
    totalPatients: 1247,
    totalAppointments: 342,
    totalRevenue: 24350.75,
    pendingBills: 12,
    recentAppointments: [
      {
        patientName: 'John Doe',
        doctorName: 'Dr. Smith',
        date: '2024-01-15',
        timeSlot: '10:00',
        status: 'confirmed'
      },
      {
        patientName: 'Jane Wilson',
        doctorName: 'Dr. Johnson',
        date: '2024-01-15',
        timeSlot: '14:30',
        status: 'pending'
      },
      {
        patientName: 'Bob Brown',
        doctorName: 'Dr. Davis',
        date: '2024-01-15',
        timeSlot: '16:15',
        status: 'confirmed'
      }
    ],
    revenueBreakdown: [
      { category: 'Consultations', amount: 15200.50, percentage: 62 },
      { category: 'Medicines', amount: 5850.25, percentage: 24 },
      { category: 'Procedures', amount: 3300.00, percentage: 14 }
    ],
    lowStockMedicines: [
      { name: 'Paracetamol 500mg', category: 'Tablets', quantity: 15, minStock: 50 },
      { name: 'Bandages', category: 'Surgical Supplies', quantity: 8, minStock: 20 },
      { name: 'Insulin', category: 'Injections', quantity: 3, minStock: 10 }
    ]
  }
}