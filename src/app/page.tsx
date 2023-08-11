import FileUpload from "@/components/FileUpload";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              SBTE Tools
            </h1>
          </h1>
        </div>
        <FileUpload />
      </div>
      <div>
        <a
          href="https://github.com/amjed-ali-k"
          target="_blank"
          className="text-center"
          rel="noreferrer"
        >
          Made by <strong>Amjed Ali K</strong>
        </a>
        <p className="text-xs text-center">GPTC Perinthalmanna</p>
      </div>
    </main>
  );
}
