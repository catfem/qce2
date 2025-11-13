import { useDropzone } from 'react-dropzone';
import { FILE_ACCEPTED_TYPES } from '../../utils/constants.js';
import { cn } from '../../utils/cn.js';

export function FileDropzone({ onDrop, isProcessing, progress }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: FILE_ACCEPTED_TYPES,
    multiple: true,
    onDrop
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'glass-panel flex cursor-pointer flex-col items-center justify-center gap-3 border-dashed border-white/20 p-10 text-center transition-all hover:border-primary/40 hover:bg-white/10',
        isDragActive && 'border-primary/60 bg-white/10'
      )}
    >
      <input {...getInputProps()} />
      <span className="text-4xl">📄</span>
      <p className="text-lg font-medium text-gradient">Drop your source documents</p>
      <p className="max-w-lg text-sm text-slate-300">
        Supports PDF, DOCX, TXT, and XLSX up to 25 MB each. Files are securely staged in Supabase Storage before Gemini begins extraction.
      </p>
      {isProcessing && (
        <div className="w-full rounded-full border border-white/10 bg-white/5">
          <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
