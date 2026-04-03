import { useState, useEffect, useRef } from 'react';

const StoryDialog = ({ character = '🧙', characterName = 'Mentor', lines = [], onComplete, autoPlay = false }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!lines[currentLine]) return;
    
    setIsTyping(true);
    setDisplayedText('');
    let charIndex = 0;
    const text = lines[currentLine].text || lines[currentLine];

    intervalRef.current = setInterval(() => {
      charIndex++;
      setDisplayedText(text.substring(0, charIndex));
      if (charIndex >= text.length) {
        clearInterval(intervalRef.current);
        setIsTyping(false);
        if (autoPlay && currentLine < lines.length - 1) {
          setTimeout(() => setCurrentLine(prev => prev + 1), 2000);
        }
      }
    }, 30);

    return () => clearInterval(intervalRef.current);
  }, [currentLine, lines, autoPlay]);

  const handleNext = () => {
    if (isTyping) {
      // Skip typing animation
      clearInterval(intervalRef.current);
      const text = lines[currentLine]?.text || lines[currentLine];
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    if (currentLine < lines.length - 1) {
      setCurrentLine(prev => prev + 1);
    } else {
      onComplete?.();
    }
  };

  if (!lines || lines.length === 0) return null;

  const currentLineObj = lines[currentLine];
  const speaker = currentLineObj?.speaker || characterName;
  const speakerEmoji = currentLineObj?.emoji || character;

  return (
    <div className="story-dialog animate-slide-up">
      <div
        className="relative bg-dark-800 border-2 border-primary-500/30 rounded-2xl p-5 cursor-pointer
          hover:border-primary-400/50 transition-all duration-300"
        onClick={handleNext}
        style={{
          boxShadow: '0 0 30px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Character badge */}
        <div className="absolute -top-4 left-4 flex items-center gap-2 px-3 py-1 bg-dark-700 border border-primary-500/30 rounded-full">
          <span className="text-lg">{speakerEmoji}</span>
          <span className="text-xs font-bold text-primary-300 uppercase tracking-wider">{speaker}</span>
        </div>

        {/* Dialog text */}
        <div className="mt-2 min-h-[60px]">
          <p className="text-slate-200 text-sm leading-relaxed font-medium">
            {displayedText}
            {isTyping && <span className="inline-block w-0.5 h-4 bg-primary-400 ml-0.5 animate-pulse" />}
          </p>
        </div>

        {/* Progress & controls */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-dark-600">
          <div className="flex gap-1">
            {lines.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i <= currentLine ? 'bg-primary-400' : 'bg-dark-500'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-600 uppercase tracking-wider">
            {isTyping ? 'Click to skip' : currentLine < lines.length - 1 ? 'Click to continue ▸' : 'Click to start ▸'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StoryDialog;
