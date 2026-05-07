export default function Select({ label, error, options = [], placeholder, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`w-full px-3 py-2.5 rounded-lg border text-sm transition-all duration-150
          bg-white dark:bg-slate-800
          text-slate-900 dark:text-slate-100
          border-slate-300 dark:border-slate-600
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:opacity-60
          ${error ? 'border-red-400 focus:ring-red-500' : ''}
          ${className}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
