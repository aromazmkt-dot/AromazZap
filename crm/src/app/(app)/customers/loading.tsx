function Sk({ w = 'w-full', h = 'h-4' }: { w?: string; h?: string }) {
  return <div className={`${w} ${h} rounded bg-zinc-100 animate-pulse`} />
}

export default function CustomersLoading() {
  return (
    <div className="space-y-4 p-1">
      <div className="space-y-1.5"><Sk w="w-28" h="h-5" /><Sk w="w-48" h="h-3.5" /></div>
      <div className="flex gap-3">
        <div className="flex-1 h-10 bg-zinc-100 animate-pulse rounded-lg" />
        <div className="w-32 h-10 bg-zinc-100 animate-pulse rounded-lg" />
        <div className="w-28 h-10 bg-zinc-100 animate-pulse rounded-full" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-zinc-100 animate-pulse rounded-xl p-5 space-y-3">
            <Sk w="w-20" h="h-3" /><Sk w="w-16" h="h-7" /><Sk w="w-24" h="h-3" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-zinc-100 rounded-xl overflow-hidden">
        <div className="flex gap-4 px-4 py-3 bg-zinc-50 border-b border-zinc-100">
          {['w-24', 'w-32', 'w-28', 'w-24', 'w-20', 'w-24', 'w-20'].map((w, i) => (
            <div key={i} className={`${w} h-3 bg-zinc-200 animate-pulse rounded`} />
          ))}
        </div>
        {[...Array(9)].map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-4 border-b border-zinc-50 items-center">
            <Sk w="w-24" h="h-3.5" /><Sk w="w-32" h="h-3.5" /><Sk w="w-28" h="h-3" />
            <Sk w="w-24" h="h-3.5" /><Sk w="w-20" h="h-6" /><Sk w="w-24" h="h-3" /><Sk w="w-16" h="h-3" />
          </div>
        ))}
      </div>
    </div>
  )
}
