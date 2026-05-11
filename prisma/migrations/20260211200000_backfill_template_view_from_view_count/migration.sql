-- Backfill: align historical `templates.view_count` with `template_view` row counts.
-- Inserts only missing rows: `view_count - (current event rows)`, floored at 0.
-- `viewed_at` is outside rolling windows so `views_last_24h/7d/30d` stay honest until
-- real traffic is recorded.

INSERT INTO public.template_view (template_id, viewed_at)
SELECT
  t.id,
  now() - interval '40 days'
FROM public.templates t
CROSS JOIN LATERAL generate_series(
  1,
  GREATEST(
    COALESCE(t.view_count, 0)
      - (
        SELECT COUNT(*)::int
        FROM public.template_view v
        WHERE v.template_id = t.id
      ),
    0
  )
) AS s (n)
WHERE
  COALESCE(t.view_count, 0)
    > (
      SELECT COUNT(*)::int
      FROM public.template_view v
      WHERE v.template_id = t.id
    );

-- Refresh denormalized counters from the event log for every template.

UPDATE public.templates AS t
SET
  view_count = (
    SELECT COUNT(*)::int
    FROM public.template_view v
    WHERE v.template_id = t.id
  ),
  views_last_24h = (
    SELECT COUNT(*)::int
    FROM public.template_view v
    WHERE v.template_id = t.id
      AND v.viewed_at > (now() - interval '24 hours')
  ),
  views_last_7d = (
    SELECT COUNT(*)::int
    FROM public.template_view v
    WHERE v.template_id = t.id
      AND v.viewed_at > (now() - interval '7 days')
  ),
  views_last_30d = (
    SELECT COUNT(*)::int
    FROM public.template_view v
    WHERE v.template_id = t.id
      AND v.viewed_at > (now() - interval '30 days')
  ),
  last_stats_update = now(),
  updated_at = now();
