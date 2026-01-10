A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <RenderFromTemplateContext>
      <ScrollAndFocusHandler segmentPath={[...]}>
        <InnerScrollAndFocusHandler segmentPath={[...]} focusAndScrollRef={{apply:false, ...}}>
          <ErrorBoundary errorComponent={undefined} errorStyles={undefined} errorScripts={undefined}>
            <LoadingBoundary name="/" loading={null}>
              <HTTPAccessFallbackBoundary notFound={<SegmentViewNode>} forbidden={undefined} unauthorized={undefined}>
                <HTTPAccessFallbackErrorBoundary pathname="/signup" notFound={<SegmentViewNode>} forbidden={undefined} ...>
                  <RedirectBoundary>
                    <RedirectErrorBoundary router={{...}}>
                      <InnerLayoutRouter url="/signup" tree={[...]} params={{}} cacheNode={{lazyData:null, ...}} ...>
                        <SegmentViewNode type="layout" pagePath="signup/lay...">
                          <SegmentTrieNode>
                          <SignUpLayout>
                            <html lang="en">
                              <body
-                               className="antialiased"
                              >
                      ...
          ...

error @ intercept-console-error.ts:42
(anonymous) @ react-dom-client.development.js:5729
runWithFiberInDEV @ react-dom-client.development.js:984
emitPendingHydrationWarnings @ react-dom-client.development.js:5728
completeWork @ react-dom-client.development.js:12860
runWithFiberInDEV @ react-dom-client.development.js:987
completeUnitOfWork @ react-dom-client.development.js:19131
performUnitOfWork @ react-dom-client.development.js:19012
workLoopConcurrentByScheduler @ react-dom-client.development.js:18989
renderRootConcurrent @ react-dom-client.development.js:18971
performWorkOnRoot @ react-dom-client.development.js:17832
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20382
performWorkUntilDeadline @ scheduler.development.js:45
<body>
SignUpLayout @ layout.tsx:16
initializeElement @ react-server-dom-turbopack-client.browser.development.js:1933
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:4592
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1820
getOutlinedModel @ react-server-dom-turbopack-client.browser.development.js:2322
parseModelString @ react-server-dom-turbopack-client.browser.development.js:2712
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:4523
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1820
resolveModelChunk @ react-server-dom-turbopack-client.browser.development.js:1664
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:4422
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:4282
processBinaryChunk @ react-server-dom-turbopack-client.browser.development.js:4495
progress @ react-server-dom-turbopack-client.browser.development.js:4767
<SignUpLayout>
Function.all @ VM704 <anonymous>:1
initializeFakeTask @ react-server-dom-turbopack-client.browser.development.js:3372
initializeDebugInfo @ react-server-dom-turbopack-client.browser.development.js:3397
initializeDebugChunk @ react-server-dom-turbopack-client.browser.development.js:1764
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:4371
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:4282
processBinaryChunk @ react-server-dom-turbopack-client.browser.development.js:4495
progress @ react-server-dom-turbopack-client.browser.development.js:4767
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:2767
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:4628
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:5032
module evaluation @ app-index.tsx:211
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateModuleFromParent @ dev-base.ts:162
commonJsRequire @ runtime-utils.ts:389
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:79
loadScriptsInSequence @ app-bootstrap.ts:23
appBootstrap @ app-bootstrap.ts:61
module evaluation @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateRuntimeModule @ dev-base.ts:128
registerChunk @ runtime-backend-dom.ts:57
await in registerChunk
registerChunk @ dev-base.ts:1149
(anonymous) @ dev-backend-dom.ts:126
(anonymous) @ dev-backend-dom.ts:126
auth.ts:29  Error getting current user: Error: Not authenticated
    at getCurrentUser (auth.ts:27:11)
    at AuthProvider.useEffect.fetchUser (useAuth.tsx:34:46)
    at AuthProvider.useEffect (useAuth.tsx:55:5)
    at Object.react_stack_bottom_frame (react-dom-client.development.js:28101:20)
    at runWithFiberInDEV (react-dom-client.development.js:984:30)
    at commitHookEffectListMount (react-dom-client.development.js:13690:29)
    at commitHookPassiveMountEffects (react-dom-client.development.js:13777:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16731:13)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16751:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16751:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16751:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
