import { fetchMockData } from '../../api/mockData'
import Dashboard from '../dashboard'

export default async function DashboardPage() {
  const initialData = await fetchMockData()
  return <Dashboard initialData={initialData} />
}