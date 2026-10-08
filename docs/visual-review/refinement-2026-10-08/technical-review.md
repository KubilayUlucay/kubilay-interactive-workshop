# Independent technical review

Actual source, installed R3F, genuine baseline/new PNGs and production simulation
were independently inspected. No application edits were made by the reviewer.

The moving-shadow instrument wrapped the existing `gl.shadowMap.render`, sent
native Space input and read production simulation without seeking/mutation. Five
assembled (`explode=0`) moving frames showed changing motor/crank angles, set
`needsUpdate=true`, executed 160 shadow draw calls each, then reset the flag to
false. A coasting frame after keyup also drew 160 calls. This establishes actual
spotlight regeneration, not merely a requested flag. Software Chromium/SwiftShader
was used; font requests were aborted for this instrument, which is not visual
evidence or a real-device performance test.

Independent simulation checks covered ramp/coast, inspection angle locking,
reduced feedback >99% with fixed mechanical angles, snapped endpoints, delayed
frame clamping and 1,200 finite/bounded rapid-transition steps. Manual resource
cleanup covers shared textures/materials, selection clones and geometry.

The suggested Crank visibility cancellation was integrated. Installed R3F has no
intended offscreen suspension policy; inspection/reduced changes explicitly
invalidate. Fresh reduced-motion input diagnostics matched actual Scene props
and reached/reassembled the expected endpoint. Earlier short-wait/autoscroll
readings were inconclusive; no repeatable demand-loop defect was established.

No blocking source defect found. Normal timing, hardware FPS, Safari/iOS and the
live hosted URL are not certified by this review.
