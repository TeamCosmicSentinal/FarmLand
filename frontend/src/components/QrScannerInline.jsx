import React, { useEffect, useRef, useState } from 'react';

// Lightweight QR scanner using html5-qrcode via CDN (no new npm deps).
// Shows an inline scanner and invokes onResult with the decoded text.
export default function QrScannerInline({ onResult }) {
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadScript() {
      if (window.Html5QrcodeScanner) {
        setReady(true);
        return;
      }
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/html5-qrcode';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load QR library'));
        document.body.appendChild(script);
      });
    }

    loadScript()
      .then(() => {
        if (cancelled) return;
        try {
          const id = `qr-reader-${Math.random().toString(36).slice(2)}`;
          const el = document.createElement('div');
          el.id = id;
          if (containerRef.current) containerRef.current.appendChild(el);
          const scanner = new window.Html5QrcodeScanner(id, { fps: 10, qrbox: 250 });
          scanner.render((decoded) => {
            if (onResult) onResult(decoded);
          }, (err) => {
            // ignore frequent decode errors
          });
          scannerRef.current = scanner;
          setReady(true);
        } catch (e) {
          setError(e.message || 'Failed to initialize scanner');
        }
      })
      .catch((e) => setError(e.message));

    return () => {
      cancelled = true;
      // html5-qrcode scanner doesn't require explicit cleanup when using Html5QrcodeScanner
      // but we can try to clear the container
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [onResult]);

  return (
    <div className="bg-white/60 rounded-xl border border-primary/10 p-3">
      {!ready && !error && (
        <div className="text-olive/70 text-sm">Loading camera...</div>
      )}
      {error && (
        <div className="text-error text-sm">{error}</div>
      )}
      <div ref={containerRef} />
      <div className="text-[12px] text-olive/60 mt-2">If the camera doesn’t start, grant camera permission or try another browser.</div>
    </div>
  );
}