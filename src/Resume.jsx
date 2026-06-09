import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';
import gsap from 'gsap';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export default function Resume() {
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const renderPDF = async () => {
      const pdf = await pdfjsLib.getDocument('/Res26.pdf').promise;
      const container = canvasContainerRef.current;
      container.innerHTML = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 2;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.display = 'block';
        container.appendChild(canvas);

        await page.render({
          canvasContext: canvas.getContext('2d'),
          viewport,
        }).promise;
      }

      setLoaded(true);
    };

    renderPDF();
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotateY: x * 8,
        rotateX: y * -8,
        transformPerspective: 800,
        ease: 'power2.out',
        duration: 0.6,
      });
    };

    const onLeave = () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        ease: 'power2.out',
        duration: 0.5,
      });
    };

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    return () => {
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="resume" ref={containerRef}>
      <div
        className={`resume__card${loaded ? ' resume__card--loaded' : ''}`}
        ref={cardRef}
      >
        <div className="resume__pages" ref={canvasContainerRef} />
      </div>
      <a
        href="/Res26.pdf"
        download="OWillhem_Resume.pdf"
        className="resume__download"
      >
        download resume
      </a>
    </div>
  );
}
