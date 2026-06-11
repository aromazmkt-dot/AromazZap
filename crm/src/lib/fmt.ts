export function n(v: number) {
  const s = Math.round(v).toString()
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function money(v: number | null | undefined, decimals = 0) {
  if (v == null || v === 0) return '—'
  const abs = Math.abs(Number(v))
  const str = decimals > 0 ? abs.toFixed(decimals) : Math.round(abs).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return (Number(v) < 0 ? '-$' : '$') + str
}

export function fmtDate(d: string | null | undefined) {
  if (!d) return '—'
  const dt = new Date(d)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${dt.getUTCFullYear()}`
}
