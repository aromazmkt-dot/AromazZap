function Sk({ w = 'w-full', h = 'h-4' }: { w?: string; h?: string }) {
  return <div className={`${w} ${h} rounded bg-zinc-100 animate-pulse`} />
}

export default function MeetingsLoading() {
  return (
    <div className="space-y-4 p-1">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5"><Sk w="w-28" h="h-5" /><Sk w="w-48" h="h-3.5" /></div>
        <div className="w-36 h-10 bg-zinc-100 animate-pulse rounded-lg" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-zinc-100 animate-pulse rounded-xl p-4 space-y-2">
            <Sk w="w-16" h="h-3" /><Sk w="w-10" h="h-7" /><Sk w="w-20" h="h-3" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-zinc-100 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-50">
              <div className="space-y-1.5"><Sk w="w-56" h="h-4" /><Sk w="w-32" h="h-3" /></div>
              <Sk w="w-20" h="h-6" />
            </div>
            <div className="px-5 py-4 space-y-2.5">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-zinc-100 animate-pulse flex-shrink-0" />
                  <Sk w="w-64" h="h-3" />
                  <Sk w="w-20" h="h-3" />
                  <Sk w="w-16" h="h-5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
