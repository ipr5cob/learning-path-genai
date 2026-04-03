import { Shield, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import thubLogo from '@/assets/thub-logo.png';

const Login = () => {
  const handleSSOLogin = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('entra-auth', {
        body: {
          action: 'login',
          redirect_uri: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Save state for CSRF verification
      sessionStorage.setItem('entra_oauth_state', data.state);

      // Redirect to Microsoft login
      window.location.href = data.auth_url;
    } catch (e) {
      console.error('SSO login error:', e);
    }
  };

  return (
    <div className="min-h-screen flex bg-base-major">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[480px] bg-integrated-deep flex-col justify-between p-10 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-accent-major/10" />
        <div className="absolute bottom-10 -right-16 w-48 h-48 rounded-full bg-emphasis-teal/10" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-emphasis-purple/8" />

        <div>
          <img src={thubLogo} alt="T-Hub" className="h-10 object-contain brightness-0 invert" />
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-bold text-contrast-text leading-tight">
            Learning Path<br />Studio
          </h2>
          <p className="text-contrast-muted text-sm leading-relaxed max-w-xs">
            AI-powered learning path generation for enterprise teams. Design, iterate, and export structured curricula in minutes.
          </p>
          <div className="flex items-center gap-3 text-contrast-muted/60 text-xs">
            <Lock className="h-3.5 w-3.5" />
            <span>Enterprise-grade security with Microsoft Entra ID</span>
          </div>
        </div>

        <p className="text-contrast-muted/40 text-[11px]">
          © {new Date().getFullYear()} T-Hub Foundation. All rights reserved.
        </p>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-4">
            <img src={thubLogo} alt="T-Hub" className="h-9 object-contain" />
          </div>

          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-minor mb-4">
              <Shield className="h-7 w-7 text-accent-major" />
            </div>
            <h1 className="text-xl font-semibold text-base-text tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-base-muted">
              Sign in with your organization account
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleSSOLogin}
              className="w-full h-12 bg-accent-major text-plain-white hover:bg-accent-hover transition-all text-sm font-medium rounded-lg gap-3 group"
            >
              <svg className="h-5 w-5" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
              </svg>
              Sign in with Microsoft Entra ID
              <ArrowRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-minor" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-base-major px-3 text-base-muted">Enterprise SSO</span>
              </div>
            </div>
          </div>

          <div className="bg-plain-white border border-base-minor rounded-lg p-4 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-signal-success mt-1.5 shrink-0" />
              <p className="text-xs text-base-muted leading-relaxed">
                Your credentials are managed by your organization's IT administrator
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-signal-info mt-1.5 shrink-0" />
              <p className="text-xs text-base-muted leading-relaxed">
                Multi-factor authentication may be required based on your policy
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emphasis-purple mt-1.5 shrink-0" />
              <p className="text-xs text-base-muted leading-relaxed">
                Session expires after 8 hours of inactivity
              </p>
            </div>
          </div>

          <p className="text-center text-[11px] text-base-muted/60">
            Having trouble signing in? Contact your IT helpdesk
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
