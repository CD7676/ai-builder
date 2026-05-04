import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB = process.env.NOTION_DATABASE_ID;

const COL_TO_STATUS = {
  suggested: 'Suggested',
  todo: 'To Build',
  progress: 'In Progress',
  done: 'Done',
};
const STATUS_TO_COL = {
  'Suggested': 'suggested',
  'To Build': 'todo',
  'In Progress': 'progress',
  'Done': 'done',
};

const rt = (arr) => (arr || []).map(t => t.plain_text).join('');

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (!process.env.NOTION_TOKEN || !DB) {
      return res.status(500).json({ error: 'NOTION_TOKEN or NOTION_DATABASE_ID missing' });
    }

    if (req.method === 'GET') {
      const all = [];
      let cursor;
      do {
        const r = await notion.databases.query({
          database_id: DB,
          start_cursor: cursor,
          page_size: 100,
        });
        all.push(...r.results);
        cursor = r.has_more ? r.next_cursor : undefined;
      } while (cursor);

      const cards = all.map(p => {
        const props = p.properties || {};
        const status = props.Status?.select?.name || 'Suggested';
        return {
          id: p.id,
          name: rt(props.Name?.title),
          desc: rt(props.Description?.rich_text),
          spec: rt(props['Project spec']?.rich_text),
          priority: props.Priority?.select?.name || 'Medium',
          status,
          col: STATUS_TO_COL[status] || 'suggested',
          submittedBy: rt(props['Submitted by']?.rich_text),
          submittedAt: props['Submitted at']?.date?.start || null,
        };
      });
      return res.status(200).json({ cards });
    }

    if (req.method === 'PATCH') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
      }
      body = body || {};
      const { id, col, status } = body;
      if (!id) return res.status(400).json({ error: 'id required' });
      const newStatus = status || COL_TO_STATUS[col];
      if (!newStatus) return res.status(400).json({ error: 'col or status required' });

      await notion.pages.update({
        page_id: id,
        properties: { Status: { select: { name: newStatus } } },
      });
      return res.status(200).json({ ok: true, id, status: newStatus });
    }

    res.setHeader('Allow', 'GET, PATCH');
    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    console.error('roadmap api error', e);
    return res.status(500).json({ error: e.message || String(e) });
  }
}
