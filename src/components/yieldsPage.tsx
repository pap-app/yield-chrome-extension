import Header from '@/components/header'
import YieldOpportunities from '@/components/yield-opportunities'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'
import { useState } from 'react'
import { YieldOpportunity } from '@/shared/schema'
import axios from 'axios'
import { useVault } from '@/hooks/useGetVaults'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
export default function Yields() {
  const [searchTerm, setSearchTerm] = useState('')

  const navigate = useNavigate()
  //
  const goToVault = (vaultId: string) => {
    navigate(`/vault/${vaultId}`)
  }

  const BACKEND_ENDPOINT = 'http://localhost:5000/api/'
  const fetchPortfolios = async () => {
    const res = await axios.get(`${BACKEND_ENDPOINT}yield-opportunities`)
    return res.data
  }
  /* const { data: opportunities, isLoading } = useQuery<YieldOpportunity[]>({
    queryKey: ['/api/yield-opportunities'],
    queryFn: fetchPortfolios,
  })*/

  const { data, isLoading } = useVault()
  console.log('VAULTS', data)
  const filteredOpportunities = data?.filter(
    (opp) =>
      opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.tag.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="p-4">
          <h1 className="text-text-primary mb-6 text-2xl font-bold">
            Yield Opportunities
          </h1>

          {/* Search and Filter */}
          <div className="mb-6 flex space-x-3">
            <div className="relative flex-1">
              <Search className="text-text-tertiary absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-brand-green w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2"
              />
            </div>
            <button className="flex items-center space-x-2 rounded-lg border border-gray-200 px-4 py-2 transition-colors hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              <span className="text-sm">Filter</span>
            </button>
          </div>

          {/* Yield Stats */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="bg-bg-secondary shadow-soft rounded-xl p-4 text-center">
              <p className="text-text-tertiary mb-1 text-xs">Avg APY</p>
              <p className="text-brand-green text-lg font-bold">7.4%</p>
            </div>
            <div className="bg-bg-secondary shadow-soft rounded-xl p-4 text-center">
              <p className="text-text-tertiary mb-1 text-xs">Total Pools</p>
              <p className="text-text-primary text-lg font-bold">
                {data?.length || 0}
              </p>
            </div>
            <div className="bg-bg-secondary shadow-soft rounded-xl p-4 text-center">
              <p className="text-text-tertiary mb-1 text-xs">Best APY</p>
              <p className="text-lg font-bold text-green-600">8.1%</p>
            </div>
          </div>
        </div>

        {/* Opportunities List */}
        {isLoading ? (
          <div className="px-4">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-bg-secondary shadow-soft animate-pulse rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                      <div>
                        <div className="mb-1 h-4 w-24 rounded bg-gray-200"></div>
                        <div className="h-3 w-20 rounded bg-gray-200"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mb-1 h-4 w-16 rounded bg-gray-200"></div>
                      <div className="h-3 w-12 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-4 pb-4">
            <div className="space-y-3">
              {filteredOpportunities?.map((opportunity) => (
                <div
                  key={opportunity.vaultId}
                  className="bg-bg-secondary shadow-soft cursor-pointer rounded-xl p-4 transition-shadow duration-200 hover:shadow-lg"
                  onClick={() => goToVault(opportunity.vaultId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={opportunity.logo} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-text-primary font-medium">
                          {opportunity.name}
                        </h3>
                        <p className="text-text-tertiary text-xs">
                          {opportunity.tag}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-brand-green font-bold">
                        {opportunity.apy}% APY
                      </p>
                      <p className="text-text-tertiary text-xs">
                        {opportunity.riskLevel}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
