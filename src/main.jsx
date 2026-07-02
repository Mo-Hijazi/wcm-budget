import React from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { App, SilentUpdater } from './App.jsx';

// Error monitoring — DSN is safe to expose client-side (write-only, same trust
// model as the Supabase anon key); only enabled in the production build so
// local dev errors don't pollute the dashboard.
if(import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN){
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });
}

// localStorage shim — the app talks to `window.storage` (async KV) for its local
// cache; back it with localStorage. Set before render so the boot effect sees it.
window.storage={get:async(key)=>{try{const v=localStorage.getItem(key);return v?{key,value:v}:null}catch{return null}},set:async(key,value)=>{try{localStorage.setItem(key,value);return{key,value}}catch{return null}},delete:async(key)=>{try{localStorage.removeItem(key);return{key,deleted:true}}catch{return null}},list:async(prefix)=>{try{return{keys:Object.keys(localStorage).filter(k=>!prefix||k.startsWith(prefix))}}catch{return{keys:[]}}}};

const CrashFallback = () => (
  <div role="alert" style={{
    minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',
    justifyContent:'center',gap:16,padding:24,textAlign:'center',
    background:'var(--bg)',color:'var(--text)',
  }}>
    <svg width="40" height="40" viewBox="0 0 26 26" fill="none" stroke="var(--text-dim)" strokeWidth="1.2" aria-hidden="true">
      <g transform="translate(13,13)"><circle r="11"/><circle r="7.5"/><circle r="4" opacity="0.72"/></g>
    </svg>
    <div style={{fontSize:15,color:'var(--text-dim)',maxWidth:340}}>
      Something went wrong. Your data is safe — reloading should fix it.
    </div>
    <button
      onClick={()=>window.location.reload()}
      style={{
        minHeight:44,minWidth:44,padding:'10px 20px',borderRadius:12,
        border:'1px solid var(--text-dim)',background:'transparent',color:'var(--text)',
        fontSize:15,cursor:'pointer',
      }}
    >
      Reload
    </button>
  </div>
);

const root=createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <Sentry.ErrorBoundary fallback={<CrashFallback/>}>
      <App/>
      <SilentUpdater/>
    </Sentry.ErrorBoundary>
  </React.Fragment>
);