error @ intercept-console-error.ts:42
getCurrentUser @ auth.ts:29
AuthProvider.useEffect.fetchUser @ useAuth.tsx:34
AuthProvider.useEffect @ useAuth.tsx:55
react_stack_bottom_frame @ react-dom-client.development.js:28101
runWithFiberInDEV @ react-dom-client.development.js:984
commitHookEffectListMount @ react-dom-client.development.js:13690
commitHookPassiveMountEffects @ react-dom-client.development.js:13777
commitPassiveMountOnFiber @ react-dom-client.development.js:16731
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16751
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16751
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16751
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16751
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16751
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16751
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16751
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16766
flushPassiveEffects @ react-dom-client.development.js:19857
(anonymous) @ react-dom-client.development.js:19282
performWorkUntilDeadline @ scheduler.development.js:45
<AuthProvider>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:342
Providers @ Providers.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:28016
renderWithHooksAgain @ react-dom-client.development.js:8082
renderWithHooks @ react-dom-client.development.js:7994
updateFunctionComponent @ react-dom-client.development.js:10499
beginWork @ react-dom-client.development.js:12083
runWithFiberInDEV @ react-dom-client.development.js:984
performUnitOfWork @ react-dom-client.development.js:18995
workLoopConcurrentByScheduler @ react-dom-client.development.js:18989
renderRootConcurrent @ react-dom-client.development.js:18971
performWorkOnRoot @ react-dom-client.development.js:17832
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20382
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
SignUpLayout @ layout.tsx:17
initializeElement @ react-server-dom-turbopack-client.browser.development.js:1933
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:4592
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1820
getOutlinedModel @ react-server-dom-turbopack-client.browser.development.js:2322
parseModelString @ react-server-dom-turbopack-client.browser.development.js:2712
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:4523
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1820
resolveModelChunk @ react-server-dom-turbopack-client.browser.development.js:1664
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:4422
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:4282
processBinaryChunk @ react-server-dom-turbopack-client.browser.development.js:4495
progress @ react-server-dom-turbopack-client.browser.development.js:4767
<SignUpLayout>
Function.all @ VM704 <anonymous>:1
initializeFakeTask @ react-server-dom-turbopack-client.browser.development.js:3372
initializeDebugInfo @ react-server-dom-turbopack-client.browser.development.js:3397
initializeDebugChunk @ react-server-dom-turbopack-client.browser.development.js:1764
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:4371
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:4282
processBinaryChunk @ react-server-dom-turbopack-client.browser.development.js:4495
progress @ react-server-dom-turbopack-client.browser.development.js:4767
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:2767
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:4628
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:5032
module evaluation @ app-index.tsx:211
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateModuleFromParent @ dev-base.ts:162
commonJsRequire @ runtime-utils.ts:389
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:79
loadScriptsInSequence @ app-bootstrap.ts:23
appBootstrap @ app-bootstrap.ts:61
module evaluation @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateRuntimeModule @ dev-base.ts:128
registerChunk @ runtime-backend-dom.ts:57
await in registerChunk
registerChunk @ dev-base.ts:1149
(anonymous) @ dev-backend-dom.ts:126
(anonymous) @ dev-backend-dom.ts:126
auth.ts:29  Error getting current user: Error: Not authenticated
    at getCurrentUser (auth.ts:27:11)
    at AuthProvider.useEffect.fetchUser (useAuth.tsx:34:46)
    at AuthProvider.useEffect (useAuth.tsx:55:5)
    at Object.react_stack_bottom_frame (react-dom-client.development.js:28101:20)
    at runWithFiberInDEV (react-dom-client.development.js:984:30)
    at commitHookEffectListMount (react-dom-client.development.js:13690:29)
    at commitHookPassiveMountEffects (react-dom-client.development.js:13777:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16731:13)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16751:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16751:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16751:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:16723:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:16676:13)
    at commitPassiveMountOnFiber (react-dom-client.development.js:17008:11)
