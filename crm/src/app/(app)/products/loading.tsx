function Sk({ w = 'w-full', h = 'h-4' }: { w?: string; h?: string }) {
  return <div className={`${w} ${h} rounded bg-zinc-100 animate-pulse`} />
}

export default function ProductsLoading() {
  return (
    <div className="space-y-4 p-1">
      <div className="space-y-1.5"><Sk w="w-24" h="h-5" /><Sk w="w-44" h="h-3.5" /></div>
      <div className="flex gap-3">
        <div className="flex-1 h-10 bg-zinc-100 animate-pulse rounded-lg" />
        <div className="w-40 h-10 bg-zinc-100 animate-pulse rounded-lg" />
        <div className="w-32 h-10 bg-zinc-100 animate-pulse rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white border border-zinc-100 animate-pulse rounded-xl overflow-hidden">
            <div className="h-40 bg-zinc-100" />
            <div className="p-4 space-y-2">
              <Sk w="w-3/4" h="h-4" />
              <Sk w="w-1/2" h="h-3" />
              <div className="flex justify-between pt-1">
                <Sk w="w-16" h="h-5" />
                <Sk w="w-12" h="h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
