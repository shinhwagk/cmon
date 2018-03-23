-- os task dispatch query
CREATE OR REPLACE VIEW runtime_tasks_os
AS
SELECT
    eo.name     ep_name,
    tso.name    t_name,
    tso.scripts t_scripts,
    tweo.args   t_args
FROM
    task_with_endpoint_os tweo,
    tasks_os              tso,
    endpoint_os           eo
WHERE tweo.endpoint_id = eo.id AND tweo.task_id = tso.id
    AND cronHour(tweo.cron_hour)
    AND cronMinute(tweo.cron_minute)
    AND cronSecond(tweo.cron_second);

-- oracle task dispatch query