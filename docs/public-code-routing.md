# Permanent customer QR routing candidate

Eight-character customer URLs and manual codes now belong to the permanent public namespace, using ABCDEFGHJKLMNPQRSTUVWXYZ23456789. The canonical QR is HTTPS://LINKS.SCOREDLABS.COM/<CODE>. A public code is not a password, token or permission to score. Older eight-character legacy codes are retired. Other supported legacy token/marketing routes remain separate; no automatic credential-resolver fallback exists for eight-character paths.

The proposed source redirects those paths to a purpose-marked app/install landing. It retains the public code in the URL and optional same-tab session storage so a player can return after installation. Installation destinations, CNAME and association files are unchanged. The app receives customerCode with purpose=public-code, not t/token. There is no credential lookup or bearer redirect in this path.

Node fixtures validate the actual redirect script, public/legacy separation, storage failure, installation links and same-tab cold-page recovery. They do not qualify iOS/Android universal links, installed app invocation, deferred deep linking across a fresh install or customer/scoreboard availability. Without an approved deferred-link service, a fresh installation requires returning to the landing and choosing Open Scored or scanning again. Real OS/app association qualification remains required; no association/DNS change is authorized here.

Public Backend lookup remains unavailable pending independently reviewed registry/controller binding, release/deployment/activation and security qualification. No account is needed by the proposed public routing contract, but public code knowledge grants no customer/scoring authority. This source-only draft does not publish Pages or activate any service. Existing scoring and software release behavior are owned by the app/device, not this site. Physical GPIO handover is excluded.

Rollback: close the draft and retain source/evidence before merge. Any later approved publication reversal requires separate review; do not turn permanent codes into credential redirects or recycle retired codes. No hosted data deletion or deployment is performed by these changes.

## Availability checks

The customer code remains a permanent public identifier. Normal PlayApp connections must make a fresh eligibility check, including remembered BLE targets; a cached name cannot bypass suspension. This landing page never supplies credentials or authority. Routing and subscription rollout remain separately reviewed and unpublished; no existing active session is forcibly disconnected by this page.
