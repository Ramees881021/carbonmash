
-- Function to sync master credential_type_logos changes to all users
CREATE OR REPLACE FUNCTION public.sync_master_credential_logos()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  master_id uuid := '45138f86-e5ae-4649-a7ce-250793c9fd66';
BEGIN
  -- Only trigger for master account changes
  IF TG_OP = 'INSERT' AND NEW.user_id = master_id THEN
    -- Insert for all other users who don't already have this credential_type
    INSERT INTO credential_type_logos (user_id, credential_type, logo_url)
    SELECT p.user_id, NEW.credential_type, NEW.logo_url
    FROM profiles p
    WHERE p.user_id != master_id
      AND NOT EXISTS (
        SELECT 1 FROM credential_type_logos ctl
        WHERE ctl.user_id = p.user_id AND ctl.credential_type = NEW.credential_type
      );
    RETURN NEW;

  ELSIF TG_OP = 'UPDATE' AND NEW.user_id = master_id THEN
    -- Update logo_url for all other users with same credential_type
    UPDATE credential_type_logos
    SET logo_url = NEW.logo_url, updated_at = now()
    WHERE credential_type = OLD.credential_type
      AND user_id != master_id;
    -- If credential_type changed, update that too
    IF OLD.credential_type != NEW.credential_type THEN
      UPDATE credential_type_logos
      SET credential_type = NEW.credential_type, updated_at = now()
      WHERE credential_type = OLD.credential_type
        AND user_id != master_id;
    END IF;
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' AND OLD.user_id = master_id THEN
    -- Delete from all other users
    DELETE FROM credential_type_logos
    WHERE credential_type = OLD.credential_type
      AND user_id != master_id;
    RETURN OLD;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger
CREATE TRIGGER sync_master_credential_logos_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.credential_type_logos
FOR EACH ROW
EXECUTE FUNCTION public.sync_master_credential_logos();
