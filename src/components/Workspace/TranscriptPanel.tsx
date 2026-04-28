import React, { memo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TranscriptBlock } from '../../types';

interface TranscriptPanelProps {
  transcriptBlocks: TranscriptBlock[];
  isRecording: boolean;
}

interface TranscriptBlockViewProps {
  block: TranscriptBlock;
  isFirst: boolean;
}

const TranscriptBlockView = memo(function TranscriptBlockView({ block, isFirst }: TranscriptBlockViewProps) {
  if (block.unprocessed) {
    return (
      <>
        {!isFirst && <span className="transcript__break" />}
        <div className={`transcript__block transcript__block--unprocessed${block.done ? ' done' : ''}`}>
          <span className="transcript__marker">?</span>
          <span className="transcript__text">{block.rawText}</span>
        </div>
      </>
    );
  }

  return (
    <>
      {!isFirst && <span className="transcript__break" />}
      <div className={`transcript__block${block.done ? ' done' : ''}`}>
        <AnimatePresence initial={false}>
          {block.words.map((word, j) => (
            <motion.span
              key={`${block.id}-${j}`}
              className={`transcript__word ${word.active ? 'transcript__word--active' : 'transcript__word--done'}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              {word.text}{' '}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
});

export function TranscriptPanel({ transcriptBlocks, isRecording }: TranscriptPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new words appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptBlocks]);

  return (
    <div className="transcript-panel">
      <div className="tp-header">
        <span className="tp-title">Transkrypcja</span>
        <div className={`tp-live${isRecording ? ' live' : ''}`} />
      </div>

      <div className="transcript" ref={scrollRef}>
        {transcriptBlocks.length === 0 && (
          <div className="transcript__empty">
            Tu pojawią się słowa, które dyktuje radiolog…
          </div>
        )}

        {transcriptBlocks.map((block, i) => (
          <React.Fragment key={block.id}>
            <TranscriptBlockView block={block} isFirst={i === 0} />
          </React.Fragment>
        ))}
      </div>

      <div className="tp-interim" id="tpInterim" />
    </div>
  );
}
