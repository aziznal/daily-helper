export default function Page() {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center bg-neutral-950 text-white">
      <hr className="w-full border-neutral-600 m-12" />

      <p className="mb-6 text-xl">You left the meeting.</p>

      <h1 className="text-3xl flex gap-2">
        <span> See ya next time! </span>
        <div className="animate-bounce repeat-infinite transition-all">👋</div>
      </h1>

      <hr className="w-full border-neutral-600 m-12" />
    </div>
  );
}
