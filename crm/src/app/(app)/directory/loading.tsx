function Sk({ w = 'w-full', h = 'h-4' }: { w?: string; h?: string }) {
  return <div className={`${w} ${h} rounded bg-zinc-100 animate-pulse`} />
}

export default function DirectoryLoading() {
  return (
    <div className="space-y-4 p-1">
      <div className="space-y-1.5"><Sk w="w-24" h="h-5" /><Sk w="w-44" h="h-3.5" /></div>
      <div className="flex gap-3">
        <div className="flex-1 h-10 bg-zinc-100 animate-pulse rounded-lg" />
        <div className="w-40 h-10 bg-zinc-100 animate-pulse rounded-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white border border-zinc-100 rounded-xl p-5 space-y-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex-shrink-0" />
              <div className="flex-1 space-y-1.5"><Sk w="w-3/4" h="h-4" /><Sk w="w-1/2" h="h-3" /></div>
            </div>
            <div className="space-y-2 pt-1">
              <Sk h="h-3" /><Sk w="w-4/5" h="h-3" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-8 bg-zinc-100 rounded-lg" />
              <div className="w-8 h-8 bg-zinc-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