error @ intercept-console-error.ts:42
getCurrentUser @ auth.ts:29
AuthProvider.useEffect.fetchUser @ useAuth.tsx:34
AuthProvider.useEffect @ useAuth.tsx:55
react_stack_bottom_frame @ react-dom-client.development.js:28101
runWithFiberInDEV @ react-dom-client.development.js:984
commitHookEffectListMount @ react-dom-client.development.js:13690
commitHookPassiveMountEffects @ react-dom-client.development.js:13777
commitPassiveMountOnFiber @ react-dom-client.development.js:16731
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16751
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16751
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16751
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16751
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16723
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:17008
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:16676
commitPassiveMountOnFiber @ react-dom-client.development.js:16766
flushPassiveEffects @ react-dom-client.development.js:19857
(anonymous) @ react-dom-client.development.js:19282
performWorkUntilDeadline @ scheduler.development.js:45
<AuthProvider>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:342
Providers @ Providers.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:28016
renderWithHooksAgain @ react-dom-client.development.js:8082
renderWithHooks @ react-dom-client.development.js:7994
updateFunctionComponent @ react-dom-client.development.js:10499
beginWork @ react-dom-client.development.js:12083
runWithFiberInDEV @ react-dom-client.development.js:984
performUnitOfWork @ react-dom-client.development.js:18995
workLoopConcurrentByScheduler @ react-dom-client.development.js:18989
renderRootConcurrent @ react-dom-client.development.js:18971
performWorkOnRoot @ react-dom-client.development.js:17832
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20382
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
RootLayout @ layout.tsx:19
initializeElement @ react-server-dom-turbopack-client.browser.development.js:1933
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:4592
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1820
getOutlinedModel @ react-server-dom-turbopack-client.browser.development.js:2322
parseModelString @ react-server-dom-turbopack-client.browser.development.js:2712
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:4523
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1820
resolveModelChunk @ react-server-dom-turbopack-client.browser.development.js:1664
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:4422
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:4282
processBinaryChunk @ react-server-dom-turbopack-client.browser.development.js:4495
progress @ react-server-dom-turbopack-client.browser.development.js:4767
<RootLayout>
initializeFakeTask @ react-server-dom-turbopack-client.browser.development.js:3372
initializeDebugInfo @ react-server-dom-turbopack-client.browser.development.js:3397
initializeDebugChunk @ react-server-dom-turbopack-client.browser.development.js:1764
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:4371
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:4282
processBinaryChunk @ react-server-dom-turbopack-client.browser.development.js:4495
progress @ react-server-dom-turbopack-client.browser.development.js:4767
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:2767
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:4628
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:5032
module evaluation @ app-index.tsx:211
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateModuleFromParent @ dev-base.ts:162
commonJsRequire @ runtime-utils.ts:389
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:79
loadScriptsInSequence @ app-bootstrap.ts:23
appBootstrap @ app-bootstrap.ts:61
module evaluation @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateRuntimeModule @ dev-base.ts:128
registerChunk @ runtime-backend-dom.ts:57
await in registerChunk
registerChunk @ dev-base.ts:1149
(anonymous) @ dev-backend-dom.ts:126
(anonymous) @ dev-backend-dom.ts:126
signup:1  Access to fetch at 'http://localhost:8000/auth/register' from origin 'http://localhost:3001' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
api.ts:381   POST http://localhost:8000/auth/register net::ERR_FAILED
signUp @ api.ts:381
signUp @ useAuth.tsx:164
handleSubmit @ page.tsx:54
executeDispatch @ react-dom-client.development.js:20541
runWithFiberInDEV @ react-dom-client.development.js:984
processDispatchQueue @ react-dom-client.development.js:20591
(anonymous) @ react-dom-client.development.js:21162
batchedUpdates$1 @ react-dom-client.development.js:3375
dispatchEventForPluginEventSystem @ react-dom-client.development.js:20745
dispatchEvent @ react-dom-client.development.js:25671
dispatchDiscreteEvent @ react-dom-client.development.js:25639
<form>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:342
SignUpPage @ page.tsx:77
react_stack_bottom_frame @ react-dom-client.development.js:28016
renderWithHooksAgain @ react-dom-client.development.js:8082
renderWithHooks @ react-dom-client.development.js:7994
updateFunctionComponent @ react-dom-client.development.js:10499
beginWork @ react-dom-client.development.js:12134
runWithFiberInDEV @ react-dom-client.development.js:984
performUnitOfWork @ react-dom-client.development.js:18995
workLoopConcurrentByScheduler @ react-dom-client.development.js:18989
renderRootConcurrent @ react-dom-client.development.js:18971
performWorkOnRoot @ react-dom-client.development.js:17832
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20382
performWorkUntilDeadline @ scheduler.development.js:45
<SignUpPage>
exports.jsx @ react-jsx-runtime.development.js:342
ClientPageRoot @ client-page.tsx:83
react_stack_bottom_frame @ react-dom-client.development.js:28016
renderWithHooksAgain @ react-dom-client.development.js:8082
renderWithHooks @ react-dom-client.development.js:7994
updateFunctionComponent @ react-dom-client.development.js:10499
beginWork @ react-dom-client.development.js:12083
runWithFiberInDEV @ react-dom-client.development.js:984
performUnitOfWork @ react-dom-client.development.js:18995
workLoopConcurrentByScheduler @ react-dom-client.development.js:18989
renderRootConcurrent @ react-dom-client.development.js:18971
performWorkOnRoot @ react-dom-client.development.js:17832
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20382
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
Function.all @ VM704 <anonymous>:1
Function.all @ VM704 <anonymous>:1
initializeElement @ react-server-dom-turbopack-client.browser.development.js:1932
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:2767
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:4628
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:5032
module evaluation @ app-index.tsx:211
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateModuleFromParent @ dev-base.ts:162
commonJsRequire @ runtime-utils.ts:389
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:79
loadScriptsInSequence @ app-bootstrap.ts:23
appBootstrap @ app-bootstrap.ts:61
module evaluation @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateRuntimeModule @ dev-base.ts:128
registerChunk @ runtime-backend-dom.ts:57
await in registerChunk
registerChunk @ dev-base.ts:1149
(anonymous) @ dev-backend-dom.ts:126
(anonymous) @ dev-backend-dom.ts:126
api.ts:395  Error signing up: TypeError: Failed to fetch
    at Object.signUp (api.ts:381:32)
    at signUp (useAuth.tsx:164:40)
    at handleSubmit (page.tsx:54:13)
    at executeDispatch (react-dom-client.development.js:20541:9)
    at runWithFiberInDEV (react-dom-client.development.js:984:30)
    at processDispatchQueue (react-dom-client.development.js:20591:19)
    at react-dom-client.development.js:21162:9
    at batchedUpdates$1 (react-dom-client.development.js:3375:40)
    at dispatchEventForPluginEventSystem (react-dom-client.development.js:20745:7)
    at dispatchEvent (react-dom-client.development.js:25671:11)
    at dispatchDiscreteEvent (react-dom-client.development.js:25639:11)
