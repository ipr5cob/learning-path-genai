import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const savedState = sessionStorage.getItem('entra_oauth_state');

      if (!code) {
        setError('No authorization code received');
        return;
      }

      // CSRF check
      if (state !== savedState) {
        setError('Invalid state parameter — possible CSRF attack');
        return;
      }

      sessionStorage.removeItem('entra_oauth_state');

      try {
        const { data, error: fnError } = await supabase.functions.invoke('entra-auth', {
          body: {
            action: 'callback',
            code,
            redirect_uri: `${window.location.origin}/auth/callback`,
          },
        });

        if (fnError) throw fnError;

        // Store user session (no access_token needed — OpenID only)
        sessionStorage.setItem('entra_user', JSON.stringify(data.user));

        navigate('/app', { replace: true });
      } catch (e) {
        console.error('Auth callback error:', e);
        setError('Authentication failed. Please try again.');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-major">
        <div className="text-center space-y-4">
          <p className="text-signal-danger font-medium">{error}</p>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="text-sm text-accent-major hover:underline"
          >
            Return to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-major">
      <div className="flex items-center gap-3 text-base-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Completing sign-in...</span>
      </div>
    </div>
  );
};

export default AuthCallback;
