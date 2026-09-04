import { Lock } from 'lucide-react';
import { PRIVACY_NOTICE } from '@/lib/constants';

export function PrivacyNotice() {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      <Lock className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
      <p>{PRIVACY_NOTICE}</p>
    </div>
  );
}
