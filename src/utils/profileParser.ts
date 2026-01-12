/**
 * Profile Parser Utilities
 * Parses raw user profile text into structured data
 */

export interface ParsedHistoryItem {
    title: string;
    genres: string[];
    description: string;
    author: string;
    publishedAt: string;
    pages: string;
    globalRating: string;
    myBehavior: string;
    myRating: string;
    viewedAgo: string;
}

export interface ParsedExposureItem {
    label: string;
    title: string;
    genres: string[];
    author: string;
    publishedAt: string;
    pages: string;
    rating: string;
}

export interface ParsedProfile {
    history: ParsedHistoryItem[];
    exposureList: ParsedExposureItem[];
}

/**
 * Parse genres from format: "['genre1', 'genre2']" or "(['genre1', 'genre2'])"
 */
function parseGenres(genreStr: string): string[] {
    const match = genreStr.match(/\[([^\]]+)\]/);
    if (!match) return [];

    return match[1]
        .split(',')
        .map(g => g.trim().replace(/'/g, '').replace(/"/g, ''))
        .filter(g => g.length > 0);
}

/**
 * Parse a single history item block
 */
function parseHistoryItem(block: string): ParsedHistoryItem | null {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length === 0) return null;

    const item: ParsedHistoryItem = {
        title: '',
        genres: [],
        description: '',
        author: '',
        publishedAt: '',
        pages: '',
        globalRating: '',
        myBehavior: '',
        myRating: '',
        viewedAgo: ''
    };

    for (const line of lines) {
        if (line.startsWith('A book viewed')) {
            item.viewedAgo = line.replace('A book viewed', '').trim();
        } else if (line.startsWith('Title:')) {
            const titlePart = line.substring(6);
            const genreMatch = titlePart.match(/\((\[.+\])\)\s*$/);
            if (genreMatch) {
                item.title = titlePart.replace(genreMatch[0], '').trim();
                item.genres = parseGenres(genreMatch[1]);
            } else {
                item.title = titlePart.trim();
            }
        } else if (line.startsWith('Description:')) {
            item.description = line.substring(12).trim();
        } else if (line.startsWith('Author:')) {
            item.author = line.substring(7).trim();
        } else if (line.startsWith('Published at')) {
            // Format: "Published at 2002 - Opera Graphica - 52 pages"
            const pubMatch = line.match(/Published at\s*(.+?)\s*-\s*(.+?)\s*-\s*(.+?)\s*pages/i);
            if (pubMatch) {
                item.publishedAt = `${pubMatch[1].trim()} - ${pubMatch[2].trim()}`;
                item.pages = pubMatch[3].trim();
            } else {
                item.publishedAt = line.substring(12).trim();
            }
        } else if (line.startsWith('Rating:') && item.globalRating === '') {
            item.globalRating = line.substring(7).trim();
        } else if (line.startsWith('My Behavior:')) {
            item.myBehavior = line.substring(12).trim();
        } else if (line.startsWith('Rating:') && item.globalRating !== '') {
            item.myRating = line.substring(7).trim();
        }
    }

    return item.title ? item : null;
}

/**
 * Parse a single exposure item block
 */
function parseExposureItem(block: string): ParsedExposureItem | null {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length === 0) return null;

    const item: ParsedExposureItem = {
        label: '',
        title: '',
        genres: [],
        author: '',
        publishedAt: '',
        pages: '',
        rating: ''
    };

    for (const line of lines) {
        if (line.match(/^\[[A-Z]\]/)) {
            item.label = line.substring(1, 2);
            const rest = line.substring(3).trim();
            if (rest.startsWith('Title:')) {
                const titlePart = rest.substring(6);
                const genreMatch = titlePart.match(/\((\[.+\])\)\s*$/);
                if (genreMatch) {
                    item.title = titlePart.replace(genreMatch[0], '').trim();
                    item.genres = parseGenres(genreMatch[1]);
                } else {
                    item.title = titlePart.trim();
                }
            }
        } else if (line.startsWith('Author:')) {
            item.author = line.substring(7).trim();
        } else if (line.startsWith('Published at')) {
            const pubMatch = line.match(/Published at\s*(.+?)\s*-\s*(.+?)\s*-\s*(.+?)\s*pages/i);
            if (pubMatch) {
                item.publishedAt = `${pubMatch[1].trim()} - ${pubMatch[2].trim()}`;
                item.pages = pubMatch[3].trim();
            } else {
                item.publishedAt = line.substring(12).trim();
            }
        } else if (line.startsWith('Rating:')) {
            item.rating = line.substring(7).trim();
        }
    }

    return item.title ? item : null;
}

/**
 * Parse complete raw profile text
 */
export function parseUserProfile(rawText: string): ParsedProfile {
    const result: ParsedProfile = {
        history: [],
        exposureList: []
    };

    // Split by sections
    const historyMatch = rawText.match(/## History\n([\s\S]*?)(?=# Exposure List|$)/);
    const exposureMatch = rawText.match(/# Exposure List\n([\s\S]*?)$/);

    // Parse history items
    if (historyMatch) {
        const historyText = historyMatch[1];
        const blocks = historyText.split(/\n(?=A book viewed)/);
        for (const block of blocks) {
            const item = parseHistoryItem(block);
            if (item) {
                result.history.push(item);
            }
        }
    }

    // Parse exposure items
    if (exposureMatch) {
        const exposureText = exposureMatch[1];
        const blocks = exposureText.split(/\n(?=\[[A-Z]\])/);
        for (const block of blocks) {
            const item = parseExposureItem(block);
            if (item) {
                result.exposureList.push(item);
            }
        }
    }

    return result;
}
