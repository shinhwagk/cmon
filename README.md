### middle - task register
- register cron to mysql runtime configure
- register subscribe to mysql runtime configure
- kafka topic -> kafka stream -> filter -> kafka stream -> kafka topic

### middle 2 service dispatcher

### middle 3

### kafka
- 'service topic' used for send service queue

#### kafka stream

### mysql 7 json runtime configure
- runtime cron table
```sql
CREATE TABLE runtime_xxx(
  task_name VARCHAR,
  step_name VARCHAR,
  service_name VARCHAR,
  endpoint JSON,
  cron VARCHAR
)
--> service topic
```
- runtime subscribe table
```sql
CREATE TABLE runtime_sub(
  task_name VARCHAR,
  step_name VARCHAR,
  sub_task_name VARCHAR,
  sub_event VARCHAR,
  endpoint JSON,
  cron VARCHAR
)
-- service result --> kafka connect --> kafka stream(filter sub) --> result topic
# task - endpoint - downstream(event)
```

### consul
- service sql
- service elasticsearch
- service alarm

### task(user define)
- subscribe／cron

- task name
- endpoint type
- event
