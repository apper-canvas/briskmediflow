import { delay } from '@/utils/helpers'
import billsData from '@/services/mockData/bills.json'

let bills = [...billsData]

export const getBills = async () => {
  await delay(400)
  return [...bills]
}

export const getBillById = async (id) => {
  await delay(200)
  const bill = bills.find(b => b.Id === parseInt(id))
  if (!bill) throw new Error('Bill not found')
  return { ...bill }
}

export const createBill = async (billData) => {
  await delay(300)
  const newId = Math.max(...bills.map(b => b.Id)) + 1
  const newBill = {
    Id: newId,
    ...billData
  }
  bills.push(newBill)
  return { ...newBill }
}

export const updateBill = async (id, billData) => {
  await delay(300)
  const index = bills.findIndex(b => b.Id === parseInt(id))
  if (index === -1) throw new Error('Bill not found')
  
  bills[index] = { ...bills[index], ...billData }
  return { ...bills[index] }
}

export const deleteBill = async (id) => {
  await delay(200)
  const index = bills.findIndex(b => b.Id === parseInt(id))
  if (index === -1) throw new Error('Bill not found')
  
  bills.splice(index, 1)
  return true
}