-- cron second
delimiter $$
create function cronSecond(expr int)
  RETURNS boolean
BEGIN
  DECLARE curr_val VARCHAR(255) DEFAULT second(now());
  IF expr = '*' THEN
    RETURN(true);
  ELSEIF expr = curr_val THEN
    RETURN(true);
  ELSE
    RETURN(false);
  END IF;
END$$
delimiter ;

-- cron minute
delimiter $$
drop function cronMinute$$
create function cronMinute(expr int)
  RETURNS boolean
BEGIN
  DECLARE curr_val VARCHAR(255) DEFAULT minute(now());
  IF expr = '*' THEN
    RETURN(true);
  ELSEIF expr = curr_val THEN
    RETURN(true);
  ELSE
    RETURN(false);
  END IF;
END$$
delimiter ;

-- cron hour
delimiter $$
drop function cronHour$$
create function cronHour(expr int)
  RETURNS boolean
BEGIN
  DECLARE curr_val VARCHAR(255) DEFAULT hour(now());
  IF expr = '*' THEN
    RETURN(true);
  ELSEIF expr = curr_val THEN
    RETURN(true);
  ELSE
    RETURN(false);
  END IF;
END$$

delimiter ;