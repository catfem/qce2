import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(value) {
  if (!value) return '';
  return format(new Date(value), 'PPpp');
}

export function fromNow(value) {
  if (!value) return '';
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

export function formatTags(tags = []) {
  return tags.map((tag) => `#${tag.trim().toLowerCase()}`).join(' ');
}

export function truncate(text = '', limit = 140) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}…`;
}
