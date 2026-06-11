function Sk({ w = 'w-full', h = 'h-4', rounded = 'rounded' }: { w?: string; h?: string; rounded?: string }) {
  return <div className={`${w} ${h} ${rounded} bg-zinc-100 animate-pulse`} />
}

export default function DashboardLoading() {
  return (
    <div className="space-y-5 p-1">
      {/* Header */}
      <div className="space-y-1.5">
        <Sk w="w-40" h="h-5" />
        <Sk w="w-56" h="h-3.5" />
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-zinc-100 animate-pulse rounded-xl p-5 space-y-3">
            <Sk w="w-20" h="h-3" />
            <Sk w="w-28" h="h-7" />
            <Sk w="w-24" h="h-3" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-zinc-100 animate-pulse rounded-xl h-52" />
        <div className="bg-zinc-100 animate-pulse rounded-xl h-52" />
      </div>

      {/* Recent */}
      <div className="bg-zinc-100 animate-pulse rounded-xl p-5 space-y-4">
        <Sk w="w-36" h="h-4" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Sk w="w-6" h="h-6" rounded="rounded-full" />
            <Sk w="w-full" h="h-3.5" />
            <Sk w="w-16" h="h-3" />
          </div>
        ))}
      </div>
    </div>
  )
}