error @ intercept-console-error.ts:42
signUp @ api.ts:395
await in signUp
signUp @ useAuth.tsx:164
handleSubmit @ page.tsx:54
executeDispatch @ react-dom-client.development.js:20541
runWithFiberInDEV @ react-dom-client.development.js:984
processDispatchQueue @ react-dom-client.development.js:20591
(anonymous) @ react-dom-client.development.js:21162
batchedUpdates$1 @ react-dom-client.development.js:3375
dispatchEventForPluginEventSystem @ react-dom-client.development.js:20745
dispatchEvent @ react-dom-client.development.js:25671
dispatchDiscreteEvent @ react-dom-client.development.js:25639
<form>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:342
SignUpPage @ page.tsx:77
react_stack_bottom_frame @ react-dom-client.development.js:28016
renderWithHooksAgain @ react-dom-client.development.js:8082
renderWithHooks @ react-dom-client.development.js:7994
updateFunctionComponent @ react-dom-client.development.js:10499
beginWork @ react-dom-client.development.js:12134
runWithFiberInDEV @ react-dom-client.development.js:984
performUnitOfWork @ react-dom-client.development.js:18995
workLoopConcurrentByScheduler @ react-dom-client.development.js:18989
renderRootConcurrent @ react-dom-client.development.js:18971
performWorkOnRoot @ react-dom-client.development.js:17832
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20382
performWorkUntilDeadline @ scheduler.development.js:45
<SignUpPage>
exports.jsx @ react-jsx-runtime.development.js:342
ClientPageRoot @ client-page.tsx:83
react_stack_bottom_frame @ react-dom-client.development.js:28016
renderWithHooksAgain @ react-dom-client.development.js:8082
renderWithHooks @ react-dom-client.development.js:7994
updateFunctionComponent @ react-dom-client.development.js:10499
beginWork @ react-dom-client.development.js:12083
runWithFiberInDEV @ react-dom-client.development.js:984
performUnitOfWork @ react-dom-client.development.js:18995
workLoopConcurrentByScheduler @ react-dom-client.development.js:18989
renderRootConcurrent @ react-dom-client.development.js:18971
performWorkOnRoot @ react-dom-client.development.js:17832
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20382
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
Function.all @ VM704 <anonymous>:1
Function.all @ VM704 <anonymous>:1
initializeElement @ react-server-dom-turbopack-client.browser.development.js:1932
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:2767
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:4628
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:5032
module evaluation @ app-index.tsx:211
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateModuleFromParent @ dev-base.ts:162
commonJsRequire @ runtime-utils.ts:389
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:79
loadScriptsInSequence @ app-bootstrap.ts:23
appBootstrap @ app-bootstrap.ts:61
module evaluation @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateRuntimeModule @ dev-base.ts:128
registerChunk @ runtime-backend-dom.ts:57
await in registerChunk
registerChunk @ dev-base.ts:1149
(anonymous) @ dev-backend-dom.ts:126
(anonymous) @ dev-backend-dom.ts:126
useAuth.tsx:216  Sign up failed: TypeError: Failed to fetch
    at Object.signUp (api.ts:381:32)
    at signUp (useAuth.tsx:164:40)
    at handleSubmit (page.tsx:54:13)
    at executeDispatch (react-dom-client.development.js:20541:9)
    at runWithFiberInDEV (react-dom-client.development.js:984:30)
    at processDispatchQueue (react-dom-client.development.js:20591:19)
    at react-dom-client.development.js:21162:9
    at batchedUpdates$1 (react-dom-client.development.js:3375:40)
    at dispatchEventForPluginEventSystem (react-dom-client.development.js:20745:7)
    at dispatchEvent (react-dom-client.development.js:25671:11)
    at dispatchDiscreteEvent (react-dom-client.development.js:25639:11)
