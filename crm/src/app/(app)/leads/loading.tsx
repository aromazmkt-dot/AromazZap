function Sk({ w = 'w-full', h = 'h-4' }: { w?: string; h?: string }) {
  return <div className={`${w} ${h} rounded bg-zinc-100 animate-pulse`} />
}

export default function LeadsLoading() {
  return (
    <div className="space-y-4 p-1">
      <div className="space-y-1.5"><Sk w="w-24" h="h-5" /><Sk w="w-40" h="h-3.5" /></div>
      <div className="flex gap-2 flex-wrap">
        {[...Array(5)].map((_, i) => <div key={i} className="w-24 h-7 rounded-full bg-zinc-100 animate-pulse" />)}
      </div>
      <div className="flex gap-3">
        <div className="flex-1 h-10 bg-zinc-100 animate-pulse rounded-lg" />
        <div className="w-40 h-10 bg-zinc-100 animate-pulse rounded-lg" />
        <div className="w-28 h-10 bg-zinc-100 animate-pulse rounded-lg" />
      </div>
      <div className="bg-white border border-zinc-100 rounded-xl overflow-hidden">
        <div className="flex gap-4 px-4 py-3 bg-zinc-50 border-b border-zinc-100">
          {['w-32', 'w-24', 'w-20', 'w-20', 'w-24', 'w-20'].map((w, i) => (
            <div key={i} className={`${w} h-3 bg-zinc-200 animate-pulse rounded`} />
          ))}
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-4 border-b border-zinc-50">
            <div className="flex-1 space-y-1.5"><Sk w="w-36" h="h-3.5" /><Sk w="w-44" h="h-3" /></div>
            <Sk w="w-24" h="h-3.5" />
            <Sk w="w-20" h="h-6" />
            <Sk w="w-20" h="h-6" />
            <Sk w="w-20" h="h-3.5" />
            <Sk w="w-16" h="h-3" />
          </div>
        ))}
      </div>
    </div>
  )
}
