
CREATE OR REPLACE FUNCTION public.sync_master_profile_base_year()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  master_id uuid := '45138f86-e5ae-4649-a7ce-250793c9fd66';
BEGIN
  IF NEW.user_id = master_id AND (OLD.base_year IS DISTINCT FROM NEW.base_year) THEN
    UPDATE profiles
    SET base_year = NEW.base_year, updated_at = now()
    WHERE user_id != master_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER sync_master_profile_base_year_trigger
AFTER UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_master_profile_base_year();
