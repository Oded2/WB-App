type Props = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export default function Button({ children, disabled, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full cursor-pointer rounded-2xl bg-blue-500 p-4 text-center text-slate-50 shadow transition-all hover:bg-blue-600 not-disabled:hover:shadow-lg not-disabled:active:scale-95 disabled:cursor-default disabled:bg-blue-300"
    >
      {children}
    </button>
  );
}
