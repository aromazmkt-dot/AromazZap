function Sk({ w = 'w-full', h = 'h-4' }: { w?: string; h?: string }) {
  return <div className={`${w} ${h} rounded bg-zinc-100 animate-pulse`} />
}

export default function SettingsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-6 flex gap-6 items-start">
      {/* Left nav skeleton */}
      <aside className="w-44 flex-shrink-0 space-y-1.5 pt-1">
        <Sk w="w-20" h="h-3" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 bg-zinc-100 animate-pulse rounded-xl" />
        ))}
      </aside>

      {/* Right content skeleton */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Profile card */}
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden animate-pulse">
          <div className="h-20 bg-zinc-100" />
          <div className="px-6 pt-12 pb-6 space-y-4">
            <div className="space-y-1"><Sk w="w-32" h="h-5" /><Sk w="w-44" h="h-3.5" /></div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Sk w="w-20" h="h-3" />
                  <Sk h="h-10" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <div className="w-36 h-10 bg-zinc-100 rounded-xl" />
              <div className="w-24 h-10 bg-zinc-100 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Notifications card */}
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden animate-pulse">
          <div className="h-14 bg-zinc-50 border-b border-zinc-100" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-zinc-50">
              <div className="w-8 h-8 rounded-xl bg-zinc-100" />
              <div className="flex-1 space-y-1.5"><Sk w="w-40" h="h-3.5" /><Sk w="w-56" h="h-3" /></div>
              <div className="w-10 h-5 rounded-full bg-zinc-100" />
            </div>
          ))}
        </div>

        {/* Security card */}
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden animate-pulse">
          <div className="h-14 bg-zinc-50 border-b border-zinc-100" />
          <div className="p-6 space-y-3">
            <div className="h-20 bg-zinc-50 rounded-2xl border border-zinc-100" />
            <div className="h-16 bg-zinc-50 rounded-2xl border border-zinc-100" />
          </div>
        </div>
      </div>
    </div>
  )
}
