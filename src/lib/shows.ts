import type { CollectionEntry } from 'astro:content';

const MONTHS_FULL = ['ЯНВАРЯ', 'ФЕВРАЛЯ', 'МАРТА', 'АПРЕЛЯ', 'МАЯ', 'ИЮНЯ', 'ИЮЛЯ', 'АВГУСТА', 'СЕНТЯБРЯ', 'ОКТЯБРЯ', 'НОЯБРЯ', 'ДЕКАБРЯ'];
const MONTHS_NOM = ['января', 'февраля', 'мара', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const withBase = (p: string) => (p.startsWith('/') ? base + p : p);
const pad = (n: number) => String(n).padStart(2, '0');

function gcalUrl(s: CollectionEntry<'shows'>): string {
  const d = s.data.date;
  const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const m = /^(\d{1,2}):(\d{2})/.exec(s.data.time ?? '');
  let dates: string;
  if (m) {
    const h = Number(m[1]), min = Number(m[2]);
    const end = new Date(d);
    end.setHours(h + 2, min);
    dates = `${ymd}T${pad(h)}${pad(min)}00/${end.getFullYear()}${pad(end.getMonth() + 1)}${pad(end.getDate())}T${pad(end.getHours())}${pad(end.getMinutes())}00`;
  } else {
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    dates = `${ymd}/${next.getFullYear()}${pad(next.getMonth() + 1)}${pad(next.getDate())}`;
  }
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: s.data.title ?? `Latido Trio — концерт в ${s.data.city}`,
    dates,
    location: [s.data.venue, s.data.address, s.data.city].filter(Boolean).join(', '),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function prepareShows(list: CollectionEntry<'shows'>[]) {
  return list.map((s) => {
    const d = s.data.date;
    const place = [s.data.venue, s.data.address].filter(Boolean).join(', ');
    return {
      title: s.data.title ?? s.data.city,
      subtitle: s.data.subtitle ?? '',
      city: s.data.city,
      venue: s.data.venue,
      address: s.data.address ?? '',
      time: s.data.time ?? '',
      dateLabel: `${d.getDate()} ${MONTHS_FULL[d.getMonth()]} ${d.getFullYear()}`,
      day: String(d.getDate()),
      monthYear: `${MONTHS_NOM[d.getMonth()]} ${d.getFullYear()}`,
      status: s.data.status,
      ticketUrl: s.data.ticketUrl ?? '',
      posterUrl: s.data.poster ? withBase(s.data.poster) : '',
      mapUrl: place
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place}, ${s.data.city}`)}`
        : '',
      calendarUrl: gcalUrl(s),
      description: ('body' in s ? (s.body as string) : '') ?? '',
    };
  });
}