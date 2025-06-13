### Background
- Daily trend chart didn't reflect new entries due to timezone mismatch
- Quote popup obstructed content on mobile
- iOS users lacked option to skip PWA prompt

### Impact
- Users couldn't see up-to-date stats
- Quote panel blocked view on small screens
- Repeated install prompts annoyed iOS visitors

### Test
- Manual: add events and verify chart updates instantly
- Manual: check quote disappears on tap or after 10s
- Manual: verify opt-out for iOS prompt persists

### Rollback
- Revert `Resignation.html` and `version.txt` to previous commit