error @ intercept-console-error.ts:42
signUp @ useAuth.tsx:216
await in signUp
handleSubmit @ page.tsx:54
executeDispatch @ react-dom-client.development.js:20541
runWithFiberInDEV @ react-dom-client.development.js:984
processDispatchQueue @ react-dom-client.development.js:20591
(anonymous) @ react-dom-client.development.js:21162
batchedUpdates$1 @ react-dom-client.development.js:3375
dispatchEventForPluginEventSystem @ react-dom-client.development.js:20745
dispatchEvent @ react-dom-client.development.js:25671
dispatchDiscreteEvent @ react-dom-client.development.js:25639
<form>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:342
SignUpPage @ page.tsx:77
react_stack_bottom_frame @ react-dom-client.development.js:28016
renderWithHooksAgain @ react-dom-client.development.js:8082
renderWithHooks @ react-dom-client.development.js:7994
updateFunctionComponent @ react-dom-client.development.js:10499
beginWork @ react-dom-client.development.js:12134
runWithFiberInDEV @ react-dom-client.development.js:984
performUnitOfWork @ react-dom-client.development.js:18995
workLoopConcurrentByScheduler @ react-dom-client.development.js:18989
renderRootConcurrent @ react-dom-client.development.js:18971
performWorkOnRoot @ react-dom-client.development.js:17832
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20382
performWorkUntilDeadline @ scheduler.development.js:45
<SignUpPage>
exports.jsx @ react-jsx-runtime.development.js:342
ClientPageRoot @ client-page.tsx:83
react_stack_bottom_frame @ react-dom-client.development.js:28016
renderWithHooksAgain @ react-dom-client.development.js:8082
renderWithHooks @ react-dom-client.development.js:7994
updateFunctionComponent @ react-dom-client.development.js:10499
beginWork @ react-dom-client.development.js:12083
runWithFiberInDEV @ react-dom-client.development.js:984
performUnitOfWork @ react-dom-client.development.js:18995
workLoopConcurrentByScheduler @ react-dom-client.development.js:18989
renderRootConcurrent @ react-dom-client.development.js:18971
performWorkOnRoot @ react-dom-client.development.js:17832
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20382
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
Function.all @ VM704 <anonymous>:1
Function.all @ VM704 <anonymous>:1
initializeElement @ react-server-dom-turbopack-client.browser.development.js:1932
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:2767
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:4628
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:5032
module evaluation @ app-index.tsx:211
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateModuleFromParent @ dev-base.ts:162
commonJsRequire @ runtime-utils.ts:389
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:79
loadScriptsInSequence @ app-bootstrap.ts:23
appBootstrap @ app-bootstrap.ts:61
module evaluation @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateRuntimeModule @ dev-base.ts:128
registerChunk @ runtime-backend-dom.ts:57
await in registerChunk
registerChunk @ dev-base.ts:1149
(anonymous) @ dev-backend-dom.ts:126
(anonymous) @ dev-backend-dom.ts:126
signup:1  Access to fetch at 'http://localhost:8000/auth/register' from origin 'http://localhost:3001' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
api.ts:381   POST http://localhost:8000/auth/register net::ERR_FAILED
signUp @ api.ts:381
registerUser @ auth.ts:100
signUp @ useAuth.tsx:218
await in signUp
handleSubmit @ page.tsx:54
executeDispatch @ react-dom-client.development.js:20541
runWithFiberInDEV @ react-dom-client.development.js:984
processDispatchQueue @ react-dom-client.development.js:20591
(anonymous) @ react-dom-client.development.js:21162
batchedUpdates$1 @ react-dom-client.development.js:3375
dispatchEventForPluginEventSystem @ react-dom-client.development.js:20745
dispatchEvent @ react-dom-client.development.js:25671
dispatchDiscreteEvent @ react-dom-client.development.js:25639
<form>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:342
SignUpPage @ page.tsx:77
react_stack_bottom_frame @ react-dom-client.development.js:28016
renderWithHooksAgain @ react-dom-client.development.js:8082
renderWithHooks @ react-dom-client.development.js:7994
updateFunctionComponent @ react-dom-client.development.js:10499
beginWork @ react-dom-client.development.js:12134
runWithFiberInDEV @ react-dom-client.development.js:984
performUnitOfWork @ react-dom-client.development.js:18995
workLoopConcurrentByScheduler @ react-dom-client.development.js:18989
renderRootConcurrent @ react-dom-client.development.js:18971
performWorkOnRoot @ react-dom-client.development.js:17832
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20382
performWorkUntilDeadline @ scheduler.development.js:45
<SignUpPage>
exports.jsx @ react-jsx-runtime.development.js:342
ClientPageRoot @ client-page.tsx:83
react_stack_bottom_frame @ react-dom-client.development.js:28016
renderWithHooksAgain @ react-dom-client.development.js:8082
renderWithHooks @ react-dom-client.development.js:7994
updateFunctionComponent @ react-dom-client.development.js:10499
beginWork @ react-dom-client.development.js:12083
runWithFiberInDEV @ react-dom-client.development.js:984
performUnitOfWork @ react-dom-client.development.js:18995
workLoopConcurrentByScheduler @ react-dom-client.development.js:18989
renderRootConcurrent @ react-dom-client.development.js:18971
performWorkOnRoot @ react-dom-client.development.js:17832
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20382
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
Function.all @ VM704 <anonymous>:1
Function.all @ VM704 <anonymous>:1
initializeElement @ react-server-dom-turbopack-client.browser.development.js:1932
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:2767
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:4628
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:5032
module evaluation @ app-index.tsx:211
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateModuleFromParent @ dev-base.ts:162
commonJsRequire @ runtime-utils.ts:389
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:79
loadScriptsInSequence @ app-bootstrap.ts:23
appBootstrap @ app-bootstrap.ts:61
module evaluation @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateRuntimeModule @ dev-base.ts:128
registerChunk @ runtime-backend-dom.ts:57
await in registerChunk
registerChunk @ dev-base.ts:1149
(anonymous) @ dev-backend-dom.ts:126
(anonymous) @ dev-backend-dom.ts:126
api.ts:395  Error signing up: TypeError: Failed to fetch
    at Object.signUp (api.ts:381:32)
    at registerUser (auth.ts:100:38)
    at signUp (useAuth.tsx:218:42)
    at async handleSubmit (page.tsx:54:7)
