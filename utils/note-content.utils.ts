export type TextSize = 'title' | 'subtitle' | 'normal';

export type Segment = {
  id: string;
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  size?: TextSize;
  list?: 'ordered' | 'bullet';
};

let idCounter = 0;
export const genSegmentId = () => `${Date.now()}-${idCounter++}`;

function stripHtml(html: string): string {
  return html
    .replace(/<\/(p|div|h[1-6]|li)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
}

const HEADING_SIZE: Record<string, TextSize> = {
  h1: 'title',
  h2: 'title',
  h3: 'subtitle',
  h4: 'subtitle',
  h5: 'subtitle',
  h6: 'subtitle',
};

function decodeEntities(str: string): string {
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/**
 * Parse un HTML (ancien format TenTap) en segments stylés, en conservant
 * gras / italique / souligné / titres / listes, au lieu de tout aplatir en texte brut.
 */
export function parseHtmlToSegments(html: string): Segment[] {
  const segments: Segment[] = [];

  let bold = 0;
  let italic = 0;
  let underline = 0;
  const sizeStack: TextSize[] = [];
  const listStack: Array<'ordered' | 'bullet'> = [];

  const pushText = (text: string) => {
    if (!text) return;
    segments.push({
      id: genSegmentId(),
      text,
      ...(bold > 0 ? { bold: true } : {}),
      ...(italic > 0 ? { italic: true } : {}),
      ...(underline > 0 ? { underline: true } : {}),
      ...(sizeStack.length > 0 ? { size: sizeStack[sizeStack.length - 1] } : {}),
      ...(listStack.length > 0 ? { list: listStack[listStack.length - 1] } : {}),
    });
  };

  const pushNewline = () => {
    const last = segments[segments.length - 1];
    if (last && last.text.endsWith('\n')) return;
    segments.push({ id: genSegmentId(), text: '\n' });
  };

  const tagRegex = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(html)) !== null) {
    const [fullTag, rawTag] = match;
    const tag = rawTag.toLowerCase();
    const isClosing = fullTag.startsWith('</');

    const textBefore = html.slice(lastIndex, match.index);
    if (textBefore) pushText(decodeEntities(textBefore));
    lastIndex = tagRegex.lastIndex;

    switch (tag) {
      case 'b':
      case 'strong':
        bold += isClosing ? -1 : 1;
        break;
      case 'i':
      case 'em':
        italic += isClosing ? -1 : 1;
        break;
      case 'u':
        underline += isClosing ? -1 : 1;
        break;
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        if (!isClosing) {
          sizeStack.push(HEADING_SIZE[tag]);
        } else {
          sizeStack.pop();
          pushNewline();
        }
        break;
      case 'ul':
        if (!isClosing) listStack.push('bullet');
        else listStack.pop();
        break;
      case 'ol':
        if (!isClosing) listStack.push('ordered');
        else listStack.pop();
        break;
      case 'li':
        if (isClosing) pushNewline();
        break;
      case 'br':
        pushNewline();
        break;
      case 'p':
      case 'div':
        if (isClosing) pushNewline();
        break;
      default:
        break;
    }
  }

  const rest = html.slice(lastIndex);
  if (rest) pushText(decodeEntities(rest));

  while (segments.length > 1 && segments[segments.length - 1].text === '\n') {
    segments.pop();
  }

  return segments.length > 0 ? segments : [{ id: genSegmentId(), text: '' }];
}

/**
 * Convertit le "content" stocké (JSON de segments OU ancien HTML) en segments éditables.
 */
export function parseContentToSegments(raw: string | undefined): Segment[] {
  if (!raw) return [{ id: genSegmentId(), text: '' }];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0]?.text === 'string') {
      return parsed;
    }
  } catch {
    // pas du JSON valide -> probablement de l'ancien HTML (TenTap)
  }

  return parseHtmlToSegments(raw);
}

/**
 * Extrait un aperçu texte lisible du "content" stocké, pour l'affichage dans la liste des notes.
 */
export function extractPreviewText(raw: string | undefined): string {
  if (!raw) return '';

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0]?.text === 'string') {
      return (parsed as Segment[]).map(s => s.text).join(' ').trim();
    }
  } catch {
    // pas du JSON -> ancien HTML ou texte brut
  }

  return stripHtml(raw);
}

export function serializeSegments(segments: Segment[]): string {
  return JSON.stringify(segments);
}

/**
 * Regroupe une liste de segments en "lignes" (séparées par des segments "\n"),
 * pour faciliter le rendu des listes (bullet/ordered) et des paragraphes.
 */
export type Line = {
  segments: Segment[];
  list?: 'ordered' | 'bullet';
};

export function groupSegmentsIntoLines(segments: Segment[]): Line[] {
  const lines: Line[] = [];
  let current: Segment[] = [];

  const flush = () => {
    if (current.length === 0) return;
    lines.push({ segments: current, list: current[0].list });
    current = [];
  };

  for (const seg of segments) {
    if (seg.text === '\n') {
      flush();
    } else {
      current.push(seg);
    }
  }
  flush();

  return lines;
}