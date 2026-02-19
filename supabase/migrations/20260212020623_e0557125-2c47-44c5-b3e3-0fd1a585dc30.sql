
-- Fix master ID in sync_master_credential_logos
CREATE OR REPLACE FUNCTION public.sync_master_credential_logos()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  master_id uuid := '76471447-e1ed-4df0-a586-52f0c0f5752d';
BEGIN
  IF TG_OP = 'INSERT' AND NEW.user_id = master_id THEN
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
    UPDATE credential_type_logos
    SET logo_url = NEW.logo_url, updated_at = now()
    WHERE credential_type = OLD.credential_type
      AND user_id != master_id;
    IF OLD.credential_type != NEW.credential_type THEN
      UPDATE credential_type_logos
      SET credential_type = NEW.credential_type, updated_at = now()
      WHERE credential_type = OLD.credential_type
        AND user_id != master_id;
    END IF;
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' AND OLD.user_id = master_id THEN
    DELETE FROM credential_type_logos
    WHERE credential_type = OLD.credential_type
      AND user_id != master_id;
    RETURN OLD;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Fix master ID in sync_master_credentials
CREATE OR REPLACE FUNCTION public.sync_master_credentials()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  master_id uuid := '76471447-e1ed-4df0-a586-52f0c0f5752d';
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

-- Also fix sync_master_profile_base_year
CREATE OR REPLACE FUNCTION public.sync_master_profile_base_year()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  master_id uuid := '76471447-e1ed-4df0-a586-52f0c0f5752d';
BEGIN
  IF NEW.user_id = master_id AND (OLD.base_year IS DISTINCT FROM NEW.base_year) THEN
    UPDATE profiles
    SET base_year = NEW.base_year, updated_at = now()
    WHERE user_id != master_id;
  END IF;
  RETURN NEW;
END;
$function$;
