
-- Create function to sync master sustainability_credentials to all users
CREATE OR REPLACE FUNCTION public.sync_master_credentials()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  master_id uuid := '45138f86-e5ae-4649-a7ce-250793c9fd66';
  _user_id uuid;
BEGIN
  IF TG_OP = 'INSERT' AND NEW.user_id = master_id THEN
    FOR _user_id IN SELECT p.user_id FROM profiles p WHERE p.user_id != master_id
    LOOP
      INSERT INTO sustainability_credentials (
        user_id, credential_type, credential_name, status, score_or_level,
        valid_until, attachment_url, certificate_url, logo_url, display_order, organization_id
      )
      SELECT
        _user_id, NEW.credential_type, NEW.credential_name, NEW.status, NEW.score_or_level,
        NEW.valid_until, NEW.attachment_url, NEW.certificate_url, NEW.logo_url, NEW.display_order, 
        (SELECT om.organization_id FROM organization_members om WHERE om.user_id = _user_id LIMIT 1)
      WHERE NOT EXISTS (
        SELECT 1 FROM sustainability_credentials sc
        WHERE sc.user_id = _user_id AND sc.credential_type = NEW.credential_type
      );
    END LOOP;
    RETURN NEW;

  ELSIF TG_OP = 'UPDATE' AND NEW.user_id = master_id THEN
    UPDATE sustainability_credentials
    SET 
      credential_name = NEW.credential_name,
      status = NEW.status,
      score_or_level = NEW.score_or_level,
      valid_until = NEW.valid_until,
      attachment_url = NEW.attachment_url,
      certificate_url = NEW.certificate_url,
      logo_url = NEW.logo_url,
      updated_at = now()
    WHERE credential_type = OLD.credential_type
      AND user_id != master_id;
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' AND OLD.user_id = master_id THEN
    DELETE FROM sustainability_credentials
    WHERE credential_type = OLD.credential_type
      AND user_id != master_id;
    RETURN OLD;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Attach trigger
CREATE TRIGGER sync_master_credentials_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.sustainability_credentials
FOR EACH ROW
EXECUTE FUNCTION public.sync_master_credentials();