error @ intercept-console-error.ts:42
signUp @ api.ts:395
await in signUp
registerUser @ auth.ts:100
signUp @ useAuth.tsx:218
await in signUp
handleSubmit @ page.tsx:54
executeDispatch @ react-dom-client.development.js:20541
runWithFiberInDEV @ react-dom-client.development.js:984
processDispatchQueue @ react-dom-client.development.js:20591
(anonymous) @ react-dom-client.development.js:21162
batchedUpdates$1 @ react-dom-client.development.js:3375
dispatchEventForPluginEventSystem @ react-dom-client.development.js:20745
dispatchEvent @ react-dom-client.development.js:25671
dispatchDiscreteEvent @ react-dom-client.development.js:25639
<form>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:342
SignUpPage @ page.tsx:77
react_stack_bottom_frame @ react-dom-client.development.js:28016
renderWithHooksAgain @ react-dom-client.development.js:8082
renderWithHooks @ react-dom-client.development.js:7994
updateFunctionComponent @ react-dom-client.development.js:10499
beginWork @ react-dom-client.development.js:12134
runWithFiberInDEV @ react-dom-client.development.js:984
performUnitOfWork @ react-dom-client.development.js:18995
workLoopConcurrentByScheduler @ react-dom-client.development.js:18989
renderRootConcurrent @ react-dom-client.development.js:18971
performWorkOnRoot @ react-dom-client.development.js:17832
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20382
performWorkUntilDeadline @ scheduler.development.js:45
<SignUpPage>
exports.jsx @ react-jsx-runtime.development.js:342
ClientPageRoot @ client-page.tsx:83
react_stack_bottom_frame @ react-dom-client.development.js:28016
renderWithHooksAgain @ react-dom-client.development.js:8082
renderWithHooks @ react-dom-client.development.js:7994
updateFunctionComponent @ react-dom-client.development.js:10499
beginWork @ react-dom-client.development.js:12083
runWithFiberInDEV @ react-dom-client.development.js:984
performUnitOfWork @ react-dom-client.development.js:18995
workLoopConcurrentByScheduler @ react-dom-client.development.js:18989
renderRootConcurrent @ react-dom-client.development.js:18971
performWorkOnRoot @ react-dom-client.development.js:17832
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20382
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
Function.all @ VM704 <anonymous>:1
Function.all @ VM704 <anonymous>:1
initializeElement @ react-server-dom-turbopack-client.browser.development.js:1932
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:2767
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:4628
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:5032
module evaluation @ app-index.tsx:211
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateModuleFromParent @ dev-base.ts:162
commonJsRequire @ runtime-utils.ts:389
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:79
loadScriptsInSequence @ app-bootstrap.ts:23
appBootstrap @ app-bootstrap.ts:61
module evaluation @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateRuntimeModule @ dev-base.ts:128
registerChunk @ runtime-backend-dom.ts:57
await in registerChunk
registerChunk @ dev-base.ts:1149
(anonymous) @ dev-backend-dom.ts:126
(anonymous) @ dev-backend-dom.ts:126
auth.ts:153  Registration error: TypeError: Failed to fetch
    at Object.signUp (api.ts:381:32)
    at registerUser (auth.ts:100:38)
    at signUp (useAuth.tsx:218:42)
    at async handleSubmit (page.tsx:54:7)
