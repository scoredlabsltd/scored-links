# Historical integrity finding retained for review

The complete public Links history scan with pinned Gitleaks 8.30.1 reports one pre-existing finding: commit b880097279256a3ff477829a6e70b0f1401cd93b, f/feedback.js line 2, jwt rule. No raw value is copied here. C4 did not introduce it. No exception, history rewrite, credential deletion or finding suppression is proposed by this change.

The new workflow verifies the pinned checksum before extraction, runs real synthetic/benign scanner controls and performs a complete redacted fetched-history scan. It deliberately fails on unresolved findings. New source bytes and website fixtures are separate from that historical result; neither overrides a failing history scan. Independent security disposition remains necessary before claiming full integrity validation.
