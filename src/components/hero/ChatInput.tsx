type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onSubmit: () => void;
  isLoading?: boolean;
};

export function ChatInput({ value, onChange, placeholder, onSubmit, isLoading = false }: ChatInputProps) {
  return (
    <div className="mx-auto flex h-[60px] w-full max-w-[680px] items-center rounded-full bg-surface-primary px-6 shadow-xl">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            if (!isLoading && value.trim().length > 0) {
              onSubmit();
            }
          }
        }}
        placeholder={placeholder}
        disabled={isLoading}
        className="flex-1 bg-transparent font-body text-[16px] text-fg-secondary placeholder:text-fg-secondary/50 outline-none"
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={value.trim().length === 0 || isLoading}
        className="ml-2 inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-navy font-caption text-[20px] font-bold leading-none text-gold transition-colors hover:bg-royal disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Submit hero prompt"
      >
        →
      </button>
    </div>
  );
}