error @ intercept-console-error.ts:42
registerUser @ auth.ts:153
await in registerUser
signUp @ useAuth.tsx:218
await in signUp
handleSubmit @ page.tsx:54
executeDispatch @ react-dom-client.development.js:20541
runWithFiberInDEV @ react-dom-client.development.js:984
processDispatchQueue @ react-dom-client.development.js:20591
(anonymous) @ react-dom-client.development.js:21162
batchedUpdates$1 @ react-dom-client.development.js:3375
dispatchEventForPluginEventSystem @ react-dom-client.development.js:20745
dispatchEvent @ react-dom-client.development.js:25671
dispatchDiscreteEvent @ react-dom-client.development.js:25639
<form>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:342
SignUpPage @ page.tsx:77
react_stack_bottom_frame @ react-dom-client.development.js:28016
renderWithHooksAgain @ react-dom-client.development.js:8082
renderWithHooks @ react-dom-client.development.js:7994
updateFunctionComponent @ react-dom-client.development.js:10499
beginWork @ react-dom-client.development.js:12134
runWithFiberInDEV @ react-dom-client.development.js:984
performUnitOfWork @ react-dom-client.development.js:18995
workLoopConcurrentByScheduler @ react-dom-client.development.js:18989
renderRootConcurrent @ react-dom-client.development.js:18971
performWorkOnRoot @ react-dom-client.development.js:17832
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20382
performWorkUntilDeadline @ scheduler.development.js:45
<SignUpPage>
exports.jsx @ react-jsx-runtime.development.js:342
ClientPageRoot @ client-page.tsx:83
react_stack_bottom_frame @ react-dom-client.development.js:28016
renderWithHooksAgain @ react-dom-client.development.js:8082
renderWithHooks @ react-dom-client.development.js:7994
updateFunctionComponent @ react-dom-client.development.js:10499
beginWork @ react-dom-client.development.js:12083
runWithFiberInDEV @ react-dom-client.development.js:984
performUnitOfWork @ react-dom-client.development.js:18995
workLoopConcurrentByScheduler @ react-dom-client.development.js:18989
renderRootConcurrent @ react-dom-client.development.js:18971
performWorkOnRoot @ react-dom-client.development.js:17832
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20382
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
Function.all @ VM704 <anonymous>:1
Function.all @ VM704 <anonymous>:1
initializeElement @ react-server-dom-turbopack-client.browser.development.js:1932
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:2767
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:4628
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:5032
module evaluation @ app-index.tsx:211
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateModuleFromParent @ dev-base.ts:162
commonJsRequire @ runtime-utils.ts:389
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:79
loadScriptsInSequence @ app-bootstrap.ts:23
appBootstrap @ app-bootstrap.ts:61
module evaluation @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:244
runModuleExecutionHooks @ dev-base.ts:278
instantiateModule @ dev-base.ts:238
getOrInstantiateRuntimeModule @ dev-base.ts:128
registerChunk @ runtime-backend-dom.ts:57
await in registerChunk
registerChunk @ dev-base.ts:1149
(anonymous) @ dev-backend-dom.ts:126
(anonymous) @ dev-backend-dom.ts:126
page.tsx:57  Sign up error: TypeError: Failed to fetch
    at Object.signUp (api.ts:381:32)
    at registerUser (auth.ts:100:38)
    at signUp (useAuth.tsx:218:42)
    at async handleSubmit (page.tsx:54:7)